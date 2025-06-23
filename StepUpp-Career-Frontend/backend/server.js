const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")
const fs = require("fs").promises
const path = require("path")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// File paths
const USERS_FILE = path.join(__dirname, "data", "users.json")
const PENDING_USERS_FILE = path.join(__dirname, "data", "pending-users.json")

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
})

// Helper functions
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    if (error.code === "ENOENT") {
      return []
    }
    throw error
  }
}

async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

async function sendConfirmationEmail(email, confirmationToken, userType) {
  const confirmationUrl = `http://localhost:3000/confirm-email?token=${confirmationToken}`

  const mailOptions = {
    from: process.env.EMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Confirm Your StepUpp Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to StepUpp!</h2>
        <p>Thank you for signing up as a ${userType === "individual" ? "job seeker" : "business"}.</p>
        <p>Please click the button below to confirm your email address:</p>
        <a href="${confirmationUrl}" 
           style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Confirm Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${confirmationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// Routes

// Sign Up
app.post("/api/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      firstName,
      lastName,
      phone,
      // Individual fields
      experience,
      skills,
      // Business fields
      companyName,
      companySize,
      industry,
      description,
      businessType,
    } = req.body

    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ error: "Email, password, and user type are required" })
    }

    // Check if user already exists
    const users = await readJsonFile(USERS_FILE)
    const pendingUsers = await readJsonFile(PENDING_USERS_FILE)

    const existingUser = users.find((user) => user.email === email)
    const existingPendingUser = pendingUsers.find((user) => user.email === email)

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    if (existingPendingUser) {
      return res.status(400).json({ error: "Confirmation email already sent. Please check your inbox." })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate confirmation token
    const confirmationToken = uuidv4()

    // Create user object
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      userType,
      firstName,
      lastName,
      phone,
      confirmationToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    // Add type-specific fields
    if (userType === "individual") {
      newUser.experience = experience
      newUser.skills = skills
    } else if (userType === "business") {
      newUser.companyName = companyName
      newUser.companySize = companySize
      newUser.industry = industry
      newUser.description = description
      newUser.businessType = businessType
    }

    // Save to pending users
    pendingUsers.push(newUser)
    await writeJsonFile(PENDING_USERS_FILE, pendingUsers)

    // Send confirmation email
    await sendConfirmationEmail(email, confirmationToken, userType)

    res.status(201).json({
      message: "User registered successfully. Please check your email to confirm your account.",
      email: email,
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Confirm Email
app.get("/api/confirm-email/:token", async (req, res) => {
  try {
    const { token } = req.params

    const pendingUsers = await readJsonFile(PENDING_USERS_FILE)
    const users = await readJsonFile(USERS_FILE)

    const userIndex = pendingUsers.findIndex((user) => user.confirmationToken === token)

    if (userIndex === -1) {
      return res.status(400).json({ error: "Invalid or expired confirmation token" })
    }

    const user = pendingUsers[userIndex]

    // Check if token is expired
    if (new Date() > new Date(user.expiresAt)) {
      // Remove expired user
      pendingUsers.splice(userIndex, 1)
      await writeJsonFile(PENDING_USERS_FILE, pendingUsers)
      return res.status(400).json({ error: "Confirmation token has expired" })
    }

    // Move user from pending to confirmed users
    const confirmedUser = { ...user }
    delete confirmedUser.confirmationToken
    delete confirmedUser.expiresAt
    confirmedUser.emailConfirmed = true
    confirmedUser.confirmedAt = new Date().toISOString()

    users.push(confirmedUser)
    pendingUsers.splice(userIndex, 1)

    await writeJsonFile(USERS_FILE, users)
    await writeJsonFile(PENDING_USERS_FILE, pendingUsers)

    res.json({ message: "Email confirmed successfully. You can now sign in." })
  } catch (error) {
    console.error("Email confirmation error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Sign In
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const users = await readJsonFile(USERS_FILE)
    const user = users.find((u) => u.email === email)

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    if (!user.emailConfirmed) {
      return res.status(401).json({ error: "Please confirm your email before signing in" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, userType: user.userType }, JWT_SECRET, {
      expiresIn: "7d",
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: "Sign in successful",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Signin error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Resend Confirmation Email
app.post("/api/resend-confirmation", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const pendingUsers = await readJsonFile(PENDING_USERS_FILE)
    const userIndex = pendingUsers.findIndex((user) => user.email === email)

    if (userIndex === -1) {
      return res.status(404).json({ error: "No pending confirmation found for this email" })
    }

    const user = pendingUsers[userIndex]

    // Generate new token and expiry
    const newToken = uuidv4()
    user.confirmationToken = newToken
    user.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    pendingUsers[userIndex] = user
    await writeJsonFile(PENDING_USERS_FILE, pendingUsers)

    // Send new confirmation email
    await sendConfirmationEmail(email, newToken, user.userType)

    res.json({ message: "Confirmation email resent successfully" })
  } catch (error) {
    console.error("Resend confirmation error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get User Profile (protected route)
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const users = await readJsonFile(USERS_FILE)
    const user = users.find((u) => u.id === decoded.userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Profile error:", error)
    res.status(401).json({ error: "Invalid token" })
  }
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📧 Make sure to configure your email settings in .env file`)
})

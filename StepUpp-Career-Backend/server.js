const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")
const fs = require("fs").promises
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.vercel.app", // Replace with your actual domain
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
)
app.use(express.json())

// File paths
const USERS_FILE = path.join(__dirname, "data", "users.json")
const PENDING_USERS_FILE = path.join(__dirname, "data", "pending-users.json")

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Add this at the top after other variables
const DISABLE_EMAIL = process.env.DISABLE_EMAIL === "true"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

// Email configuration
let transporter = null

if (!DISABLE_EMAIL) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

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

// Updated sendConfirmationEmail function with production URL
async function sendConfirmationEmail(email, confirmationToken, userType) {
  const confirmationUrl = `${FRONTEND_URL}/confirm-email?token=${confirmationToken}`

  console.log(`📧 sendConfirmationEmail called for: ${email}`)
  console.log(`📧 DISABLE_EMAIL: ${DISABLE_EMAIL}`)
  console.log(`📧 Confirmation URL: ${confirmationUrl}`)

  if (DISABLE_EMAIL) {
    console.log(`📧 EMAIL DISABLED - Confirmation link for ${email}:`)
    console.log(`🔗 ${confirmationUrl}`)
    console.log(`📋 Copy this link and paste it in your browser to confirm the account`)
    return { success: true, message: "Email disabled - check console for confirmation link" }
  }

  if (!transporter) {
    console.log(`❌ No transporter configured`)
    throw new Error("Email transporter not configured")
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
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

  try {
    console.log(`📧 Attempting to send email to: ${email}`)
    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Confirmation email sent to ${email}`)
    console.log(`📬 Message ID: ${result.messageId}`)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("❌ Email sending failed:", error.message)
    throw error
  }
}

// Test email configuration on startup
async function testEmailConfig() {
  if (DISABLE_EMAIL) {
    console.log("📧 Email is DISABLED - confirmation links will be shown in console")
    return
  }

  if (!transporter) {
    console.log("⚠️  Email transporter not configured")
    return
  }

  try {
    await transporter.verify()
    console.log("✅ Email configuration is valid")
  } catch (error) {
    console.log("⚠️  Email configuration error:", error.message)
    console.log("📧 Please check your EMAIL_USER and EMAIL_PASS environment variables")
    console.log("💡 Or set DISABLE_EMAIL=true to disable email sending")
  }
}

// Routes

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "StepUpp Backend API",
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Sign Up
app.post("/api/signup", async (req, res) => {
  try {
    console.log(`📝 Signup request received`)
    console.log(`📝 Request body:`, JSON.stringify(req.body, null, 2))

    const {
      email,
      password,
      userType,
      firstName,
      lastName,
      phone,
      experience,
      skills,
      companyName,
      companySize,
      industry,
      description,
      businessType,
    } = req.body

    console.log(`📝 Extracted data:`)
    console.log(`   Email: ${email}`)
    console.log(`   UserType: ${userType}`)
    console.log(`   Has Password: ${!!password}`)

    // Validation
    if (!email || !password || !userType) {
      console.log(`❌ Validation failed - missing required fields`)
      return res.status(400).json({
        error: "Email, password, and user type are required",
        received: {
          email: !!email,
          password: !!password,
          userType: !!userType,
        },
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log(`❌ Invalid email format: ${email}`)
      return res.status(400).json({ error: "Please enter a valid email address" })
    }

    // Password validation
    if (password.length < 6) {
      console.log(`❌ Password too short`)
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    // UserType validation
    if (!["individual", "business"].includes(userType)) {
      console.log(`❌ Invalid userType: ${userType}`)
      return res.status(400).json({ error: "User type must be 'individual' or 'business'" })
    }

    console.log(`✅ Validation passed`)

    const users = await readJsonFile(USERS_FILE)
    const pendingUsers = await readJsonFile(PENDING_USERS_FILE)

    console.log(`📊 Current users: ${users.length}, Pending users: ${pendingUsers.length}`)

    const existingUser = users.find((user) => user.email === email)
    const existingPendingUser = pendingUsers.find((user) => user.email === email)

    if (existingUser) {
      console.log(`❌ User already exists: ${email}`)
      return res.status(400).json({ error: "User already exists and is confirmed" })
    }

    if (existingPendingUser) {
      console.log(`⚠️  Pending user exists: ${email}`)
      return res.status(400).json({
        error: "Confirmation email already sent. Please check your inbox or try resending.",
        canResend: true,
      })
    }

    console.log(`💾 Creating new user...`)

    const hashedPassword = await bcrypt.hash(password, 10)
    const confirmationToken = uuidv4()

    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      userType,
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      confirmationToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    if (userType === "individual") {
      newUser.experience = experience || ""
      newUser.skills = skills || ""
    } else if (userType === "business") {
      newUser.companyName = companyName || ""
      newUser.companySize = companySize || ""
      newUser.industry = industry || ""
      newUser.description = description || ""
      newUser.businessType = businessType || "startup"
    }

    console.log(`💾 Saving user to pending: ${email}`)

    pendingUsers.push(newUser)
    await writeJsonFile(PENDING_USERS_FILE, pendingUsers)

    console.log(`✅ User saved to pending list`)
    console.log(`📧 Now attempting to send confirmation email...`)

    try {
      const emailResult = await sendConfirmationEmail(email, confirmationToken, userType)
      console.log(`✅ Email process completed for: ${email}`)

      res.status(201).json({
        message: DISABLE_EMAIL
          ? "User registered successfully. Check the console for the confirmation link."
          : "User registered successfully. Please check your email to confirm your account.",
        email: email,
        emailDisabled: DISABLE_EMAIL,
        debug: {
          userSaved: true,
          emailSent: true,
          messageId: emailResult.messageId || "N/A",
        },
      })
    } catch (emailError) {
      console.error(`❌ Email failed for ${email}:`, emailError.message)

      // Don't remove user from pending if email is disabled (for testing)
      if (!DISABLE_EMAIL) {
        const updatedPendingUsers = await readJsonFile(PENDING_USERS_FILE)
        const filteredUsers = updatedPendingUsers.filter((user) => user.email !== email)
        await writeJsonFile(PENDING_USERS_FILE, filteredUsers)
        console.log(`🗑️  Removed ${email} from pending due to email failure`)
      }

      return res.status(500).json({
        error: DISABLE_EMAIL
          ? "Registration successful but email is disabled. Check console for confirmation link."
          : "Failed to send confirmation email. Please try again or contact support.",
        emailError: true,
        debug: {
          userSaved: true,
          emailSent: false,
          emailError: emailError.message,
        },
      })
    }
  } catch (error) {
    console.error("❌ Signup error:", error)
    res.status(500).json({
      error: "Internal server error",
      debug: {
        message: error.message,
        stack: error.stack,
      },
    })
  }
})

// Add a debug endpoint to check pending users
app.get("/api/debug/pending", async (req, res) => {
  try {
    const pendingUsers = await readJsonFile(PENDING_USERS_FILE)
    const users = await readJsonFile(USERS_FILE)

    res.json({
      pendingUsers: pendingUsers.map((u) => ({
        email: u.email,
        userType: u.userType,
        createdAt: u.createdAt,
        expiresAt: u.expiresAt,
      })),
      confirmedUsers: users.map((u) => ({
        email: u.email,
        userType: u.userType,
        emailConfirmed: u.emailConfirmed,
      })),
      counts: {
        pending: pendingUsers.length,
        confirmed: users.length,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add endpoint to manually confirm a user (for testing)
app.post("/api/debug/confirm", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const pendingUsers = await readJsonFile(PENDING_USERS_FILE)
    const users = await readJsonFile(USERS_FILE)

    const userIndex = pendingUsers.findIndex((user) => user.email === email)

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found in pending list" })
    }

    const user = pendingUsers[userIndex]

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

    res.json({ message: `User ${email} manually confirmed successfully` })
  } catch (error) {
    res.status(500).json({ error: error.message })
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

    if (new Date() > new Date(user.expiresAt)) {
      pendingUsers.splice(userIndex, 1)
      await writeJsonFile(PENDING_USERS_FILE, pendingUsers)
      return res.status(400).json({ error: "Confirmation token has expired" })
    }

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

    const token = jwt.sign({ userId: user.id, email: user.email, userType: user.userType }, JWT_SECRET, {
      expiresIn: "7d",
    })

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

    const newToken = uuidv4()
    user.confirmationToken = newToken
    user.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    pendingUsers[userIndex] = user
    await writeJsonFile(PENDING_USERS_FILE, pendingUsers)

    try {
      await sendConfirmationEmail(email, newToken, user.userType)
      res.json({
        message: DISABLE_EMAIL
          ? "New confirmation link generated. Check console."
          : "Confirmation email resent successfully",
      })
    } catch (emailError) {
      res.status(500).json({ error: "Failed to resend confirmation email" })
    }
  } catch (error) {
    console.error("Resend confirmation error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get User Profile
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

// Debug email configuration endpoint
app.get("/api/debug/email", async (req, res) => {
  try {
    const emailConfig = {
      emailUser: process.env.EMAIL_USER ? "✅ SET" : "❌ NOT SET",
      emailPass: process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET",
      emailDisabled: process.env.DISABLE_EMAIL === "true",
      frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
      nodeEnv: process.env.NODE_ENV || "development",
    }

    // Test transporter if email is enabled
    let transporterStatus = "Not tested"
    if (!process.env.DISABLE_EMAIL && transporter) {
      try {
        await transporter.verify()
        transporterStatus = "✅ Working"
      } catch (error) {
        transporterStatus = `❌ Failed: ${error.message}`
      }
    }

    res.json({
      emailConfig,
      transporterStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Test send email endpoint
app.post("/api/debug/send-test-email", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    if (process.env.DISABLE_EMAIL === "true") {
      return res.json({ message: "Email is disabled. Check console for links." })
    }

    if (!transporter) {
      return res.status(500).json({ error: "Email transporter not configured" })
    }

    const testEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "StepUpp Test Email - " + new Date().toLocaleString(),
      html: `
        <h2>🎉 Test Email Successful!</h2>
        <p>Your StepUpp email configuration is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
      `,
    }

    const result = await transporter.sendMail(testEmail)

    res.json({
      message: "Test email sent successfully!",
      messageId: result.messageId,
      to: email,
    })
  } catch (error) {
    console.error("Test email failed:", error)
    res.status(500).json({
      error: "Failed to send test email",
      details: error.message,
    })
  }
})

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📧 Testing email configuration...`)
  await testEmailConfig()
  console.log(`📁 Data will be stored in: ${path.join(__dirname, "data")}`)
})

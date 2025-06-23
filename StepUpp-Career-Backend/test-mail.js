const nodemailer = require("nodemailer")
require("dotenv").config()

async function detailedEmailTest() {
  console.log("🧪 DETAILED EMAIL CONFIGURATION TEST")
  console.log("=" * 50)

  // Check environment variables
  console.log("📋 Environment Variables:")
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER || "❌ NOT SET"}`)
  console.log(
    `EMAIL_PASS: ${process.env.EMAIL_PASS ? "✅ SET (length: " + process.env.EMAIL_PASS.length + ")" : "❌ NOT SET"}`,
  )
  console.log(`DISABLE_EMAIL: ${process.env.DISABLE_EMAIL || "false"}`)

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ Missing email credentials in .env file")
    return
  }

  // Create transporter with detailed config
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debug output
    logger: true, // Log to console
  })

  try {
    console.log("\n🔍 Step 1: Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully!")

    console.log("\n📧 Step 2: Sending test email...")
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourselfx
      subject: "🎉 StepUpp Email Test - " + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">✅ Email Configuration Working!</h2>
          <p>Your StepUpp backend can successfully send emails.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV || "development"}</p>
          </div>
          <p style="color: #059669;">If you received this email, your configuration is working perfectly! 🎉</p>
        </div>
      `,
    }

    const result = await transporter.sendMail(testEmail)
    console.log("✅ Test email sent successfully!")
    console.log(`📬 Message ID: ${result.messageId}`)
    console.log(`📨 Check your inbox: ${process.env.EMAIL_USER}`)
  } catch (error) {
    console.error("❌ Email test failed:")
    console.error("Error message:", error.message)
    console.error("Error code:", error.code)

    // Specific error handling
    if (error.message.includes("Invalid login")) {
      console.log("\n🔧 INVALID LOGIN ERROR - SOLUTIONS:")
      console.log("1. ✅ Make sure 2-Factor Authentication is enabled on Gmail")
      console.log("2. ✅ Generate a NEW App Password (16 characters)")
      console.log("3. ✅ Use the App Password (not your regular Gmail password)")
      console.log("4. ✅ Remove any spaces from the app password")
      console.log("5. ✅ Make sure EMAIL_USER is your full Gmail address")
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("\n🔧 CONNECTION ERROR - SOLUTIONS:")
      console.log("1. ✅ Check your internet connection")
      console.log("2. ✅ Try disabling VPN if you're using one")
      console.log("3. ✅ Check if your firewall is blocking the connection")
    } else if (error.message.includes("ETIMEDOUT")) {
      console.log("\n🔧 TIMEOUT ERROR - SOLUTIONS:")
      console.log("1. ✅ Check your internet connection")
      console.log("2. ✅ Try again in a few minutes")
      console.log("3. ✅ Consider using a different email service")
    }
  }
}

detailedEmailTest()

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noorjjj2006@gmail.com",
    pass: "crfj epkw eblp rata",
  },
});

const contactController = {
  // Send contact form message
  sendMessage: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }

      // Send email to admin
      const adminMailOptions = {
        from: "noorjjj2006@gmail.com",
        to: "noorjjj2006@gmail.com", // Your admin email
        subject: `Contact Form: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin: 15px 0; }
              .field strong { color: #667eea; display: block; margin-bottom: 5px; }
              .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <strong>From:</strong>
                  <p>${name}</p>
                </div>
                <div class="field">
                  <strong>Email:</strong>
                  <p><a href="mailto:${email}">${email}</a></p>
                </div>
                <div class="field">
                  <strong>Subject:</strong>
                  <p>${subject}</p>
                </div>
                <div class="message-box">
                  <strong>Message:</strong>
                  <p>${message}</p>
                </div>
                <p style="margin-top: 30px; color: #666; font-size: 12px;">
                  Received: ${new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      // Send confirmation email to user
      const userMailOptions = {
        from: "noorjjj2006@gmail.com",
        to: email,
        subject: "We received your message - EventHub",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Message Received!</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for contacting EventHub! We've received your message and will get back to you as soon as possible.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Your Message:</strong></p>
                  <p style="color: #666;">${message}</p>
                </div>
                
                <p>Our typical response time is within 24-48 hours. If your inquiry is urgent, please call us at <strong>+1 (234) 567-890</strong>.</p>
                
                <p>Best regards,<br><strong>The EventHub Team</strong></p>
              </div>
              <div class="footer">
                <p>EventHub - Connecting People Through Events</p>
                <p>&copy; ${new Date().getFullYear()} EventHub. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      // Send both emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);

      console.log('✅ Contact form email sent from:', email);

      res.status(200).json({ 
        success: true,
        message: 'Message sent successfully! We will get back to you soon.' 
      });
    } catch (error) {
      console.error('❌ Error sending contact form:', error);
      res.status(500).json({ 
        message: 'Failed to send message. Please try again later.',
        error: error.message 
      });
    }
  }
};

module.exports = contactController;
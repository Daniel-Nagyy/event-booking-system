const QRCode = require('qrcode');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const qrCodeGenerator = {
  // Generate unique token for QR code
  generateToken: (bookingId, userId, eventId) => {
    const payload = {
      bookingId: bookingId.toString(),
      userId: userId.toString(),
      eventId: eventId.toString(),
      timestamp: Date.now(),
      random: crypto.randomBytes(16).toString('hex')
    };

    // Sign with JWT (expires in 1 year)
    const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '365d' });
    return token;
  },

  // Generate QR code image as base64
  generateQRCode: async (token) => {
    try {
      const appUrl = process.env.APP_URL || 'http://localhost:5173';
      const verificationUrl = `${appUrl}/verify-ticket/${token}`;
      
      // Generate QR code as base64 data URL
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  },

  // Verify QR token
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.secretkey);
      return {
        valid: true,
        data: decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
};

module.exports = qrCodeGenerator;
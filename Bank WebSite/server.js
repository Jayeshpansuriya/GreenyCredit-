const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/contact', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3001'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // For development only
    }
  });
};

// Email template function
const createEmailTemplate = (formData) => {
  const { name, email, phone, inquiryType, message } = formData;
  
  return {
    subject: `${process.env.SUBJECT_PREFIX || '[Contact Form]'} New inquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <div style="background-color: #004080; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0;">Greeny Credit Co-operative Bank</h1>
          <p style="margin: 5px 0 0 0;">New Contact Form Submission</p>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; margin-bottom: 20px;">
          <h2 style="color: #004080; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; width: 150px;">Full Name:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 10px 0;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold;">Inquiry Type:</td>
              <td style="padding: 10px 0;">${inquiryType}</td>
            </tr>
          </table>
        </div>
        
        <div style="padding: 20px; background-color: white; border: 1px solid #ddd;">
          <h3 style="color: #004080; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-left: 4px solid #004080;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            This email was sent from the Greeny Credit Co-operative Bank website contact form.
            <br>Submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `,
    text: `
New Contact Form Submission - Greeny Credit Co-operative Bank

Contact Information:
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Inquiry Type: ${inquiryType}

Message:
${message}

Submitted on: ${new Date().toLocaleString()}
    `
  };
};

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[0-9\(\)\-\s]+$/)
    .withMessage('Please provide a valid phone number'),
    
  body('inquiryType')
    .isIn(['personal-loan', 'gold-loan', 'vehicle-loan', 'business-loan', 'fixed-deposit', 'recurring-deposit', 'general'])
    .withMessage('Please select a valid inquiry type'),
    
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
    
  body('consent')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('You must accept the privacy policy');
      }
      return true;
    })
];

// Contact form endpoint
app.post('/api/contact', contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, inquiryType, message, consent } = req.body;

    // Create email content
    const emailTemplate = createEmailTemplate({ name, email, phone, inquiryType, message });

    // Create transporter
    const transporter = createTransporter();

    // Verify SMTP connection
    await transporter.verify();

    // Send email to organization
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Contact Form'}" <${process.env.EMAIL_USER}>`,
      to: process.env.ORGANIZATION_EMAIL || 'info@geenycredit.com',
      replyTo: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationEmail = {
      from: `"Greeny Credit Co-operative Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Greeny Credit Co-operative Bank',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #004080; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">Greeny Credit Co-operative Bank</h1>
            <p style="margin: 5px 0 0 0;">Thank you for your inquiry</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            
            <p>Thank you for contacting Greeny Credit Co-operative Bank. We have received your inquiry regarding <strong>${inquiryType}</strong> and our team will get back to you as soon as possible.</p>
            
            <p>Here's a summary of your submission:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
              <li><strong>Inquiry Type:</strong> ${inquiryType}</li>
              <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            
            <p>If you have any urgent queries, please feel free to call us at <strong>+1 234 567 8900</strong> during our banking hours:</p>
            <ul>
              <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
              <li>Saturday: 10:00 AM - 2:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
            
            <p>Best regards,<br>
            Customer Service Team<br>
            Greeny Credit Co-operative Bank</p>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This is an automated message. Please do not reply to this email.
              <br>© 2023 Greeny Credit Co-operative Bank. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Dear ${name},

Thank you for contacting Greeny Credit Co-operative Bank. We have received your inquiry regarding ${inquiryType} and our team will get back to you as soon as possible.

Here's a summary of your submission:
- Name: ${name}
- Email: ${email}  
- Phone: ${phone || 'Not provided'}
- Inquiry Type: ${inquiryType}
- Submitted: ${new Date().toLocaleString()}

If you have any urgent queries, please feel free to call us at +1 234 567 8900 during our banking hours:
- Monday - Friday: 9:00 AM - 5:00 PM
- Saturday: 10:00 AM - 2:00 PM  
- Sunday: Closed

Best regards,
Customer Service Team
Greeny Credit Co-operative Bank
      `
    };

    await transporter.sendMail(confirmationEmail);

    // Log successful submission (in production, use proper logging)
    console.log(`Contact form submitted successfully by ${name} (${email}) at ${new Date().toISOString()}`);

    res.status(200).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose internal errors to client
    res.status(500).json({
      success: false,
      message: 'There was an error sending your message. Please try again later or contact us directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Greeny Credit Backend API'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email configured for: ${process.env.ORGANIZATION_EMAIL}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

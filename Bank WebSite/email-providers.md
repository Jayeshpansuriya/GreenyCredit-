# Email Provider Configuration Guide

This document provides configuration settings for popular email providers.

## Gmail (Recommended)

**Prerequisites:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## Outlook/Hotmail

```env
EMAIL_HOST=smtp.live.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

## Yahoo Mail

**Prerequisites:**
1. Enable "Less secure app access" or use App Password

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-password
```

## Zoho Mail

```env
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@zoho.com
EMAIL_PASS=your-password
```

## Custom SMTP Server

```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
```

## Amazon SES

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-access-key-id
EMAIL_PASS=your-secret-access-key
```

## SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## Mailgun

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
```

## Port Information

- **Port 587**: TLS encryption (recommended)
- **Port 465**: SSL encryption (use with `EMAIL_SECURE=true`)
- **Port 25**: No encryption (not recommended)

## Testing Email Configuration

You can test your email configuration by starting the server and using the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Or by submitting a test contact form through your website.

## Troubleshooting

### Gmail Issues
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure apps" is disabled (use App Password instead)

### General Issues
- Verify SMTP server address and port
- Check firewall settings
- Ensure credentials are correct
- Look at server logs for detailed error messages

### Common Error Messages

**"Invalid login"**: Wrong username/password
**"Connection refused"**: Wrong SMTP server or port
**"Certificate error"**: Set `EMAIL_SECURE=false` for port 587

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private isDevelopmentMode: boolean;

  constructor() {
    // Check if we have email credentials
    this.isDevelopmentMode = !process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD;

    if (this.isDevelopmentMode) {
      console.log('📧 Email service running in development mode - emails will be logged to console');
      return;
    }

    // Create transporter with improved timeout and error handling
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
      // Improved timeout settings for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 60000, // 60 seconds
      socketTimeout: 60000, // 60 seconds
      // Additional settings for better reliability
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000, // Rate limiting
      rateLimit: 5, // Max 5 messages per second
      // TLS options
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    });

    // Don't verify connection immediately to avoid blocking startup
    setTimeout(() => this.verifyConnection(), 2000);
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
    } catch (error) {
      console.warn('⚠️ Email service connection failed:', error.message);
      console.log('📧 Falling back to development mode - emails will be logged to console');
      this.isDevelopmentMode = true;
    }
  }

  async sendOTPEmail(email: string, otp: string, name: string) {
    // Check if we're in development mode
    if (this.isDevelopmentMode || !process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD) {
      console.log('📧 DEVELOPMENT MODE - OTP Email would be sent to:', email);
      console.log('🎯 OTP Code:', otp);
      console.log('👤 For user:', name);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: email,
      subject: 'Email Verification - MFU 2ndHand',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .container { 
              background: #f9f9f9; 
              padding: 30px; 
              border-radius: 10px; 
              border: 1px solid #ddd; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .logo { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 15px; 
              border-radius: 8px; 
              font-size: 24px; 
              font-weight: bold; 
            }
            .otp-box { 
              background: #fff; 
              border: 2px solid #667eea; 
              border-radius: 8px; 
              padding: 20px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .otp-code { 
              font-size: 32px; 
              font-weight: bold; 
              color: #667eea; 
              letter-spacing: 5px; 
            }
            .info { 
              background: #e8f4fd; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 14px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">MFU 2ndHand</div>
              <h2>Email Verification Required</h2>
            </div>
            
            <p>Hello ${name},</p>
            
            <p>Thank you for registering with MFU 2ndHand! To complete your registration and secure your account, please verify your email address.</p>
            
            <div class="otp-box">
              <p>Your verification code is:</p>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="info">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in 10 minutes</li>
                <li>Enter this code on the verification page to activate your account</li>
                <li>If you didn't create this account, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the code, you can request a new one from the verification page.</p>
            
            <div class="footer">
              <p>This is an automated message from MFU 2ndHand.</p>
              <p>© 2024 MFU 2ndHand Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully to:', email);
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error.message);
      
      // Log the OTP for development testing
      console.log('📧 EMAIL FALLBACK - OTP for', email, 'is:', otp);
      
      // Don't throw error, just log it for development
      console.log('🔄 Continuing with fallback logging...');
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    // Check if we're in development mode
    if (this.isDevelopmentMode || !process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD) {
      console.log('📧 DEVELOPMENT MODE - Welcome Email would be sent to:', email);
      console.log('👤 For user:', name);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: email,
      subject: 'Welcome to MFU 2ndHand!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MFU 2ndHand</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .container { 
              background: #f9f9f9; 
              padding: 30px; 
              border-radius: 10px; 
              border: 1px solid #ddd; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .logo { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 15px; 
              border-radius: 8px; 
              font-size: 24px; 
              font-weight: bold; 
            }
            .success { 
              background: #d4edda; 
              color: #155724; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">MFU 2ndHand</div>
            </div>
            
            <div class="success">
              <h2>🎉 Email Verified Successfully!</h2>
              <p>Your email has been verified and your account is now active.</p>
            </div>
            
            <p>Hello ${name},</p>
            
            <p>Welcome to MFU 2ndHand! Your account has been successfully created and verified.</p>
            
            <p>You can now:</p>
            <ul>
              <li>Browse amazing second-hand products</li>
              <li>Create your seller profile to start selling</li>
              <li>Add items to your cart and make purchases</li>
              <li>Connect with other community members</li>
            </ul>
            
            <p>Start exploring our marketplace today!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Visit Marketplace</a>
            </div>
            
            <div class="footer">
              <p>© 2024 MFU 2ndHand Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully to:', email);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error.message);
      
      // Log for development
      if (this.isDevelopmentMode || process.env.NODE_ENV === 'development') {
        console.log('📧 EMAIL FALLBACK - Welcome email for', email, 'would be sent');
      }
    }
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    // Check if we're in development mode
    if (this.isDevelopmentMode || !process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD) {
      console.log('📧 DEVELOPMENT MODE - Email would be sent to:', options.to);
      console.log('📋 Subject:', options.subject);
      console.log('📝 Content preview:', options.html.substring(0, 100) + '...');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', options.to);
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      
      // Log for development
      if (this.isDevelopmentMode || process.env.NODE_ENV === 'development') {
        console.log('📧 EMAIL FALLBACK - Email for', options.to, 'would be sent');
      }
    }
  }
}
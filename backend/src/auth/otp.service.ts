import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  generateOTP(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateEmailVerificationToken(): string {
    // Generate a secure random token for email verification
    return crypto.randomBytes(32).toString('hex');
  }

  generateResetToken(): string {
    // Generate a secure random token for password reset
    return crypto.randomBytes(32).toString('hex');
  }

  isOTPValid(generatedOTP: string, providedOTP: string, expiresAt: Date): boolean {
    // Check if OTP matches and hasn't expired
    const now = new Date();
    return generatedOTP === providedOTP && expiresAt > now;
  }

  isTokenValid(token: string, expiresAt: Date): boolean {
    // Check if token is valid and hasn't expired
    const now = new Date();
    return token && expiresAt > now;
  }

  getExpirationTime(minutes: number = 10): Date {
    // Get expiration time for OTP/token
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + minutes);
    return expiration;
  }

  generateSecureHash(data: string): string {
    // Generate a secure hash for sensitive data
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
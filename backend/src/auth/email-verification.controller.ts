import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { OtpService } from './otp.service';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';

@Controller('auth')
export class EmailVerificationController {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private otpService: OtpService,
  ) {}

  @Post('send-verification-email')
  async sendVerificationEmail(@Body() dto: ResendVerificationDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.isEmailVerified) {
        return {
          message: 'Email is already verified',
          status: 'already_verified',
        };
      }

      // Generate new OTP
      const otp = this.otpService.generateOTP();
      const otpExpires = this.otpService.getExpirationTime(10); // 10 minutes

      // Save OTP to database
      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          otpCode: otp,
          otpExpires: otpExpires,
        },
      });

      // Send email
      await this.emailService.sendOTPEmail(dto.email, otp, user.name);

      return {
        message: 'Verification email sent successfully',
        status: 'sent',
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new HttpException(
        'Failed to send verification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.isEmailVerified) {
        return {
          message: 'Email is already verified',
          status: 'already_verified',
        };
      }

      // Check OTP validity
      if (!user.otpCode || !user.otpExpires) {
        throw new BadRequestException('No OTP found. Please request a new verification email.');
      }

      const isValidOTP = this.otpService.isOTPValid(
        user.otpCode,
        dto.otp,
        user.otpExpires,
      );

      if (!isValidOTP) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      // Mark email as verified and clear OTP
      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          isEmailVerified: true,
          otpCode: null,
          otpExpires: null,
        },
      });

      // Send welcome email
      await this.emailService.sendWelcomeEmail(dto.email, user.name);

      return {
        message: 'Email verified successfully',
        status: 'verified',
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to verify email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('check-verification-status')
  async checkVerificationStatus(@Body() dto: ResendVerificationDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: {
          isEmailVerified: true,
          otpCode: true,
          otpExpires: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        email: dto.email,
        isVerified: user.isEmailVerified,
        hasPendingOTP: !!(user.otpCode && user.otpExpires),
      };
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw new HttpException(
        'Failed to check verification status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
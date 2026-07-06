import { prisma } from "../../config/database";
import bcrypt from "bcrypt";
import { AppError } from "../shared/errors";
import { StatusCodes } from "http-status-codes";
import { generateTokens, verifyRefreshToken, JwtPayload } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { addEmailJob } from "../../jobs/email.queue";
export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new AppError("Invalid credentials or account disabled", StatusCodes.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });

    // Save refresh token
    const decodedRefresh = verifyRefreshToken(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(decodedRefresh.exp! * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return tokens;
  }

  static async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      throw new AppError("Invalid or expired refresh token", StatusCodes.UNAUTHORIZED);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.revoked) {
      // In a strict implementation, if token is revoked, we might revoke all tokens for user.
      throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      throw new AppError("User not found or disabled", StatusCodes.UNAUTHORIZED);
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const tokens = generateTokens({ userId: user.id, role: user.role });
    const decodedNewRefresh = verifyRefreshToken(tokens.refreshToken);
    
    // Save new token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(decodedNewRefresh.exp! * 1000),
      },
    });

    return tokens;
  }

  static async logout(refreshToken: string) {
    try {
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    } catch (e) {
      // Ignore errors if token doesn't exist
    }
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      // We shouldn't reveal if user exists or not
      return;
    }

    // Generate a short-lived token
    const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const resetLink = `${env.CORS_ORIGIN}/reset-password?token=${token}`;

    await addEmailJob({
      to: user.email,
      subject: "Password Reset Request",
      body: `Click the following link to reset your password: ${resetLink}`,
    });
  }

  static async resetPassword(token: string, newPassword: string) {
    let payload;
    try {
      payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch (e) {
      throw new AppError("Invalid or expired reset token", StatusCodes.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}

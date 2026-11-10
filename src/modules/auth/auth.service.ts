import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DataStoreService } from '../../database/data-store.service';
import { UserRole } from '../../schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: { email: string; password: string; fullName: string; phone?: string; role?: UserRole }) {
    const existing = this.dataStore.users.find((u) => u.email.toLowerCase() === dto.email.toLowerCase());
    if (existing) {
      throw new BadRequestException('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const assignedRole = dto.role || UserRole.CUSTOMER;

    const newUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      fullName: dto.fullName.trim(),
      phone: dto.phone || '',
      roles: [assignedRole],
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    this.dataStore.users.push(newUser);

    // If customer, initialize Customer profile
    if (assignedRole === UserRole.CUSTOMER) {
      const newCustomer = {
        _id: `cust_${Date.now()}`,
        userId: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        onboardingStep: 1,
        isProfileComplete: false,
        preferences: [],
        createdAt: new Date(),
      };
      this.dataStore.customers.push(newCustomer);
    }

    // If provider, initialize Provider profile
    if (assignedRole === UserRole.PROVIDER) {
      const newProvider = {
        _id: `prov_${Date.now()}`,
        userId: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: 'PUROHITH',
        city: 'Chennai',
        serviceLocations: ['Chennai'],
        verificationStatus: 'VERIFIED',
        rating: 5.0,
        isAvailable: true,
        completedEventsCount: 0,
        createdAt: new Date(),
      };
      this.dataStore.providers.push(newProvider);

      // Create welfare wallet
      this.dataStore.wallets.push({
        _id: `wal_${Date.now()}`,
        providerId: newProvider._id,
        currentBalance: 0,
        lifetimeAllocated: 0,
        lifetimeDisbursed: 0,
        status: 'ACTIVE',
        createdAt: new Date(),
      });
    }

    const token = this.generateToken(newUser);
    return {
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        roles: newUser.roles,
      },
      token,
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = this.dataStore.users.find((u) => u.email.toLowerCase() === dto.email.toLowerCase().trim());
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    user.lastLoginAt = new Date();
    const token = this.generateToken(user);

    let customerProfile = null;
    let providerProfile = null;

    if (user.roles.includes(UserRole.CUSTOMER)) {
      customerProfile = this.dataStore.customers.find((c) => c.userId === user._id);
    }
    if (user.roles.includes(UserRole.PROVIDER)) {
      providerProfile = this.dataStore.providers.find((p) => p.userId === user._id);
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        roles: user.roles,
        customerProfile,
        providerProfile,
      },
      token,
    };
  }

  async resetPassword(dto: { email?: string; userId?: string; newPassword: string }) {
    if (!dto.newPassword || dto.newPassword.trim().length < 6) {
      throw new BadRequestException('New password must be at least 6 characters long');
    }

    let user = null;
    if (dto.userId) {
      user = this.dataStore.users.find((u) => u._id === dto.userId);
    } else if (dto.email) {
      user = this.dataStore.users.find((u) => u.email.toLowerCase() === dto.email.toLowerCase().trim());
    }

    if (!user) {
      throw new NotFoundException('Account with specified email/ID not found');
    }

    const newHash = await bcrypt.hash(dto.newPassword.trim(), 10);
    user.passwordHash = newHash;
    this.logger.log(`Password reset successfully for user: ${user.email} (No old password required)`);

    const token = this.generateToken(user);
    return {
      success: true,
      message: 'Password has been reset successfully! You can now sign in with your new password.',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = this.dataStore.users.find((u) => u._id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const customerProfile = this.dataStore.customers.find((c) => c.userId === user._id);
    const providerProfile = this.dataStore.providers.find((p) => p.userId === user._id);

    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      roles: user.roles,
      customerProfile,
      providerProfile,
    };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}

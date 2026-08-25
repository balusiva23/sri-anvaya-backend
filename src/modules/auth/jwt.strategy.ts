import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dataStore: DataStoreService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'sri_anvaya_super_secret_jwt_key_2026_dev_prod',
    });
  }

  async validate(payload: any) {
    const user = this.dataStore.users.find((u) => u._id === payload.sub || u.email === payload.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account not found or disabled');
    }
    return {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
    };
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) {
<<<<<<< HEAD
      throw new ForbiddenException("Oops... You're not allowed to be here!");
=======
      throw new ForbiddenException('User does not have necessary permissions');
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
    }
    
    // SUPER_ADMIN has access to everything
    if (user.roles.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
<<<<<<< HEAD
      throw new ForbiddenException("Oops... You're not allowed to be here!");
=======
      throw new ForbiddenException('Access denied for user role');
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
    }
    return true;
  }
}

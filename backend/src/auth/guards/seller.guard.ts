import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SellerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('Unauthorized');

    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Seller only');
    }

    return true;
  }
}

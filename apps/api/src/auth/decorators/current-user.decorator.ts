import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserResponse } from '../auth.service.js';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserResponse => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

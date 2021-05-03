import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.authService.findOneByEmail(request.body.email);
        if (userExist) {
            throw new ForbiddenException('This email already exist');
        }
        return true;
    }
}

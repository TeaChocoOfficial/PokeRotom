//-Path: "motiva/server/src/user/auth/guard/user-auth.guard.ts"
import { Observable } from 'rxjs';
import { Auth } from 'src/user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<User = Auth>(err, user): User {
        if (err || !user) return null as User;
        return user as User;
    }
}

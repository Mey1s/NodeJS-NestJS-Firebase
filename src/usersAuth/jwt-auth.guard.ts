import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//AuthGuard('jwt') starts automatically the jwtStrategy
export class JwtAuthGuard extends AuthGuard('jwt') {}

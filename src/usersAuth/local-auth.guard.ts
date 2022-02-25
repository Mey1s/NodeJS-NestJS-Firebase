import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//AuthGuard('local') starts automatically the LocalStrategy
export class LocalAuthGuard extends AuthGuard('local') {}
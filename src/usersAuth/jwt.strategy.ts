import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwt } from 'src/consts';

@Injectable()
//The jwtAuthGuard file calls the PassportStrategy. The PassportStrategy calls the validate function automatically. The JwtStrategy descrypt automatically the token and send the payload to validate function.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      //Get the token from the headers, 'access_token' is the header's name
      jwtFromRequest: ExtractJwt.fromHeader('accessToken'),
      //Doesn't ignoe expiration. i.e, the token will be invalid after the expiration time
      ignoreExpiration: false,
      //The secret key for encryption and descryption tokens
      secretOrKey: jwt.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    //Validate function get the payload automatically and creates a new object.
    return { user_id: payload.sub, email: payload.email };
  }
}

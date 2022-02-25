import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/components/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local-authentication.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/components/users/users.service';
import { jwt } from 'src/consts';

@Module({
    //I used forwardRef because I imported UserModule to AuthModoule and AuthModule to UserModule. forwardRed prevents modules' looping.
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,

        //JWT - JASON WEB TOKEN configuration
        JwtModule.register({
            //secret key for jwt, for encryption and dscryption
            secret: jwt.JWT_SECRET,
            //the token will be expired after 1h
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        UsersService,
    ],
    exports: [AuthService],
})
export class AuthModule { }

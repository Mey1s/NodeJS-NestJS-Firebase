import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/components/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        //I used forwardRef because I imported UserService to AuthService and AuthService to UserService. forwardRed prevents services' looping. 
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);

        if (user) {
            //check if the passwords are equals
            //************ check password, bcrypt ************/

            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                //take all the fiels except the password
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, uid: user.uid };
        return {
            //create the token, based on the payload
            accessToken: this.jwtService.sign(payload),
        };
    }

}

import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { auth } from 'firebase-admin';

@Injectable()
export class UserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token: string = req.headers.auth as string;
        console.log(token);
        const decodeToken = auth().verifyIdToken(token);
        if (decodeToken) {
            console.log(decodeToken);
            return next();
        }
        throw new HttpException('Not Allowed, invalid token', HttpStatus.FORBIDDEN);
    }
}

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token: string = req.headers.auth as string;
        const decodeToken = auth().verifyIdToken(token);
        if (decodeToken) {
            decodeToken.then(dec => {
                req.uid = dec.uid;
            })
            return next();
        }
        throw new HttpException('Not Allowed, invalid token', HttpStatus.FORBIDDEN);
    }
}
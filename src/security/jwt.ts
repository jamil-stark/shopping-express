import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { v4 as uuidv4 } from 'uuid';

export class JWT{
    private static JWT_SECRET = "705559333";
    public static async generateToken(user: User){
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: '1h',
            jwtid: uuidv4(),
            subject: user.username
        });
        return token;
        }
    }
import * as bcrypt from 'bcrypt'

export class PasswordHash{
    public static async hashPassword(plainPassword: string){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    }
}
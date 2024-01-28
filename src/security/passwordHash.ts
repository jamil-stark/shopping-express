import * as bcrypt from 'bcrypt'

export class PasswordHash{
    public static async comparePassword(password: string, hashedPassword: string){
        return await bcrypt.compare(password, hashedPassword);
    }
    public static async hashPassword(plainPassword: string){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    }
}
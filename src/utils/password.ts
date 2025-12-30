import bcrypt from 'bcrypt';
import env from '../../env.ts';

export const hashedPassword = async(password: string): Promise<string> => {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS)
}
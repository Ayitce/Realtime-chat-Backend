import passport from "passport";
import '../configs/passport';
import jwt from 'jsonwebtoken'
import { TUser, TUserLogin, TUserSave, } from "../interfaces/user.interface";
import bcrypt from 'bcrypt'
import User, { createUser, getUserByIds, getUserByUsername } from "../models/user.model";
import * as dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;
const jwtAccessKey = JWT_SECRET as string
const jwtAccessExpiry = 86400



export const registerService = async (data: TUserSave) => {
    const saltRounds = 10;
    const passwordToHash = data.password;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(passwordToHash, salt);

    const newUser = new User({
        ...data,
        password: hashedPassword,
    })

    await createUser(newUser, handleError)
}

export const loginService = async (data: TUserLogin) => {
    try {
        const user = await new Promise<TUser>((resolve, reject) => {
            passport.authenticate('login', async (err: unknown, user: TUser) => {
                if (err || !user) {
                    reject(new Error('Invalid username or password.'));
                } else {
                    resolve(user);
                }
            })(data);
        });

        await new Promise<void>((resolve, reject) => {
            data.login(user, { session: false }, async (error: unknown) => {
                if (error) {
                    reject(new Error((error as Error)?.message));
                } else {
                    resolve();
                }
            });
        });

        const body = { username: user.username };
        const token = jwt.sign({ user: body }, jwtAccessKey, {
            algorithm: "HS256",
            expiresIn: jwtAccessExpiry,
        });

        const response = { token, user: user.username };
        return response;

    } catch (err) {
        throw new Error((err as Error)?.message);
    }
}

const handleError = (err: unknown) => {
    if (err) {
        throw new Error((err as Error)?.message);
    }
}

export const getUserByIdsService = async (userIds: string) => {
    try {
        console.log(userIds)
        const users = await getUserByIds(userIds, handleError)
        return users
    } catch (err) {
        throw new Error((err as Error)?.message);
    }
}

export const getUserByUserNameService = async (username: string) => {
    try {
        const user = await getUserByUsername(username, handleError)
        return user
    } catch (err) {
        throw new Error((err as Error)?.message);
    }
}
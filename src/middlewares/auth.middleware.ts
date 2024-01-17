import { Request, Response } from "express";
import passport from "passport";
import '../configs/passport';
import { TUser } from "../interfaces/user.interface";

export const getUser = () => {
    console.log('get user middleware');
    return async (req: Request, res: Response, next: () => void) => {
        if (!req.headers.authorization) {
            const error = new Error('No token provided');
            res.status(401).json({ message: error.message });
        }
        await new Promise<void>((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, (err: unknown, user: TUser) => {
                if (err || !user) {
                    const error = new Error('Invalid user');
                    reject(error);
                } else {
                    req.body.chatInitiator = user._id;
                    resolve();
                }
            })(req, res, next);
        });
    };
};

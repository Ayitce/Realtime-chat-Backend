import { NextFunction, Request, Response } from "express";
import passport from "passport";
import '../configs/passport';
import { TUser } from "../interfaces/user.interface";

// export const getUser = () => {
//     console.log('get user middleware');
//     return async (req: Request, res: Response, next: () => void) => {
//         if (!req.headers.authorization) {
//             const error = new Error('No token provided');
//             res.status(401).json({ message: error.message });
//         }
//         await new Promise<void>((resolve, reject) => {
//             console.log('ssss');

//             passport.authenticate('jwt', { session: false }, (err: unknown, user: TUser) => {
//                 if (err || !user) {
//                     const error = new Error('Invalid user');
//                     reject(error);
//                 } else {
//                     req.body.chatInitiator = user._id;
//                     resolve();

//                 }
//             })(req, res, next);
//         });
//     };
// };


export const getUser = (req: Request, res: Response, next: NextFunction) => {
    console.log('get user middleware');

    if (!req.headers.authorization) {
        const error = new Error('No token provided');
        return res.status(401).json({ message: error.message });
    }

    passport.authenticate('jwt', { session: false }, (err: unknown, user: TUser) => {
        if (err || !user) {
            const error = new Error('Invalid user');
            return res.status(401).json({ message: error.message });
        }

        req.body.loggedUser = { _id: user._id.toString(), username: user.username };
        console.log(req.body.loggedUser)
        next(); // Don't forget to call next() here
    })(req, res, next);
};
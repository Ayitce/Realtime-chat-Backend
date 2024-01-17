/* eslint-disable @typescript-eslint/ban-types */
import mongoose from "mongoose"
import { TUser, TUserQuery, TUserSave } from "../interfaces/user.interface"

const User = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<TUser>('User', User)
export const createUser = async (data: TUserSave, callback: Function) => {
    try {
        const result = await data.save();
        callback(null, result);
    } catch (error) {
        callback(error);
    }
}

export const getUserByUsername = async (username: String, callback: Function) => {
    try {
        const user: TUserQuery = await mongoose.model('User').findOne({ username: username });
        return user;
    } catch (error) {
        callback(error);
    }
}

export const getUserByIds = async (ids: String, callback: Function) => {
    try {
        const user: TUserQuery[] = await mongoose.model('User').find({ _id: { $in: ids } });
        return user;
    } catch (error) {
        callback(error);
    }
}
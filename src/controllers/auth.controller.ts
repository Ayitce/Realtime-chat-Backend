import { addUserService, loginService } from "../services/auth.service";
import { Request, Response } from "express";

export const addUser = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        await addUserService(req.body);
        res.status(201).json({ message: "User created successfully" });
    } catch (error: unknown) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const token = await loginService(req);
        res.status(200).json({ token });
    } catch (error: unknown) {
        res.status(500).json({ message: (error as Error).message });
    }
}

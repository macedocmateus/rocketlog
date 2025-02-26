import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { hash } from "bcrypt";

class UsersController {
    async create(request: Request, response: Response, next: NextFunction) {
        const bodySchema = z.object({
            name: z.string().trim().min(2),
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { name, email, password } = bodySchema.parse(request.body);

        const hashedPassword = await hash(password, 8);

        return response.status(201).json({
            message: "ok",
            hashedPassword,
        });
    }
}

export { UsersController };

import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import { authConfig } from "@/configs/auth";
class SessionsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { email, password } = bodySchema.parse(request.body);

        const user = await prisma.user.findFirst({
            where: { email },
        });

        // Verificando se o usuário foi encontrado de acordo com email
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        // Compare do bycrypt compara a senha do usuário digitada com a senha dele registrada no banco de dados
        const passwordMatched = await compare(password, user.password);

        // Verificando se a senha do usuário corresponde com a senha do banco de dados
        if (!passwordMatched) {
            throw new AppError("Invalid email or password", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({ role: user.role ?? "customer" }, secret, {
            subject: user.id,
            expiresIn,
        });

        const { password: hashedPassword, ...userWithoutPassword } = user;

        return response.json({ token, user: userWithoutPassword });
    }
}

export { SessionsController };

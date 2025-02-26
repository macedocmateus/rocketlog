import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UsersController {
    async create(request: Request, response: Response, next: NextFunction) {
        const bodySchema = z.object({
            name: z.string().trim().min(2),
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { name, email, password } = bodySchema.parse(request.body);

        // Verificando se o email já existe e retorna uma exceção se caso exista um email igual
        const userWithSameEmail = await prisma.user.findFirst({
            where: { email },
        });

        if (userWithSameEmail) {
            throw new AppError("User with same email already exists");
        }

        const hashedPassword = await hash(password, 8);

        // Criando um novo usuário usando a ideia de orm do prisma e salvando no banco de dados
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return response.status(201).json(user);
    }
}

export { UsersController };

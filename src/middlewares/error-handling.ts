import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

export function errorHandling(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
) {
    // Erro lançado pelo dev, com o código do status e a mensagem personalizada, Para tratamento de exceções
    if (error instanceof AppError) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }

    // Tratamento de erros de validação
    if (error instanceof ZodError) {
        return response.status(400).json({
            message: "validation error",
            issues: error.format(),
        });
    }

    // Erro genérico
    return response.status(500).json({ message: error.message });

    return;
}

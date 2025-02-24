import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

export function errorHandling(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
) {
    // Erro lançado pelo dev, com o código do status e a mensagem personalizada
    if (error instanceof AppError) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }

    // Erro genérico
    return response.status(500).json({ message: error.message });

    return;
}

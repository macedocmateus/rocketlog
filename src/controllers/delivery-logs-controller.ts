import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class DeliveryLogsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string(),
        });

        const { delivery_id, description } = bodySchema.parse(request.body);

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id },
        });

        // Verificando se o pedido existe
        if (!delivery) {
            throw new AppError("delivery not found", 404);
        }

        // Impede de adicionar novos logs se caso o pedido já foi entregue
        if (delivery.status === "delivered") {
            throw new AppError("this order has already been delivered", 404);
        }

        if (delivery.status === "processing") {
            throw new AppError("change status to shipped", 404);
        }

        await prisma.deliveryLog.create({
            data: {
                deliveryId: delivery_id,
                description,
            },
        });

        return response.status(201).json();
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            delivery_id: z.string().uuid(),
        });

        const { delivery_id } = paramsSchema.parse(request.params);

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id },
            // uso de true no include ele irá pegar tudo de logs e user, diferente de logs: select: {description: true, id: true} que pega apenas a descrição e o id dos logs
            include: {
                logs: true,
                user: true,
            },
        });

        // Impedindo do usuário ver os logs dos pedidos de outros usuários
        if (
            request.user?.role === "customer" &&
            request.user.id !== delivery?.userId
        ) {
            throw new AppError(
                "The user can only view their own deliveries",
                401,
            );
        }

        return response.json(delivery);
    }
}

export { DeliveryLogsController };

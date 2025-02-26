import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    // A fila de log só serão exibidas se caso ambiente for de desenvolvimento
    log: process.env.NODE_ENV === "production" ? [] : ["query"],
});

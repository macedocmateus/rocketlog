import { z } from "zod";

// Validando as variáveis de ambiente
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
});

// Passando todas as varáveis de ambiente e tratando delas aqui
export const env = envSchema.parse(process.env);

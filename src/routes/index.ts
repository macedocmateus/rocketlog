// Index ts para centralizar todas as rotas do projeto

import { Router } from "express";

import { usersRoutes } from "./users-routes";

const routes = Router();
routes.use("/users", usersRoutes);

export { routes };

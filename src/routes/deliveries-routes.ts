import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();
const deliveriesStatusController = new DeliveriesStatusController();

// Verificando se o usuário está autenticado e se ele tem permissão
deliveriesRoutes.use(
    ensureAuthenticated,
    verifyUserAuthorization(["customer", "sale", "admin"]),
);

deliveriesRoutes.post("/", deliveriesController.create);
deliveriesRoutes.get("/", deliveriesController.index);

deliveriesRoutes.patch("/:id/status", deliveriesStatusController.update);

export { deliveriesRoutes };

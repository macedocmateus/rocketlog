import { Request, Response } from "express";

class DeliveryLogsController {
    create(request: Request, response: Response) {
        return response.status(201).json();
    }
}

export { DeliveryLogsController };

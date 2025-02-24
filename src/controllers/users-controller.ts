import { Request, Response, NextFunction } from "express";

class UsersController {
    create(request: Request, response: Response, next: NextFunction) {
        return response.status(201).json({ message: "ok" });
    }
}

export { UsersController };

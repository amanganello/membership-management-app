import type { Request, Response, NextFunction } from 'express';
import { checkinService } from '../services/checkinService.js';
import type { CreateCheckinDto } from '../types/index.js';

export const checkinController = {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body as CreateCheckinDto;
            const checkin = await checkinService.recordCheckin(data);
            res.status(201).json(checkin);
        } catch (error) {
            next(error);
        }
    }
};

import type { Request, Response, NextFunction } from 'express';
import { planRepository } from '../repositories/planRepository.js';

export const planController = {
    async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await planRepository.findAll();
            res.json(plans);
        } catch (error) {
            next(error);
        }
    }
};

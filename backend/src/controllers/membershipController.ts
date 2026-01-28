import type { Request, Response, NextFunction } from 'express';
import { membershipService } from '../services/membershipService.js';
import type { AssignMembershipDto, CancelMembershipDto } from '../types/index.js';

export const membershipController = {
    async assign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body as AssignMembershipDto;
            const membership = await membershipService.assign(data);
            res.status(201).json(membership);
        } catch (error) {
            next(error);
        }
    },

    async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { cancelDate } = req.body as CancelMembershipDto;
            const membership = await membershipService.cancel(id!, cancelDate);
            res.json(membership);
        } catch (error) {
            next(error);
        }
    }
};

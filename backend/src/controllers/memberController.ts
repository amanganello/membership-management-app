import type { Request, Response, NextFunction } from 'express';
import { memberService } from '../services/memberService.js';
import type { CreateMemberDto } from '../types/index.js';

export const memberController = {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body as CreateMemberDto;
            const member = await memberService.create(data);
            res.status(201).json(member);
        } catch (error) {
            next(error);
        }
    },

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const searchQuery = req.query.q as string | undefined;
            const members = await memberService.list(searchQuery);
            res.json(members);
        } catch (error) {
            next(error);
        }
    },

    async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const summary = await memberService.getSummary(id!);
            res.json(summary);
        } catch (error) {
            next(error);
        }
    }
};

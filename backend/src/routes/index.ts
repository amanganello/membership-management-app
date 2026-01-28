import { Router } from 'express';
import { memberController } from '../controllers/memberController.js';
import { planController } from '../controllers/planController.js';
import { membershipController } from '../controllers/membershipController.js';
import { checkinController } from '../controllers/checkinController.js';
import { validate, validateParams } from '../middleware/validateRequest.js';
import {
    createMemberSchema,
    assignMembershipSchema,
    cancelMembershipSchema,
    createCheckinSchema,
    uuidParamSchema
} from '../middleware/validators.js';

const router = Router();

// Members
router.post('/members', validate(createMemberSchema), memberController.create);
router.get('/members', memberController.list);
router.get('/members/:id', validateParams(uuidParamSchema), memberController.getSummary);

// Plans
router.get('/plans', planController.list);

// Memberships
router.post('/memberships', validate(assignMembershipSchema), membershipController.assign);
router.patch('/memberships/:id/cancel',
    validateParams(uuidParamSchema),
    validate(cancelMembershipSchema),
    membershipController.cancel
);

// Check-ins
router.post('/checkins', validate(createCheckinSchema), checkinController.create);

export default router;

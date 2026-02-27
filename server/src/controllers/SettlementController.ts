import type { Request, Response } from 'express';
import { SettlementService } from '../services/SettlementService.js';

export class SettlementController {
    constructor(private settlementService: SettlementService) { }

    public getBalances = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const groupId = req.query.groupId ? parseInt(req.query.groupId as string) : null;
            const summary = await this.settlementService.getBalanceSummary(userId, groupId);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching balance summary', error: (error as Error).message });
        }
    };

    public initiate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { payeeId, amount } = req.body;
            const payerId = (req as any).user.id;
            const key = await this.settlementService.initiateSettlement(payerId, payeeId, amount);
            res.status(201).json({ message: 'Settlement initiated. Share this key with payee.', key });
        } catch (error) {
            res.status(500).json({ message: 'Error initiating settlement', error: (error as Error).message });
        }
    };

    public confirm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { settlementId, key } = req.body;
            await this.settlementService.confirmSettlement(settlementId, key);
            res.json({ message: 'Settlement confirmed and cleared.' });
        } catch (error) {
            res.status(500).json({ message: 'Error confirming settlement', error: (error as Error).message });
        }
    };
}

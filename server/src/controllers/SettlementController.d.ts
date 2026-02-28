import type { Request, Response } from 'express';
import { SettlementService } from '../services/SettlementService.js';
export declare class SettlementController {
    private settlementService;
    constructor(settlementService: SettlementService);
    getBalances: (req: Request, res: Response) => Promise<void>;
    initiate: (req: Request, res: Response) => Promise<void>;
    confirm: (req: Request, res: Response) => Promise<void>;
    getSimplifiedDebts: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=SettlementController.d.ts.map
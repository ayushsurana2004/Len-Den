import { SettlementService } from '../services/SettlementService.js';
export class SettlementController {
    settlementService;
    constructor(settlementService) {
        this.settlementService = settlementService;
    }
    getBalances = async (req, res) => {
        try {
            const userId = req.user.id;
            const groupId = req.query.groupId ? parseInt(req.query.groupId) : null;
            const summary = await this.settlementService.getBalanceSummary(userId, groupId);
            res.json(summary);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching balance summary', error: error.message });
        }
    };
    initiate = async (req, res) => {
        try {
            const { payeeId, amount } = req.body;
            const payerId = req.user.id;
            const { id, key } = await this.settlementService.initiateSettlement(payerId, payeeId, amount);
            res.status(201).json({ message: 'Settlement initiated.', id, key });
        }
        catch (error) {
            res.status(500).json({ message: 'Error initiating settlement', error: error.message });
        }
    };
    confirm = async (req, res) => {
        try {
            const { settlementId, key } = req.body;
            const result = await this.settlementService.confirmSettlement(settlementId, key);
            res.json({
                message: 'Settlement confirmed and cleared.',
                newKey: result.newKey
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Error confirming settlement', error: error.message });
        }
    };
    getSimplifiedDebts = async (req, res) => {
        try {
            const groupId = parseInt(req.query.groupId);
            if (!groupId) {
                res.status(400).json({ message: 'groupId is required' });
                return;
            }
            const debts = await this.settlementService.getSimplifiedDebts(groupId);
            res.json(debts);
        }
        catch (error) {
            res.status(500).json({ message: 'Error simplifying debts', error: error.message });
        }
    };
}
//# sourceMappingURL=SettlementController.js.map
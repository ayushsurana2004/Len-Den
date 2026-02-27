import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { ExpenseController } from '../controllers/ExpenseController.js';
import { SettlementController } from '../controllers/SettlementController.js';
import { GroupController } from '../controllers/GroupController.js';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { PostgresUserRepository } from '../repositories/UserRepository.js';
import { PostgresExpenseRepository } from '../repositories/ExpenseRepository.js';
import { PostgresGroupRepository } from '../repositories/GroupRepository.js';
import { AuthService } from '../services/AuthService.js';
import { SettlementService } from '../services/SettlementService.js';

const router = Router();

// Dependency Injection
const userRepository = new PostgresUserRepository();
const expenseRepository = new PostgresExpenseRepository();
const groupRepository = new PostgresGroupRepository();
const authService = new AuthService(userRepository);
const settlementService = new SettlementService();

const userController = new UserController(userRepository, authService, groupRepository);
const expenseController = new ExpenseController(expenseRepository, groupRepository);
const settlementController = new SettlementController(settlementService);
const groupController = new GroupController(groupRepository, userRepository);
const authMiddleware = new AuthMiddleware(authService);

// Auth Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users/search', authMiddleware.handle, userController.searchUser);

// Protected Routes
router.get('/expenses', authMiddleware.handle, expenseController.getExpenses);
router.post('/expenses', authMiddleware.handle, expenseController.addExpense);
router.get('/balances', authMiddleware.handle, settlementController.getBalances);
router.post('/settlements/initiate', authMiddleware.handle, settlementController.initiate);
router.post('/settlements/confirm', authMiddleware.handle, settlementController.confirm);

// Group Routes
router.post('/groups', authMiddleware.handle, groupController.createGroup);
router.get('/groups', authMiddleware.handle, groupController.getUserGroups);
router.get('/groups/:groupId/members', authMiddleware.handle, groupController.getGroupMembers);
router.post('/groups/add-member', authMiddleware.handle, groupController.addMember);

export default router;

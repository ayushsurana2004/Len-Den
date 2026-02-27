import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, ShieldCheck, Tag, Info } from 'lucide-react';
import ApiService from '../services/ApiService';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

interface ExpenseFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSuccess }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [splitType, setSplitType] = useState('EQUAL');
    const [groupId, setGroupId] = useState<string>('');
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await ApiService.get('/groups');
                setGroups(res.data);
            } catch (err) {
                console.error('Failed to fetch groups');
            }
        };
        fetchGroups();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await ApiService.post('/expenses', {
                description,
                amount: parseFloat(amount),
                splitType,
                groupId: groupId ? parseInt(groupId) : null,
                userIds: [],
                options: {}
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add expense');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl z-10"
            >
                <Card className="!p-0 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-slate-900/60 backdrop-blur-3xl overflow-hidden !rounded-[2.5rem] inner-glow relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                <Tag size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter">Add Expense</h2>
                                <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-[2px]">Fair distribution of resources</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-white/5"
                        >
                            <X size={20} />
                        </motion.button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-3"
                                >
                                    <Info size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <Input
                                    label="Expense Description"
                                    placeholder="e.g. Midnight Pizza Raid 🍕"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <Input
                                label="Total Amount (₹)"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                leftIcon={<DollarSign size={18} className="text-emerald-500" />}
                            />

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] ml-1 opacity-60">Target Group</label>
                                <div className="relative group">
                                    <select
                                        className="w-full bg-slate-950/40 border border-white/5 rounded-[1.25rem] px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all font-bold text-sm appearance-none cursor-pointer outline-none"
                                        value={groupId}
                                        onChange={(e) => setGroupId(e.target.value)}
                                    >
                                        <option value="" className="bg-slate-900">Personal Mission</option>
                                        {groups.map(g => (
                                            <option key={g.id} value={g.id} className="bg-slate-900">{g.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 transition-transform group-hover:translate-y-[-40%]">
                                        <div className="w-2 h-2 border-r-2 border-b-2 border-current rotate-45" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 col-span-1 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] ml-1 opacity-60">Splitting Strategy</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['EQUAL', 'EXACT', 'PERCENT'].map((t) => (
                                        <motion.button
                                            key={t}
                                            type="button"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSplitType(t)}
                                            className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[2px] transition-all duration-500 ${splitType === t ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)]' : 'bg-slate-950/40 border-white/5 text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                type="submit"
                                className="w-full h-16 !rounded-[1.5rem] shadow-2xl shadow-emerald-500/30 text-lg"
                                isLoading={isLoading}
                                leftIcon={<ShieldCheck size={22} />}
                            >
                                Secure Transaction
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default ExpenseForm;

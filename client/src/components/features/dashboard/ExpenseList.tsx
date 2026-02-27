import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../ui/Card';
import { DollarSign, ChevronRight, Calendar, Tag } from 'lucide-react';
import ApiService from '../../../services/ApiService';

interface ExpenseListProps {
    groupId: number | null;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ groupId }) => {
    const [expenses, setExpenses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            try {
                const url = groupId ? `/expenses?groupId=${groupId}` : '/expenses';
                const res = await ApiService.get(url);
                setExpenses(res.data);
            } catch (err) {
                console.error('Failed to fetch expenses');
            } finally {
                setIsLoading(false);
            }
        };
        fetchExpenses();
    }, [groupId]);

    if (isLoading) {
        return (
            <Card className="p-20 flex flex-col items-center justify-center border-white/5 bg-slate-900/20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full mb-6"
                />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[3px] animate-pulse">Syncing transactions...</p>
            </Card>
        );
    }

    return (
        <Card className="!p-0 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-slate-900/20 backdrop-blur-3xl overflow-visible">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/[0.02] to-transparent rounded-t-[2rem]">
                <div>
                    <h3 className="font-black text-slate-100 uppercase tracking-[3px] text-[10px] mb-1">Transaction Stream</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-60">History of shared economic energy</p>
                </div>
                <button className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-all uppercase tracking-[1px] px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">Filter History</button>
            </div>

            <div className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                    {expenses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-20 text-center"
                        >
                            <p className="text-[11px] text-slate-600 font-black uppercase tracking-[2px]">Void Detected: No Transactions Found</p>
                        </motion.div>
                    ) : (
                        expenses.map((expense, i) => (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-emerald-500 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />

                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-14 h-14 bg-slate-950/50 rounded-[1.25rem] flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500 border border-white/5 shadow-inner">
                                        <DollarSign size={20} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="font-black text-slate-100 group-hover:text-emerald-400 transition-colors tracking-tight text-lg">{expense.description}</h4>
                                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 bg-white/5 py-1 px-2 rounded-lg border border-white/5">
                                                <Tag size={12} className="text-emerald-500/50" />
                                                {expense.split_type}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-white/5 py-1 px-2 rounded-lg border border-white/5">
                                                <Calendar size={12} className="text-cyan-500/50" />
                                                {new Date(expense.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 relative z-10">
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[2px] mb-1">Total: ₹{expense.amount}</p>
                                        <p className={`font-black italic tracking-tighter text-2xl ${expense.user_role === 'PAID' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            ₹{expense.user_share}
                                        </p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${expense.user_role === 'PAID' ? 'text-emerald-500/40' : 'text-rose-500/40'}`}>
                                            {expense.user_role === 'PAID' ? 'You Reclaimed' : 'Your Debt'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-700 bg-white/5 border border-white/5 group-hover:text-emerald-400 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 transition-all duration-500">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
};

export default ExpenseList;

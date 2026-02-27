import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Key, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import ApiService from '../../../services/ApiService';

interface DashboardSummaryProps {
    title?: string;
    onAddExpense: () => void;
    onSettleUp: () => void;
    groupId: number | null;
    refreshTrigger?: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ title = "Dashboard", onAddExpense, onSettleUp, groupId, refreshTrigger }) => {
    const [summary, setSummary] = React.useState({ totalBalance: 0, youOwe: 0, youAreOwed: 0 });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBalances = async () => {
            setIsLoading(true);
            try {
                const url = groupId ? `/balances?groupId=${groupId}` : '/balances';
                const res = await ApiService.get(url);
                setSummary(res.data);
            } catch (err) {
                console.error('Failed to fetch balances');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBalances();
    }, [groupId, refreshTrigger]);

    const cards = [
        {
            title: 'Total Balance',
            amount: summary.totalBalance,
            icon: <Wallet className="text-emerald-500" size={24} />,
            color: summary.totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400',
            label: summary.totalBalance >= 0 ? 'You are owed' : 'You owe',
            bg: 'bg-emerald-500/5'
        },
        {
            title: 'You Owe',
            amount: summary.youOwe,
            icon: <ArrowDownLeft className="text-rose-500" size={24} />,
            color: 'text-rose-400',
            label: 'Pending payments',
            bg: 'bg-rose-500/5'
        },
        {
            title: 'You are Owed',
            amount: summary.youAreOwed,
            icon: <ArrowUpRight className="text-cyan-500" size={24} />,
            color: 'text-cyan-400',
            label: 'Collect from squad',
            bg: 'bg-cyan-500/5'
        }
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl font-black gradient-text tracking-tighter mb-4"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 font-bold uppercase tracking-[3px] text-[10px] opacity-60"
                    >
                        Financial Intelligence • Squad Dynamics
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-4"
                >
                    <Button
                        variant="secondary"
                        onClick={onSettleUp}
                        leftIcon={<Key size={18} />}
                        className="!bg-slate-900/50 backdrop-blur-xl border-white/5 h-14"
                    >
                        Settle Up
                    </Button>
                    <Button
                        onClick={onAddExpense}
                        leftIcon={<PlusCircle size={18} />}
                        className="h-14 shadow-2xl shadow-emerald-500/40"
                    >
                        Add Expense
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {isLoading ? (
                    [0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            <Card className="relative !p-8 h-full">
                                <div className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 animate-pulse" />
                                    <div className="w-24 h-3 rounded-full bg-slate-800 animate-pulse" />
                                    <div className="w-40 h-10 rounded-xl bg-slate-800/60 animate-pulse" />
                                    <div className="w-32 h-2 rounded-full bg-slate-800/40 animate-pulse mt-4" />
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                        >
                            <Card className="relative group !p-8 h-full">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />

                                <div className="flex flex-col h-full relative z-10">
                                    <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 border border-white/5">
                                        {card.icon}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-2">{card.title}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className={`text-4xl font-black tracking-tighter ${card.color}`}>
                                            ₹ {Math.abs(card.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </h3>
                                    </div>
                                    <p className="mt-auto text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-6 italic">{card.label}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardSummary;

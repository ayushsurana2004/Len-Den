import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Filter, Calendar } from 'lucide-react';
import ExpenseList from '../../components/features/dashboard/ExpenseList';

const Activity: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl shadow-cyan-500/20">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Activity Stream</h1>
                        <p className="text-cyan-500/70 font-black uppercase tracking-[3px] text-[10px]">Real-time Ledger Synchronization</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <Calendar size={16} /> History
                    </button>
                </div>
            </div>

            <div className="premium-card p-1">
                <div className="bg-slate-950/40 rounded-[1.8rem] p-8">
                    <ExpenseList groupId={null} />
                </div>
            </div>
        </motion.div>
    );
};

export default Activity;

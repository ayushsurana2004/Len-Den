import React from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Friends: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl shadow-rose-500/20">
                        <User size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Your Network</h1>
                        <p className="text-rose-500/70 font-black uppercase tracking-[3px] text-[10px]">Connected Personnel</p>
                    </div>
                </div>

                <Button leftIcon={<UserPlus size={18} />} variant="primary">
                    Invite Friend
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 p-6 hover:border-rose-500/30 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-black text-slate-500 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all">
                        JS
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold">John Smith</h4>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Ally</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Status</p>
                        <span className="text-emerald-400 text-xs font-black tracking-tighter">Settle Up</span>
                    </div>
                </Card>

                {/* Search Placeholder */}
                <Card className="flex md:col-span-2 items-center justify-center border-dashed border-white/5 bg-white/[0.02]">
                    <div className="text-center p-12">
                        <Search size={48} className="mx-auto text-slate-800 mb-4 opacity-20" />
                        <h3 className="text-slate-600 font-black uppercase tracking-[4px] text-sm">Expand Grid</h3>
                        <p className="text-slate-700 text-xs mt-2">Search for more allies to sync wallets</p>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default Friends;

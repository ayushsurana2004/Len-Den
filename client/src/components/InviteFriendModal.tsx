import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, UserPlus, Search, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import ApiService from '../services/ApiService';

interface InviteFriendModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({ onClose, onSuccess }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await ApiService.post('/friends/invite', { query });
            setSuccess('Friend added to your network!');
            setTimeout(() => {
                onSuccess();
            }, 1200);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setError('User not on Daily Udhari yet.');
            } else {
                setError(err.response?.data?.message || 'Failed to find user');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="!p-0 !rounded-[2rem] shadow-2xl shadow-rose-500/10 border-rose-500/10">
                    <div className="p-8 pb-0 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl shadow-rose-500/30">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter">Invite Friend</h3>
                                <p className="text-[9px] text-rose-500/70 font-black uppercase tracking-[2px]">Expand Your Network</p>
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

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-3"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-3"
                            >
                                <CheckCircle size={16} />
                                {success}
                            </motion.div>
                        )}

                        <Input
                            label="Email or Phone Number"
                            placeholder="friend@example.com or 10-digit mobile"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            leftIcon={<Search size={18} />}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full h-14 !rounded-2xl shadow-xl shadow-rose-500/20"
                            isLoading={isLoading}
                            leftIcon={<UserPlus size={18} />}
                        >
                            {isLoading ? 'Searching...' : 'Send Invite'}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>,
        document.body
    );
};

export default InviteFriendModal;

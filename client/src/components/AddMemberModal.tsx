import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, ShieldCheck, Info, UserX } from 'lucide-react';
import ApiService from '../services/ApiService';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

interface AddMemberModalProps {
    groupId: number;
    groupName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ groupId, groupName, onClose, onSuccess }) => {
    const [query, setQuery] = useState('');
    const [foundUser, setFoundUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFoundUser(null);
        setIsNotFound(false);
        setIsLoading(true);

        try {
            const res = await ApiService.get(`/users/search?query=${query}`);
            setFoundUser(res.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setIsNotFound(true);
            } else {
                setError('Failed to search user');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async () => {
        setIsInviting(true);
        setError('');

        try {
            await ApiService.post('/groups/add-member', {
                groupId,
                userId: foundUser?.id,
                mobileNumber: isNotFound ? query : undefined
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError('Failed to add member. They might already be in the group.');
        } finally {
            setIsInviting(false);
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
                className="relative w-full max-w-md z-10"
            >
                <Card className="!p-0 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-slate-900/60 backdrop-blur-3xl overflow-hidden !rounded-[2.5rem] inner-glow relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                <UserPlus size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter">Add Ally</h2>
                                <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-[2px]">Strength in {groupName}</p>
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

                    <div className="p-8 space-y-8">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative group">
                                <Input
                                    label="Search Identifier"
                                    placeholder="Enter mobile or email..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    required
                                    leftIcon={<Search size={18} className="text-slate-500" />}
                                />
                                <div className="absolute right-2 bottom-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-10 px-4 !rounded-xl !text-[10px] font-black uppercase tracking-widest"
                                        isLoading={isLoading}
                                    >
                                        Scan
                                    </Button>
                                </div>
                            </div>
                        </form>

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

                            {isNotFound && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl space-y-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                                            <UserX size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-slate-200 font-bold text-lg leading-tight">Ghost Identified</h4>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">User not found on grid</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">"{query}" isn't registered. We can still add them to the group tracker.</p>
                                    <Button
                                        onClick={handleInvite}
                                        variant="secondary"
                                        className="w-full h-14 !rounded-2xl border-white/10"
                                        isLoading={isInviting}
                                        leftIcon={<UserPlus size={18} />}
                                    >
                                        Invite to Squad
                                    </Button>
                                </motion.div>
                            )}

                            {foundUser && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                            <ShieldCheck size={28} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-xl tracking-tight leading-none mb-1">{foundUser.name}</h4>
                                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{foundUser.mobileNumber}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleInvite}
                                        className="w-full h-14 !rounded-2xl shadow-xl shadow-emerald-500/20"
                                        isLoading={isInviting}
                                        leftIcon={<UserPlus size={18} />}
                                    >
                                        Deploy to {groupName}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default AddMemberModal;

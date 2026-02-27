import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Info, Users, CheckCircle } from 'lucide-react';
import ApiService from '../services/ApiService';
import Button from './ui/Button';
import Card from './ui/Card';

interface AddMemberModalProps {
    groupId: number;
    groupName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ groupId, groupName, onClose, onSuccess }) => {
    const [availableFriends, setAvailableFriends] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                const [friendsRes, membersRes] = await Promise.all([
                    ApiService.get('/friends'),
                    ApiService.get(`/groups/${groupId}/members`)
                ]);

                const memberIds = new Set(membersRes.data.map((m: any) => m.id));
                const notInGroup = friendsRes.data.filter((f: any) => !memberIds.has(f.id));
                setAvailableFriends(notInGroup);
            } catch (err) {
                console.error('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvailable();
    }, [groupId]);

    const handleAdd = async (userId: number) => {
        setAddingId(userId);
        setError('');
        try {
            await ApiService.post('/groups/add-member', { groupId, userId });
            setAddedIds(prev => new Set(prev).add(userId));
            setTimeout(() => onSuccess(), 600);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add member');
        } finally {
            setAddingId(null);
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
                className="relative w-full max-w-sm z-10"
            >
                <Card className="!p-0 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-slate-900/60 backdrop-blur-3xl overflow-hidden !rounded-[2.5rem] inner-glow relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                <UserPlus size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white tracking-tighter">Add Member</h2>
                                <p className="text-[9px] text-emerald-500/70 font-black uppercase tracking-[2px]">{groupName}</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-white/5">
                            <X size={16} />
                        </motion.button>
                    </div>

                    <div className="p-4 space-y-3">
                        <AnimatePresence>
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

                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] ml-1">Friends not in this group</p>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {isLoading ? (
                                <div className="py-6 text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-3"
                                    />
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Loading...</p>
                                </div>
                            ) : availableFriends.length === 0 ? (
                                <div className="py-6 text-center">
                                    <Users size={24} className="mx-auto text-slate-700 mb-2 opacity-40" />
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">All friends already in group</p>
                                </div>
                            ) : (
                                availableFriends.map(friend => {
                                    const isAdded = addedIds.has(friend.id);
                                    const isAdding = addingId === friend.id;

                                    return (
                                        <motion.div
                                            key={friend.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${isAdded
                                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                                : 'bg-slate-950/30 border-white/5 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${isAdded ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                                                }`}>
                                                {friend.name?.substring(0, 2).toUpperCase()}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm truncate ${isAdded ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                    {friend.name}
                                                </p>
                                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest truncate">
                                                    {friend.mobileNumber || friend.email}
                                                </p>
                                            </div>

                                            {isAdded ? (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"
                                                >
                                                    <CheckCircle size={14} className="text-slate-950" />
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleAdd(friend.id)}
                                                    disabled={isAdding}
                                                    className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-slate-950 transition-all shrink-0 disabled:opacity-50"
                                                >
                                                    {isAdding ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                                                            className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"
                                                        />
                                                    ) : (
                                                        <UserPlus size={16} />
                                                    )}
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default AddMemberModal;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, ShieldCheck, Wallet, ArrowRight, Info, Copy } from 'lucide-react';
import ApiService from '../services/ApiService';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

interface SettlementModalProps {
    onClose: () => void;
}

const SettlementModal: React.FC<SettlementModalProps> = ({ onClose }) => {
    const [step, setStep] = useState<'initiate' | 'confirm'>('initiate');
    const [amount, setAmount] = useState('');
    const [payeeId, setPayeeId] = useState('');
    const [settlementId, setSettlementId] = useState('');
    const [key, setKey] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInitiate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await ApiService.post('/settlements/initiate', {
                payeeId: parseInt(payeeId),
                amount: parseFloat(amount)
            });
            setGeneratedKey(res.data.key);
            // In a real scenario, we might show a success state before moving
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to initiate settlement');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await ApiService.post('/settlements/confirm', {
                settlementId: parseInt(settlementId),
                key
            });
            onClose();
        } catch (errorBy: any) {
            setError(errorBy.response?.data?.message || 'Invalid key or settlement ID');
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
                className="relative w-full max-w-md z-10"
            >
                <Card className="!p-0 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-slate-900/60 backdrop-blur-3xl overflow-hidden !rounded-[2.5rem] inner-glow relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                <Wallet size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter">
                                    {step === 'initiate' ? 'Finance Transfer' : 'Confirm Energy'}
                                </h2>
                                <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-[2px]">Secure Settlement Grid</p>
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

                            {step === 'initiate' ? (
                                <motion.form
                                    key="init"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleInitiate}
                                    className="space-y-6"
                                >
                                    <Input
                                        label="Payee Protocol ID"
                                        type="number"
                                        placeholder="Target member ID"
                                        value={payeeId}
                                        onChange={(e) => setPayeeId(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Settlement Amount (₹)"
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />

                                    <AnimatePresence>
                                        {generatedKey && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl relative overflow-hidden group"
                                            >
                                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <Copy size={16} className="text-emerald-400 cursor-pointer" />
                                                </div>
                                                <p className="text-[9px] text-emerald-500/60 uppercase font-black tracking-[3px] mb-3">Authentication Key Generated</p>
                                                <p className="text-3xl font-mono text-emerald-400 tracking-[0.2em] font-black">{generatedKey}</p>
                                                <p className="text-[9px] text-slate-500 mt-4 leading-relaxed font-bold uppercase tracking-widest">Transmit this secure code to the payee to finalize transfer.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="pt-4 flex flex-col gap-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-16 !rounded-2xl shadow-xl shadow-emerald-500/20"
                                            isLoading={isLoading}
                                            leftIcon={<Key size={20} />}
                                        >
                                            Lock Strategy Key
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setStep('confirm')}
                                            className="text-[10px] text-slate-600 font-black uppercase tracking-[2px] transition-colors hover:text-emerald-500 text-center"
                                        >
                                            Execute confirmation grid instead
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="confirm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleConfirm}
                                    className="space-y-6"
                                >
                                    <Input
                                        label="Transmission ID"
                                        type="number"
                                        placeholder="Enter Settlement ID"
                                        value={settlementId}
                                        onChange={(e) => setSettlementId(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Strategy Key"
                                        type="text"
                                        placeholder="XXXX-XXXX"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        required
                                        className="font-mono tracking-widest text-center text-xl uppercase"
                                    />
                                    <div className="pt-4 flex flex-col gap-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-16 !rounded-2xl shadow-xl shadow-cyan-500/20 !bg-cyan-500"
                                            isLoading={isLoading}
                                            leftIcon={<ShieldCheck size={20} />}
                                        >
                                            Verify & Absorb Energy
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setStep('initiate')}
                                            className="text-[10px] text-slate-600 font-black uppercase tracking-[2px] transition-colors hover:text-emerald-500 text-center"
                                        >
                                            Return to initiation phase
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default SettlementModal;

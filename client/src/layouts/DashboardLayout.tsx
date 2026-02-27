import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30 mesh-gradient">
            {/* Ultra Premium Background Decoratives */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -45, 0],
                        x: [0, -80, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-cyan-500/10 blur-[200px] rounded-full"
                />
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <Sidebar onLogout={handleLogout} refreshTrigger={refreshTrigger} />

            <main className="flex-1 overflow-y-auto custom-scrollbar relative px-8 py-12 md:px-16 md:py-16">
                <Outlet context={{ refreshTrigger, handleRefresh }} />
            </main>
        </div>
    );
};

export default DashboardLayout;

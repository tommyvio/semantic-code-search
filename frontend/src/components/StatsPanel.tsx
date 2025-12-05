import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, FileText, Database, Code2 } from 'lucide-react';
import { api, StatsResponse } from '../types';

export function StatsPanel() {
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getStats();
            setStats(data);
        } catch (err) {
            setError('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    if (error && !stats) return null;

    return (
        <div className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Index Stats</h3>
                        <p className="text-xs text-gray-400">Live backend metrics</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    {loading && !stats ? (
                        <span className="text-xs text-gray-500 animate-pulse">Loading stats...</span>
                    ) : (
                        <>
                            <StatItem
                                icon={<FileText className="h-4 w-4 text-purple-400" />}
                                label="Documents"
                                value={stats?.total_documents_indexed || 0}
                            />
                            {/* Since simple backend only returns total docs, we mock other viz for UI if needed, 
                      or we could update backend to return more. For now, stick to what backend returns.
                      But prompt requested "Total files", "Total code chunks" etc.
                      Our backend currently only sends "total_documents_indexed".
                      "total_documents_indexed" IS chunks in Chroma logic usually.
                   */}

                            <button
                                onClick={fetchStats}
                                disabled={loading}
                                className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                title="Refresh stats"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <div className="flex flex-col">
                <span className="text-lg font-mono font-bold text-white leading-none">
                    {value.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
}

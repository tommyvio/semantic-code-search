import React from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from '../types';

interface FilterSidebarProps {
    filters: SearchFilters;
    onFilterChange: (filters: SearchFilters) => void;
    availableLanguages: string[];
    className?: string;
}

export function FilterSidebar({ filters, onFilterChange, availableLanguages, className = "" }: FilterSidebarProps) {
    const toggleLanguage = (lang: string) => {
        const current = filters.languages || [];
        const updated = current.includes(lang)
            ? current.filter(l => l !== lang)
            : [...current, lang];

        onFilterChange({
            ...filters,
            languages: updated.length ? updated : undefined
        });
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        onFilterChange({
            ...filters,
            min_score: val
        });
    };

    const clearFilters = () => {
        onFilterChange({});
    };

    const activeCount = (filters.languages?.length || 0) + (filters.min_score ? 1 : 0);

    return (
        <div className={`bg-gray-900 border-r border-gray-800 p-6 space-y-8 h-full overflow-y-auto ${className}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Filter className="h-5 w-5 text-indigo-400" />
                    Filters
                </h2>
                {activeCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                    >
                        <X className="h-3 w-3" />
                        Clear ({activeCount})
                    </button>
                )}
            </div>

            {/* Languages */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Languages</h3>
                <div className="space-y-2">
                    {availableLanguages.map(lang => (
                        <label key={lang} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.languages?.includes(lang) || false}
                                    onChange={() => toggleLanguage(lang)}
                                    className="peer h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-gray-900 transition-all cursor-pointer"
                                />
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors capitalize">{lang}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Relevance Score */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Min Relevance</h3>
                    <span className="text-xs text-indigo-400 font-mono">
                        {Math.round((filters.min_score || 0) * 100)}%
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={filters.min_score || 0}
                    onChange={handleScoreChange}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                />
                <div className="flex justify-between text-xs text-gray-600 font-mono">
                    <span>Any</span>
                    <span>Strict</span>
                </div>
            </div>
        </div>
    );
}

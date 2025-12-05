import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const EXAMPLE_QUERIES = [
    "Find authentication functions",
    "Show error handling patterns",
    "Where are database queries?"
];

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                onSearch(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    // Keyboard shortcut Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                    ) : (
                        <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl 
                     text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 focus:border-transparent transition-all shadow-lg
                     hover:border-gray-600"
                    placeholder="Search your code using natural language... (Cmd+K)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <kbd className="hidden md:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-800 border border-gray-700 rounded">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {!query && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {EXAMPLE_QUERIES.map((q) => (
                        <button
                            key={q}
                            onClick={() => setQuery(q)}
                            className="px-3 py-1 text-sm text-gray-400 bg-gray-800 rounded-full 
                               hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                        >
                            "{q}"
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

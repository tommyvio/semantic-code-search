import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { FilterSidebar } from './components/FilterSidebar';
import { StatsPanel } from './components/StatsPanel';
import { UploadPanel } from './components/UploadPanel';
import { api, CodeResult, SearchFilters } from './types';
import { Search, Code2, Menu, X } from 'lucide-react';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CodeResult[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [searchTime, setSearchTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState<SearchFilters>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock available languages - in real app, fetch from stats
    const AVAILABLE_LANGUAGES = ['python', 'javascript', 'typescript', 'go', 'java', 'rust', 'cpp', 'c'];

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        setIsLoading(true);
        setError('');

        try {
            const response = await api.search(searchQuery, 20, filters);
            setResults(response.results);
            setTotalResults(response.total_results);
            setSearchTime(response.search_time);
        } catch (err) {
            setError('Failed to perform search. Is the backend running?');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
        if (query) {
            handleSearch(query);
        }
    };

    const handleExplain = async (code: string) => {
        // In a real app, we'd probably open a modal or expanded view
        // For MVP, alerting the explanation or logging for now as "Explain AI" feature
        // logic was implemented in ResultCard, but let's just log or alert
        const explanation = await api.explainCode(code, query);
        alert(`AI Explanation:\n\n${explanation}`);
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 z-30 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Code2 className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Semantic Code Search
                        </h1>
                    </div>

                    <button
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="pt-16 min-h-screen flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-72 fixed left-0 top-16 bottom-0 z-20">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        availableLanguages={AVAILABLE_LANGUAGES}
                    />
                </aside>

                {/* Sidebar - Mobile Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
                        <aside className="absolute inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 animate-in slide-in-from-left">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                availableLanguages={AVAILABLE_LANGUAGES}
                            />
                        </aside>
                    </div>
                )}

                {/* Content Area */}
                <main className="flex-1 lg:ml-72 flex flex-col min-h-[calc(100vh-4rem)]">
                    <StatsPanel />

                    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
                        {/* Upload Section */}
                        <section className="pt-8">
                            <UploadPanel />
                        </section>

                        {/* Search Section */}
                        <section className="py-8">
                            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                        </section>

                        {/* Results Section */}
                        <section className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && results.length > 0 && (
                                <div className="flex items-center justify-between text-sm text-gray-500 px-2">
                                    <span>Found {totalResults} results ({searchTime.toFixed(3)}s)</span>
                                    <span>Showing top {results.length}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                {results.map((result, idx) => (
                                    <ResultCard
                                        key={`${result.file_path}-${idx}`}
                                        result={result}
                                        onExplain={handleExplain}
                                    />
                                ))}
                            </div>

                            {!isLoading && !query && results.length === 0 && (
                                <div className="text-center py-20 opacity-50">
                                    <Search className="h-16 w-16 mx-auto text-gray-700 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-400">Search for code by intent</h3>
                                    <p className="max-w-md mx-auto mt-2 text-gray-600">
                                        Try "how do we handle tokens?" or "find graph traversal algorithms"
                                    </p>
                                </div>
                            )}

                            {!isLoading && query && results.length === 0 && !error && (
                                <div className="text-center py-20 opacity-50">
                                    <p className="text-gray-400">No results found for "{query}"</p>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;

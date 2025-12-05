import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python'; // Add more languages as needed
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-rust';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

import { CodeResult } from '../types';
import { FileCode, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

interface ResultCardProps {
    result: CodeResult;
    onExplain?: (code: string) => void;
}

export function ResultCard({ result, onExplain }: ResultCardProps) {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [result.code, expanded]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const scoreColor =
        result.score > 0.7 ? "bg-green-500/20 text-green-400 border-green-500/30" :
            result.score > 0.5 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                "bg-gray-500/20 text-gray-400 border-gray-500/30";

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 shadow-sm hover:shadow-md group">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/80">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <FileCode className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-300 truncate font-mono" title={result.file_path}>
                        {result.file_path}
                    </span>
                    <span className={clsx("px-2 py-0.5 rounded text-xs font-medium border", scoreColor)}>
                        {Math.round(result.score * 100)}% Match
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    {onExplain && (
                        <button
                            onClick={() => onExplain(result.code)}
                            className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                        >
                            Explain AI
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-gray-800"
                        title="Copy code"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Code Block */}
            <div className="relative group/code">
                <div className={clsx(
                    "bg-[#1d1f21] overflow-x-auto text-sm transition-all duration-300",
                    expanded ? "max-h-full" : "max-h-64"
                )}>
                    {/* Line numbers could be handled by Prism, but simple mapping is easier for now to match start_line */}
                    <div className="flex min-w-full">
                        <div className="flex-shrink-0 flex flex-col items-end px-2 py-4 text-gray-600 bg-[#1d1f21] border-r border-gray-800 select-none font-mono text-xs">
                            {result.code.split('\n').map((_, i) => (
                                <span key={i} className="leading-6">
                                    {result.start_line + i}
                                </span>
                            ))}
                        </div>
                        <div className="flex-grow">
                            <pre className={`language-${result.language === 'python' ? 'python' : result.language} !bg-transparent !m-0 !p-4 !shadow-none`}>
                                <code className={`language-${result.language === 'python' ? 'python' : result.language}`}>
                                    {result.code}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Expand toggle for long code */}
                {result.code.split('\n').length > 10 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="absolute bottom-2 right-2 p-1 bg-gray-800/80 rounded-full text-gray-400 hover:text-white shadow-lg backdrop-blur-sm opacity-0 group-hover/code:opacity-100 transition-opacity"
                    >
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                <div className="flex space-x-4">
                    <span>Lines {result.start_line}-{result.end_line}</span>
                    <span className="capitalize">{result.language}</span>
                </div>

                {/* Example "Open in GitHub" link - assuming local for now, but could be constructed if repo url known */}
                {/* <a href="#" className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
          <span>View Source</span>
          <ExternalLink className="h-3 w-3" />
        </a> */}
            </div>
        </div>
    );
}

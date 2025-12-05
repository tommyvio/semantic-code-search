import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { config } from '../config';

export function UploadPanel() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<{
        status: 'success' | 'error';
        message: string;
        stats?: { files_indexed: number; chunks_created: number; time_taken: number };
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('languages', 'python,javascript,typescript,go,java,cpp,c,rust');

            const response = await fetch(`${config.apiUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    status: 'success',
                    message: 'Code indexed successfully!',
                    stats: data,
                });
                setFile(null);
            } else {
                setResult({
                    status: 'error',
                    message: data.detail || 'Upload failed',
                });
            }
        } catch (error) {
            setResult({
                status: 'error',
                message: 'Network error. Is the backend running?',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Upload className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Upload Code</h3>
                    <p className="text-sm text-gray-400">
                        Upload a ZIP file containing your codebase
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors bg-gray-900/30"
                    >
                        {file ? (
                            <span className="text-sm text-gray-300">{file.name}</span>
                        ) : (
                            <span className="text-sm text-gray-500">Click to select ZIP file</span>
                        )}
                    </label>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Indexing...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            <span>Upload & Index</span>
                        </>
                    )}
                </button>

                {result && (
                    <div
                        className={`p-4 rounded-lg border ${
                            result.status === 'success'
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                    >
                        <div className="flex items-start space-x-2">
                            {result.status === 'success' ? (
                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{result.message}</p>
                                {result.stats && (
                                    <p className="text-sm mt-1 opacity-80">
                                        Indexed {result.stats.files_indexed} files,{' '}
                                        {result.stats.chunks_created} chunks in{' '}
                                        {result.stats.time_taken.toFixed(2)}s
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-xs text-gray-500">
                    ⚠️ Note: Database resets on server restart (free tier). You may need to
                    re-upload periodically.
                </p>
            </div>
        </div>
    );
}

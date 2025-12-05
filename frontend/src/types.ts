import axios, { AxiosInstance, AxiosResponse } from 'axios';

// --- Interfaces ---

export interface CodeResult {
    code: string;
    file_path: string;
    start_line: number;
    end_line: number;
    language: string;
    score: number;
    function_name?: string;
}

export interface SearchResponse {
    results: CodeResult[];
    query: string;
    total_results: number;
    search_time: number;
}

export interface IndexRequest {
    repo_path: string;
    languages?: string[];
}

export interface IndexResponse {
    status: string;
    files_indexed: number;
    chunks_created: number;
    time_taken: number;
}

export interface SearchFilters {
    languages?: string[];
    min_score?: number;
}

export interface StatsResponse {
    total_documents_indexed: number;
    [key: string]: any;
}

export interface ExplanationResponse {
    explanation: string;
}

// --- API Client ---

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async healthCheck(): Promise<any> {
        try {
            const response = await this.client.get('/health');
            return response.data;
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    async indexRepository(repoPath: string, languages?: string[]): Promise<IndexResponse> {
        try {
            const response = await this.client.post<IndexResponse>('/api/index', { repo_path: repoPath, languages });
            return response.data;
        } catch (error) {
            console.error('Indexing failed:', error);
            throw error;
        }
    }

    async search(query: string, topK: number = 10, filters?: SearchFilters): Promise<SearchResponse> {
        try {
            const payload: any = { query, top_k: topK };
            if (filters?.languages) payload.language_filter = filters.languages;
            if (filters?.min_score) payload.min_score = filters.min_score;

            const response = await this.client.post<SearchResponse>('/api/search', payload);
            return response.data;
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }

    async getStats(): Promise<StatsResponse> {
        try {
            const response = await this.client.get<StatsResponse>('/api/stats');
            return response.data;
        } catch (error) {
            console.error('Failed to get stats:', error);
            throw error;
        }
    }

    async explainCode(code: string, query: string): Promise<string> {
        try {
            const response = await this.client.post<ExplanationResponse>('/api/explain', { code, query });
            return response.data.explanation;
        } catch (error) {
            console.error('Explanation failed:', error);
            return "Failed to get explanation.";
        }
    }
}

export const api = new ApiClient();

import { InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
export interface InternalRequestConfig extends InternalAxiosRequestConfig {
    loading?: boolean;
}
export interface RequestConfig extends AxiosRequestConfig {
    loading?: boolean;
}
declare const createHttpClient: (version?: 'new' | 'old', msgMap?: {
    [key: string]: string;
}[] | undefined) => <_T = any>(config: RequestConfig) => Promise<any>;
export default createHttpClient;

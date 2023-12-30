import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import User from "../../models/User.tsx";

export interface ResponseObject<T = any> {
    message: string;
    data: T;
}

export interface BaseResponse<T = any> extends AxiosResponse {
    data: ResponseObject<T>;
}

export class APIBase {
    private api: AxiosInstance;
    private config: AxiosRequestConfig;

    public constructor(config: AxiosRequestConfig) {
        this.api = axios.create(config);
        this.config = config;

        //Middleware run before request is sent.
        this.api.interceptors.request.use((param: InternalAxiosRequestConfig) => {
            return param
        });

        //Middleware run before response is returned.
        this.api.interceptors.response.use((param: AxiosResponse) => {
            return param
        }, this.globalErrorHandler);

    }

    public globalErrorHandler(error: any): Promise<Error> {
        if (!error.response) {
            return Promise.reject(error.message);
        }
        if (error.response?.status === 401 &&
            typeof error.response?.data?.data === 'string' &&
            (error.response?.data?.data?.indexOf("token is expired") > -1 ||
                error.response?.data?.data?.indexOf("token is unauthorized") > -1)) {
            error.response.data = {message: error.response?.data?.data}
            window.location.href = "/signin";
            User.signOut();
        }

        return Promise.reject(error.response?.data?.message);
    }

    public getUri(config?: AxiosRequestConfig): string {
        return this.api.getUri(config);
    }

    public request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
        return this.api.request(config);
    }

    public get<T, R = BaseResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        url = APIBase.UrlWithDebugParam(url);
        return this.api.get(url, config);
    }

    public delete<T, R = BaseResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        url = APIBase.UrlWithDebugParam(url);
        return this.api.delete(url, config);
    }

    public head<T, R = BaseResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.head(url, config);
    }

    public post<T, R = BaseResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        url = APIBase.UrlWithDebugParam(url);
        return this.api.post(url, data, config);
    }

    public put<T, R = BaseResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        url = APIBase.UrlWithDebugParam(url);
        return this.api.put(url, data, config);
    }

    public postFile<T, R = BaseResponse<T>>(url: string, data?: any, eventListener?: any): Promise<R> {
        this.config.onUploadProgress = eventListener;
        return this.api.post(url, data, this.config);
    }

    public putFile<T, R = BaseResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return this.api.put(url, data, config);
    }

    public patch<T, R = BaseResponse<T>>(url: string, data?: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.patch(url, data, config);
    }

    private static UrlWithDebugParam(url: string): string {
        if (User.isDeveloper()) {
            if (url?.includes('?')) {
                url += "&debug=1"
            } else {
                url += "?debug=1"
            }
        }
        return url
    }
}
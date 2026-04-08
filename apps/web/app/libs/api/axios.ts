import axios from 'axios';

export const publicApi = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const api = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 15000,
    withCredentials: true, // REQUIRED for refresh-token cookie
});
//
// let isRefreshing = false;
// let failedQueue: {
//     resolve: (token: string) => void;
//     reject: (error: ResponseFailed) => void;
// }[] = [];
//
// const processQueue = (error: ResponseFailed | null, token: string | null) => {
//     failedQueue.forEach((prom) => {
//         if (error) {
//             prom.reject(error);
//         } else if (token) {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // const originalRequest = error.app-admin;
        const response = error.response;

        if (!response) {
            return Promise.reject({
                success: false,
                error: {
                    message: 'Network error',
                    statusCode: 0,
                },
            });
        }

        // if (
        //     response.status === 401 &&
        //     !originalRequest._retry &&
        //     !originalRequest.url?.includes('/refresh-token')
        // ) {
        //     if (isRefreshing) {
        //         return new Promise((resolve, reject) => {
        //             failedQueue.push({
        //                 resolve: () => resolve(api(originalRequest)),
        //                 reject,
        //             });
        //         });
        //     }
        //
        //     originalRequest._retry = true;
        //     isRefreshing = true;
        //
        //     try {
        //         await refreshToken();
        //         processQueue(null, 'ok');
        //         return api(originalRequest);
        //     } catch (err) {
        //         processQueue(err as ResponseFailed, null);
        //         return Promise.reject(err);
        //     } finally {
        //         isRefreshing = false;
        //     }
        // }

        return Promise.reject(response.data);
    }
);

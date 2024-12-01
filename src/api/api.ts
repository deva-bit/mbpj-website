import { Auth } from 'aws-amplify';
import axios, { AxiosInstance, AxiosPromise, Cancel } from 'axios';
import {
  ApiRequestConfig,
  WithAbortFn,
  ApiExecutor,
  ApiExecutorArgs,
  ApiError,
} from './api.types';
const { VITE_APP_API_BACKEND_URL } = import.meta.env;
// Default config for the axios instance
const axiosParams = {
  // Set different base URL based on the environment
  baseURL: VITE_APP_API_BACKEND_URL
};

// Create axios instance with default params
const axiosInstance = axios.create(axiosParams);

const didAbort = (error: unknown): error is Cancel & { aborted: boolean } =>
  axios.isCancel(error);

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error: unknown): error is ApiError => {
  return axios.isAxiosError(error);
};

const withAbort = <T>(fn: WithAbortFn) => {
  const executor: ApiExecutor<T> = async (...args: ApiExecutorArgs) => {
    const originalConfig = args[args.length - 1] as ApiRequestConfig;
    // Extract abort property from the config
    const { abort, ...config } = originalConfig;

    // Create cancel token and abort method only if abort
    // function was passed
    if (typeof abort === 'function') {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn<T>(url, body, config);
      } else {
        const [url] = args;
        return await fn<T>(url, config);
      }
    } catch (error) {
      // Add "aborted" property to the error if the request was cancelled
      if (didAbort(error)) {
        error.aborted = true;
      }

      throw error;
    }
  };

  return executor;
};

const withLogger = async <T>(promise: AxiosPromise<T>) =>
  promise.catch((error: ApiError) => {
    /*
    Always log errors in dev environment
    if (process.env.NODE_ENV !== 'development') throw error      
  */
    // Log error only if VUE_APP_DEBUG_API env is set to true
    if (!import.meta.env.REACT_APP_DEBUG_API) throw error;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);

    throw error;
  });

// Main api function
const api = (axios: AxiosInstance) => {
  return {
    get: <T>(url: string, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axios.get)(url, config)),
    delete: <T>(url: string, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axios.delete)(url, config)),
    post: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axios.post)(url, body, config)),
    patch: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axios.patch)(url, body, config)),
    put: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axios.put)(url, body, config)),
  };
};

axiosInstance.interceptors.request.use(
  async config => {
    const currentSession = await Auth.currentSession()
    
    //const accessToken = currentSession.getAccessToken().getJwtToken();
    const accessToken = currentSession.getIdToken().getJwtToken(); 
    config.headers['Authorization'] = `Bearer ${accessToken}`
    config.headers['Accept'] = 'application/json'
    return config;
  },
  error => {
    Promise.reject(error)
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (response.status === 401) {
      try {
        const currentSession = await Auth.currentSession()
        const accessToken = currentSession.getIdToken().getJwtToken();
        config.headers['Authorization'] = `Bearer ${accessToken}`
        config.headers['Accept'] = 'application/json'
        return axiosInstance(config);
      } catch (e) {
        console.log(e);
      }
    }
    return error;
  }
)

export default api(axiosInstance);

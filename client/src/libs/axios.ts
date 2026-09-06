import axios from 'axios';

export const IS_LOGGED_IN_FLAG_KEY = 'IS_LOGGED_IN';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfRequest: Promise<unknown> | null = null;

apiClient.interceptors.request.use(async (config) => {
  const isUnsafeMethod = !['get', 'head', 'options'].includes(
    (config.method ?? 'get').toLowerCase(),
  );
  const hasCsrfCookie = document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('csrftoken='));

  if (isUnsafeMethod && !hasCsrfCookie) {
    csrfRequest ??= apiClient.get('/auth/csrf/').finally(() => {
      csrfRequest = null;
    });
    await csrfRequest;
  }

  return config;
});

// -----------------------------------------------------------------
// RESPONSE INTERCEPTOR (Handle 401 & Refresh Token)
// -----------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/auth/token/');

    const errorCode = error.response?.data?.error?.code;
    const isTokenError = errorCode === 'token_not_valid';

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry && // Avoid infinite loops
      !isAuthEndpoint && // Prevent intercepting failed logins
      isTokenError // Only attempt refresh if the error is due to an invalid token
    ) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint to get a new access token.
        // The browser will automatically send the 'refresh_token' cookie.
        // Backend will respond by setting a new 'access_token' cookie.
        await apiClient.post('/auth/token/refresh/', {});

        // Now retry the original request.
        // The browser will automatically attach the newly minted access_token cookie.
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user is logged out.
        localStorage.removeItem(IS_LOGGED_IN_FLAG_KEY); // Clear the login flag from localStorage
        // Reject the original error
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

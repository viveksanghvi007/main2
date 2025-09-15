export const BASE_URL = "https://main2-84p1.onrender.com";

//utils/apiPath.js
export const API_PATHS = {

    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        VERIFY_EMAIL: "/api/auth/verify-email",
        REQUEST_LOGIN_OTP: "/api/auth/request-login-otp",
        LOGIN_WITH_OTP: "/api/auth/login-with-otp",
        RESEND_OTP: "/api/auth/resend-otp",
        GET_PROFILE: "/api/auth/profile",
    },
    RESUME: {
        CREATE: "/api/resume",
        GET_ALL: "/api/resume",
        GET_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/upload-images/${id}`,
        EXPORT: (id, format = 'json') => `/api/resume/${id}/export?format=${format}`,
        ANALYZE_TEXT: () => `/api/resume/analyze`,
        ANALYZE_UPLOAD: () => `/api/resume/analyze-upload`,
    },
    image: {
        UPLOAD_IMAGE: "api/auth/upload-image",
    },
};
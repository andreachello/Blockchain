export const is4xxClientError = (status) => status >= 400 && status < 500;
export const is5xxServerError = (status) => status >= 500 && status < 600;

export const _200_OK = 200;
export const _404_NOT_FOUND = 404;
export const _429_TOO_MANY_REQUESTS = 429;
export const _500_INTERNAL_SERVER_ERROR = 500;

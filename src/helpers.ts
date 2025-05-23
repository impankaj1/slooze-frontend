export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export let accessToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const removeAccessToken = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

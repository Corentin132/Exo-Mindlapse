import { API_BASE_URL } from "../config/api";
import { createHttpClient } from "@admin-dashboard/shared-ui/lib/httpClient";


export const httpClient = createHttpClient({
  baseUrl: API_BASE_URL,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});
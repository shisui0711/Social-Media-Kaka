import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://localhost:8000/api/auth/sign-in", () => {
    return HttpResponse.json({
      token: "mocked-jwt-token",
      refreshToken: "mocked-refresh-token",
    });
  })
]
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => { 
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) { 
    const refreshToken = request.cookies.get("refresh_token")?.value;
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) { 
      const { access } = await response.json();
      const cookieStore = await cookies();
      cookieStore.set("access_token", access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
        sameSite: "strict",
      });
    }
  }
}

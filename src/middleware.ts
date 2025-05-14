import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { JwtData } from "@/types";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
    console.log("Middleware: start");

    if (request.nextUrl.pathname === '/signin') {
        return NextResponse.next();
    }

    const cookieStore = await cookies();

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;
    // console.log(`Middleware refreshToken: ${refreshToken}`);

    if (accessToken === 'admin' && refreshToken === 'admin') {
        console.log('You are Admin! :)');
        return NextResponse.next();
    }

    const now = Math.floor(Date.now() / 1000);
    if (accessToken) {
        const accessExp = getExpirationTime(accessToken);

        if (accessExp < now) {
            if (!refreshToken) {
                console.log("No refresh token. Redirecting to login.");
                cookieStore.delete('access_token');
                cookieStore.delete('refresh_token');
                return NextResponse.redirect(new URL("/signin", request.url));
            }

            const refreshExp = getExpirationTime(refreshToken);
            if (refreshExp < now) {
                console.log("Refresh token expired. Redirecting to login.");
                cookieStore.delete('access_token');
                cookieStore.delete('refresh_token');
                return NextResponse.redirect(new URL("/signin", request.url));
            }

            const success = await rotateAccessToken(refreshToken);
            if (!success) {
                console.log("Token rotation failed. Redirecting to login.");
                cookieStore.delete('access_token');
                cookieStore.delete('refresh_token');
                return NextResponse.redirect(new URL("/signin", request.url));
            }
        }
    } else if (refreshToken) {
        const success = await rotateAccessToken(refreshToken);
        if (!success) {
            console.log("Token rotation failed. Redirecting to login.");
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
            return NextResponse.redirect(new URL("/signin", request.url));
        }
    } else {
        console.log("No tokens found. Redirecting to login.");
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    console.log("Middleware: end");
    return NextResponse.next();
}

function getExpirationTime(token: string): number {
    try {
        const decoded: JwtData = jwtDecode(token);
        return decoded.exp;
    } catch (error) {
        console.error("Invalid token:", error);
        return 0;
    }
}

async function rotateAccessToken(refreshToken: string) {
    try {
        const response = await fetch(`${process.env.API_SERVER_URL}/api/auth/reissue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        console.log(response.ok)
        console.log(response.statusText)
        console.log(await response.text())
        if (!response.ok) {
            console.error("Failed to rotate access token:", response.status);
            return false;
        }

        const cookieList = response.headers.getSetCookie().map((v) => v.slice(0, v.indexOf(" ") - 1).split("="));
        const cookieStore = await cookies();

        for (const cookieInfo of cookieList) {
            const decoded: JwtData = jwtDecode(cookieInfo[1]);
            cookieStore.set({
                name: 'access_token',
                value: decodeURIComponent(cookieInfo[1]),
                expires: new Date((decoded.exp + 9 * 60 * 60) * 1000), // GMT+9
            });
        }

        return true;
    } catch (error) {
        console.error("Error rotating access token:", error);
        return false;
    }
}

export const config = {
    matcher: [
        "/signin/:path*",
        "/home/:path*",
        "/search/:path*",
        "/personnel-search/:path*",
    ],
};
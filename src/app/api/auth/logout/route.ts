import { removeFcmToken } from '@/utils/fcmToken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    if (credentials === 'admin') {
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.json({ ok: true })
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        return NextResponse.json({ ok: false });
    }

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    const error = removeFcmToken();
    if (error) {
        console.log(`/api/logout: removeFcmToken() / ${error}`);
    }

    return NextResponse.json({ ok: true });
}
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    if (credentials === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.VA8uF5pXI9_HNVSUJdOAVCzeS5CUltV5znCK6FnGg8Q') {
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
    
    return NextResponse.json({ ok: true });
}
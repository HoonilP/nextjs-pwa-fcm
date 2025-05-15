'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/types';

export async function createThemeAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const data = {
        'data': 'data',
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/theme`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const status = response.status;
        return {
            status: status,
            message: '믱'
        }
    }

    return {
        status: 200,
        message: '테마 생성 완료'
    };
}
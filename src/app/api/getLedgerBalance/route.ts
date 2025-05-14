import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');

    // const response = await fetch(`${process.env.API_SERVER_URL}/api/pubsub/ledger/${path}`, {
    const response = await fetch(`${process.env.TEST_SERVER_URL}/ledger/${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        console.log('Failed to fetch data');
    }

    const data = await response.json();
    const ledgerData = data.data;

    return NextResponse.json({ ledgerData })
}
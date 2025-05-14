import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 시연용
import { JwtData } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
// 시연용

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');

    // const response = await fetch(`${process.env.API_SERVER_URL}/personnel/${path}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${credentials}`
    //     },
    // });

    // if (!response.ok) {
    //     console.log('Failed to fetch data');
    // }

    // const data = await response.json();
    // const personnelData = data.data;

    // 시연용
    const userRef = collection(db, 'users');
    const q = query(userRef, where('role', '==', path));
    const querySnapshot = await getDocs(q);
    const personnelData: any[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        personnelData.push(data);
    });
    // 시연용

    return NextResponse.json({ personnelData })
}
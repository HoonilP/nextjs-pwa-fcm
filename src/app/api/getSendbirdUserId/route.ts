// Credentials
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// Firebase
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// React
import { NextResponse } from 'next/server';

// Types
import { JwtData } from '@/types';

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const decoded: JwtData = jwtDecode(String(accessToken));
    
    const userRef = collection(db, 'users');
    const q = query(userRef, where('studentId', '==', decoded.studentId));
    const querySnapshot = await getDocs(q);

    let sendbirdUserId;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        sendbirdUserId = data.sendBirdUserId;
    });

    return NextResponse.json({ sendbirdUserId });
}
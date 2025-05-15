'use server';

// Credentials
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

// Firebase
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// Types
import { signinFormSchema, signupFormSchema, JwtData, serverActionMessage } from "@/types";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

export async function signin(_: unknown, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();

    const data = {
        studentId: formData.get('studentId'),
        password: formData.get('password'),
    }

    // ===================== Admin: Test용 =====================
    if (data.studentId === 'admin' && data.password === 'Dkssudgktpdy12!') {
        cookieStore.set({
            name: 'access_token',
            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.VA8uF5pXI9_HNVSUJdOAVCzeS5CUltV5znCK6FnGg8Q',
            expires: new Date(Date.now() + 600 * 60 * 1000) // 한국: GMT +9 = 9*60*60
        });
        cookieStore.set({
            name: 'refresh_token',
            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.VA8uF5pXI9_HNVSUJdOAVCzeS5CUltV5znCK6FnGg8Q',
            expires: new Date(Date.now() + 600 * 60 * 1000)// 한국: GMT +9 = 9*60*60
        });

        redirect('/home');
    }
    // ===================== Admin: Test용 =====================

    try {
        signinFormSchema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                status: 400,
                message: error.errors.map((err) => err.message).join("\n"),
            };
        }

        return {
            status: 500,
            message: "서버 오류가 발생했습니다. 관리자에게 문의하세요.",
        };
    }

    const credentials = btoa(`${data.studentId}:${data.password}`);
    const response = await fetch(`${process.env.API_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
        },
        credentials: 'include',
    });

    if (!response.ok) {
        console.log('로그인에 실패하였습니다. 다시 시도해주세요.');
    }

    // 'use server'; 때문에 쿠키가 client로 저장되지 않음
    const cookieList = response.headers.getSetCookie().map((v) => v.slice(0, v.indexOf(' ') - 1).split('='));

    for (const cookieInfo of cookieList) {
        const decoded: JwtData = jwtDecode(cookieInfo[1]);
        cookieStore.set({
            name: cookieInfo[0],
            value: decodeURIComponent(cookieInfo[1]),
            expires: new Date((decoded.exp + 9 * 60 * 60) * 1000) // 한국: GMT +9 = 9*60*60
        });
    }

    redirect('/home');
}

export async function signup(_: unknown, formData: FormData): Promise<serverActionMessage> {
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        studentId: formData.get('studentId'),
        role: formData.get('role') === 'on' ? 'ROLE_COMMITTEE' : 'ROLE_STUDENT',
    }

    try {
        signupFormSchema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                status: 400,
                message: error.errors.map((err) => err.message).join("\n"),
            };
        }

        return {
            status: 500,
            message: "서버 오류가 발생했습니다. 관리자에게 문의하세요.",
        };
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 400) {
            return {
                status: 400,
                message: '이미 회원가입된 계정입니다. 로그인을 진행해주세요.'
            }
        }
        console.log('회원가입에 실패하였습니다. 다시 시도해주세요.');
    }

    const userId = `${data.studentId}_${data.username}_${data.role === 'ROLE_STUDENT' ? '학생' : '학생회'}`;
    const sendbirdResponse = await fetch(`https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Token': `${process.env.SENDBIRD_API_TOKEN}`
        },
        body: JSON.stringify({
            user_id: userId,
            nickname: userId,
            profile_url: '',
            profile_file: btoa(''),
        }),
    });

    console.log(`채팅 회원가입: ${await sendbirdResponse.text()}`)
    if (!sendbirdResponse.ok) {
        console.log('채팅 회원가입에 실패');
        return {
            status: 400,
            message: '채팅 회원가입에 실패하였습니다. 관리자에게 문의하세요.'
        }
    }

    const channelURL = data.role === 'ROLE_STUDENT' ? process.env.NEXT_PUBLIC_SENDBIRD_STUDENT_CHATROOM : process.env.NEXT_PUBLIC_SENDBIRD_COUNCIL_CHATROOM;
    const sendbirdResponse2 = await fetch(`https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/${channelURL}/join`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Api-Token': `${process.env.SENDBIRD_API_TOKEN}`
        },
        body: JSON.stringify({
            user_id: userId,
        }),
    });

    if (!sendbirdResponse2.ok) {
        console.log('유저 채팅방 가입 실패');
        return {
            status: 400,
            message: '유저 채팅방 가입에 실패하였습니다. 관리자에게 문의하세요.'
        }
    }

    const sendbirdResponse3 = await fetch(`https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/${process.env.NEXT_PUBLIC_SENDBIRD_ALL_CHATROOM}/join`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Api-Token': `${process.env.SENDBIRD_API_TOKEN}`
        },
        body: JSON.stringify({
            user_id: userId,
        }),
    });

    if (!sendbirdResponse3.ok) {
        console.log('전체 채팅방 가입 실패');
        return {
            status: 400,
            message: '전체 채팅방 가입에 실패하였습니다. 관리자에게 문의하세요.'
        }
    }

    const serviceAccount: ServiceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    const db = admin.firestore();

    const userRef = db.collection('users').doc();
    await userRef.set({
        sendBirdUserId: userId,
        studentId: data.studentId,
        uuid: userRef.id,
        // 시연 영상용 data
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role === 'ROLE_STUDENT' ? 'student' : 'committee',
    });

    return {
        status: 200,
        message: '회원가입 요청이 성공적으로 완료되었습니다. 승인이 완료될 때까지 기다려주세요.',
    }
}
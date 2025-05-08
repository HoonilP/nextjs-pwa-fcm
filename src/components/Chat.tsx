'use client';

// Sendbird
import '@sendbird/uikit-react/dist/index.css';
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";

// React
import { useEffect, useState } from 'react';

// Types
import { ChatProps } from '@/types';

export default function Chat({ channelUrl }:
    ChatProps
) {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        fetch(`/api/getSendbirdUserId`)
            .then((res) => res.json())
            .then((data) => {
                if (!data) return
                const sendbirdUserId = data?.sendbirdUserId;
                setUserId(sendbirdUserId);
            });
    }, []);

    const colorSet = {
        '--sendbird-light-primary-500': '#1c1c1c',
        '--sendbird-light-primary-400': '#333333',
        '--sendbird-light-primary-300': '#4d4d4d',
        '--sendbird-light-primary-200': '#666666',
        '--sendbird-light-primary-100': '#808080',
    }

    if (!userId) {
        return <div>Loading...</div>;
    }

    if (userId.trim() === "") {
        return <div>Invalid user ID</div>;
    }

    return (
        <div style={{ width: '100%', height: '96vh' }}>
            <SendbirdProvider
                appId={'ADEB5B52-A184-4FBC-8DC8-0FD55D02CA63'}
                userId={userId}
                colorSet={colorSet}
            >
                <GroupChannel channelUrl={channelUrl} />
            </SendbirdProvider>
        </div>
    );
}
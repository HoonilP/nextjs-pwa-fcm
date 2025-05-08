'use client';

// Sendbird
import '@sendbird/uikit-react/dist/index.css';

// React
import dynamic from "next/dynamic";

const DynamicAppWithNoSSR = dynamic(() => import("@/components/Chat"), {
    ssr: false,
    loading: () => (
        <p>로딩중</p>
    )
});

export default function AllChat() {
    return (
        <div className='flex justify-center self-center'>
            <DynamicAppWithNoSSR channelUrl={process.env.NEXT_PUBLIC_SENDBIRD_ALL_CHATROOM || ''} />
        </div>
    );
}
'use client';

// Components: Hook
import useSendPush from "@/hooks/useSendPush";

// Components: UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// React
import { useState } from "react";

export default function AdminPushPage() {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [url, setUrl] = useState("/");
	const { sendPush, loading, error } = useSendPush();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !body) {
			alert("제목과 내용을 모두 입력해주세요.");
			return;
		}

		try {
			const result = await sendPush({
				title,
				body,
				click_action: url,
			});

			if (result?.result?.success) {
				alert(`푸시 알림이 성공적으로 발송되었습니다! (성공: ${result.result.successCount}, 실패: ${result.result.failureCount})`);
				setTitle("");
				setBody("");
				setUrl("/");
			} else {
				console.log(`푸시 알림 발송에 실패했습니다.\n${result.result}`);
			}
		} catch (err) {
			console.log(`푸시 알림 발송 중 오류가 발생했습니다.\n${err}`);
		}
	};

	return (
		<div className="container mx-auto px-4 py-4">
			<div className="rounded-lg p-6">
				<h1 className="text-4xl font-bold mb-12">푸시 알림 발송</h1>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<Label htmlFor="title" className="block font-medium mb-2">
							제목
						</Label>
						<Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="알림 제목을 입력하세요" required />
					</div>

					<div className="mb-4">
						<Label htmlFor="body" className="block font-medium mb-2">
							내용
						</Label>
						<Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} placeholder="알림 내용을 입력하세요" required />
					</div>

					<div className="mb-6">
						<Label htmlFor="url" className="block font-medium mb-2">
							이동 URL
						</Label>
						<Input type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="알림 클릭 시 이동할 URL" />
					</div>

					<Button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50" disabled={loading} >
						{loading ? "발송 중..." : "푸시 알림 발송하기"}
					</Button>

					{error && (
						<div className="mt-4 text-red-500">
							{error}
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
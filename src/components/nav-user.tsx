"use client"

// Components: UI
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { toast } from "sonner"

// Components: Icon
import { LogOut } from "lucide-react"

// React
import { useState } from "react"
import { useRouter } from "next/navigation"

// Types
import { userRoleEnum } from "@/types"
import { removeFcmToken } from "@/utils/fcmToken"

export function NavUser({ username, userRole }: {
	username: string;
	userRole: userRoleEnum;
}) {
	// Router Handler
	const router = useRouter();

	// Dialog Handler
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Logout Handler
	const handleLogout = async () => {
		fetch('/api/auth/logout').then(
			res => res.json()
		).then(data => {
			if (data.ok) {
				removeFcmToken(userRole);
				router.push('/signin');
			} else {
				toast.error("로그아웃 실패. 다시 시도해주세요.");
				setIsDialogOpen(false);
			}
		});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					{userRole === userRoleEnum.ROLE_COMMITTEE ? (
						<Avatar className="h-8 w-[60px] rounded-lg">
							<AvatarFallback className="rounded-lg bg-black text-white">
								학생회
							</AvatarFallback>
						</Avatar>
					) : userRole === userRoleEnum.ROLE_STUDENT ? (
						<Avatar className="h-8 w-[50px] rounded-lg">
							<AvatarFallback className="rounded-lg bg-black text-white">
								학생
							</AvatarFallback>
						</Avatar>
					) : (
						<Avatar className="h-8 w-[60px] rounded-lg">
							<AvatarFallback className="rounded-lg bg-black text-white">
								운영자
							</AvatarFallback>
						</Avatar>
					)}
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{username}</span>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<LogOut type="button" className="cursor-pointer" onClick={() => setIsDialogOpen(true)} />
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Logout</DialogTitle>
								<DialogDescription>로그아웃 하실건가요?</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button variant="secondary" onClick={() => setIsDialogOpen(false)}>취소</Button>
								<Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">로그아웃</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

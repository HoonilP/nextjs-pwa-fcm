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

export function NavUser({ username, userRole }: {
	username: string;
	userRole: number;
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
				router.push('/signin');
			} else {
				toast.error("Logout failed. Please try again later.");
				setIsDialogOpen(false);
			}
		});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					{userRole === 0 ? (
						<Avatar className="h-8 w-[60px] rounded-lg">
							<AvatarFallback className="rounded-lg bg-black text-white">
								학생회
							</AvatarFallback>
						</Avatar>
					) : userRole === 1 ? (
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
								<DialogDescription>Are you sure you want to log out?</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
								<Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">Confirm</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

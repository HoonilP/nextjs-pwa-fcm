"use client"

// Components: Icons
import { PenLine, MessageCircle, ListChecks, Search, ShieldUser } from "lucide-react"

// Components: UI
import { NavMain } from "@/components/nav-main"
import { NavManagements } from "@/components/nav-management"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// Context
import { useUser } from "@/context/UserProvider"

// React
import * as React from "react"
import Image from "next/image"
import Link from "next/link"

// Types
import { userRoleEnum } from "@/types"

const data = {
	navMain: [
		// -- 승인 --
		// 학생회 가입 요청(학생회만)
		// 학생 가입 요청(학생회만)
		// 입금내역 승인(학생회만)
		// 출금내역 승인(학생만)
		{
			title: "요청 승인",
			url: "#",
			icon: ListChecks,
			items: [
				{ title: "학생회 가입 요청", url: "/approve/committee" },
				{ title: "학생 가입 요청", url: "/approve/student" },
				{ title: "입금 내역", url: "/approve/credit" },
				{ title: "출금 내역", url: "/approve/debit" },
			],
		},
		// -- 입력 --
		// 테마 등록하기(학생회장만)
		// 입금 내역 넣기(학생&학생회)
		// 출금 내역 넣기(학생회만)
		{
			title: "등록",
			url: "#",
			icon: PenLine,
			items: [
				{ title: "테마 등록", url: "/registration/theme" },
				{ title: "입금 내역 등록", url: "/registration/deposit" },
				{ title: "출금 내역 등록", url: "/registration/withdrawl" },
			],
		},
		// -- 회원 조회 --
		// 학생, 학생회 회원 조회(학생회만)
		{
			title: "회원 조회",
			url: "#",
			icon: Search,
			items: [
				{ title: "학생회 조회", url: "/personnel-search/committee" },
				{ title: "학생 조회", url: "/personnel-search/student" },
			],
		},
		{
			title: "입출금 내역 조회",
			url: "#",
			icon: Search,
			items: [
				{ title: "전체 내역", url: "/search/all" },
				{ title: "입금 내역", url: "/search/deposit" },
				{ title: "출금 내역", url: "/search/withdrawal" },
				{ title: "나의 내역", url: "/search/my" },
				{ title: "테마별 내역", url: "/search/theme" },
			],
		},
		{
			title: "Admin",
			url: "#",
			icon: ShieldUser,
			items: [
				{ title: "Push 알림 테스트", url: "/admin" },
			],
		},
	],
	menus: [
		{ name: "전체 채팅방", url: "/chat/all", icon: MessageCircle },
		{ name: "학생회 채팅방", url: "/chat/committee", icon: MessageCircle },
		{ name: "학생 채팅방", url: "/chat/student", icon: MessageCircle },
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { username, userRole, userId } = useUser();

	const filteredNavMain = data.navMain
		.map(nav => {
			if (nav.title === "Admin") {
				if (userRole !== userRoleEnum.ROLE_ADMIN) {
					return null;
				}
			}
			return nav;
		}).filter((nav) => nav !== null);

	const filteredMenus = data.menus.filter(menu => {
		if (userRole === userRoleEnum.ROLE_COMMITTEE && menu.name === "학생 채팅방") {
			return false;
		}
		if (userRole === userRoleEnum.ROLE_STUDENT && menu.name === "학생회 채팅방") {
			return false;
		}
		return true;
	});

	return (
		<Sidebar collapsible="icon" {...props}>
			<Link href="/home">
				<SidebarHeader className="pb-0">
					<Image src="/favicon.ico" width={35} height={40} alt="Logo" style={{ width: 40, height: "auto" }} priority />
				</SidebarHeader>
			</Link>

			<SidebarContent>
				<NavMain items={filteredNavMain} />
				<NavManagements menus={filteredMenus} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser username={username} userRole={userRole} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}
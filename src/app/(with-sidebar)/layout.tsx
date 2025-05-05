// Components: UI
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProvider } from "@/context/UserProvider";
import { ThemeProvider } from "next-themes";

//React
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<UserProvider>
				<SidebarProvider>
					<AppSidebar />
					<main className="w-full">
						{children}
					</main>
				</SidebarProvider>
			</UserProvider>
		</ThemeProvider>
	);
}
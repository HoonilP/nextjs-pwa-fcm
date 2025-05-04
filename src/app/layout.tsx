// Components: CSS
import "./globals.css";

// Components: UI
import { Toaster } from "@/components/ui/sonner"

// React
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Scholarly Chain",
	description: "Blockchain Hyperledger Service for Student Council",
};

export const viewport: Viewport = {
	themeColor: "#fff",
};

export default function RootLayout({ children }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
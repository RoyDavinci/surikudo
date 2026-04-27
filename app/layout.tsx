/* app/layout.tsx */
import type { Metadata } from "next";
import { Geist, Geist_Mono, Arvo } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./components/ReduxProvider";
import AuthBootstrap from "./providers/AuthBootstrap";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const arvo = Arvo({
	variable: "--font-arvo",
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: "Studio Surikudo — Book World Class Studios in Seconds",
	description:
		"Professional Digital Production, Dolby Atmos, Podcast, and Photo Studios.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${arvo.variable} antialiased`}
			>
				<ReduxProvider>
					<AuthBootstrap>{children} </AuthBootstrap>
				</ReduxProvider>
			</body>
		</html>
	);
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Store email in localStorage so dashboard can read it
		localStorage.setItem("userEmail", email);
		router.push("/dashboard");
	};

	return (
		<main
			style={{
				minHeight: "100vh",
				background: "#fff",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header */}
			<header
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "24px 40px",
				}}
			>
				<Link href='/' style={{ textDecoration: "none" }}>
					<span
						style={{
							color: "#e60000",
							fontWeight: 900,
							fontSize: 20,
							letterSpacing: "-0.03em",
							textTransform: "uppercase",
						}}
					>
						STUDIO&nbsp; SURIKUDO
					</span>
				</Link>
				<Link
					href='/register'
					style={{
						border: "1px solid #ccc",
						padding: "10px 22px",
						borderRadius: 6,
						textDecoration: "none",
						display: "flex",
						alignItems: "center",
						gap: 10,
						fontSize: 14,
						color: "#555",
						fontWeight: 500,
					}}
				>
					Create an account <span>→</span>
				</Link>
			</header>

			{/* Form */}
			<div
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					paddingBottom: 60,
				}}
			>
				<div style={{ width: "100%", maxWidth: 440, padding: "0 24px" }}>
					<h1
						style={{
							fontSize: 72,
							fontWeight: 700,
							textAlign: "center",
							marginBottom: 48,
							color: "#1a1a1a",
							lineHeight: 1,
							letterSpacing: "-0.03em",
							fontFamily: "var(--font-arvo), serif",
						}}
					>
						Login
					</h1>

					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: 12 }}
					>
						{/* Email input */}
						<div
							style={{
								display: "flex",
								alignItems: "stretch",
								background: "#f5f5f5",
								borderRadius: 4,
								overflow: "hidden",
								height: 60,
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									padding: "0 18px",
									background: "#eeeeee",
									color: "#999",
								}}
							>
								<svg
									viewBox='0 0 20 20'
									fill='currentColor'
									width='18'
									height='18'
								>
									<path
										fillRule='evenodd'
										d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<input
								type='email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Enter your email address'
								style={{
									flex: 1,
									background: "transparent",
									border: "none",
									outline: "none",
									padding: "0 16px",
									fontSize: 15,
									color: "#444",
								}}
							/>
						</div>

						{/* Submit */}
						<button
							type='submit'
							style={{
								background: "#e60000",
								color: "#fff",
								border: "none",
								height: 60,
								fontWeight: 700,
								fontSize: 13,
								letterSpacing: "0.12em",
								textTransform: "uppercase",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								borderRadius: 2,
							}}
						>
							Login <span style={{ fontSize: 16 }}>→</span>
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}

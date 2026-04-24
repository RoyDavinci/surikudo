/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { registerUser, clearError } from "../lib/redux/slices/authSlice";

export default function RegisterPage() {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useAppDispatch();
	const router = useRouter();

	const { registerStatus, registerError, user } = useAppSelector(
		(state: { auth: any }) => state.auth,
	);
	const isLoading = registerStatus === "loading";

	// Redirect ONLY if the logged-in user is NOT the admin
	useEffect(() => {
		const ADMIN_EMAIL = "roy@studiosurikudo.com";

		if (user && user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
			router.push("/dashboard");
		}
	}, [user, router]);

	// Clear stale errors when the user starts typing again
	useEffect(() => {
		if (registerError) dispatch(clearError());
	}, [email, password, fullName, dispatch]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(registerUser({ email, password, full_name: fullName }));
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
					href='/login'
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
					Already have an account? <span>→</span>
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
						Sign up
					</h1>

					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: 12 }}
					>
						{/* Full Name */}
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
								type='text'
								required
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder='Your full name'
								disabled={isLoading}
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

						{/* Email */}
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
									<path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
									<path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
								</svg>
							</div>
							<input
								type='email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Email address'
								disabled={isLoading}
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

						{/* Password */}
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
										d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<input
								type={showPassword ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Create a password'
								disabled={isLoading}
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
							<button
								type='button'
								onClick={() => setShowPassword((v) => !v)}
								style={{
									background: "none",
									border: "none",
									padding: "0 16px",
									cursor: "pointer",
									color: "#999",
									display: "flex",
									alignItems: "center",
								}}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>

						{/* Error message */}
						{registerError && (
							<p
								style={{
									color: "#e60000",
									fontSize: 13,
									margin: "4px 0 0",
									padding: "10px 14px",
									background: "#fff0f0",
									borderRadius: 4,
									border: "1px solid #ffd0d0",
								}}
							>
								{registerError}
							</p>
						)}

						{/* Submit */}
						<button
							type='submit'
							disabled={isLoading}
							style={{
								background: isLoading ? "#f08080" : "#e60000",
								color: "#fff",
								border: "none",
								height: 60,
								fontWeight: 700,
								fontSize: 13,
								letterSpacing: "0.12em",
								textTransform: "uppercase",
								cursor: isLoading ? "not-allowed" : "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								borderRadius: 2,
								transition: "background 0.2s",
								marginTop: 4,
							}}
						>
							{isLoading ? "Creating account…" : "Register"}
						</button>
					</form>

					<p
						style={{
							textAlign: "center",
							marginTop: 24,
							fontSize: 13,
							color: "#888",
						}}
					>
						By signing up, you agree to our{" "}
						<Link href='/terms' style={{ color: "#e60000" }}>
							Terms of Service
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}

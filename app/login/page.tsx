/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { loginUser, clearError } from "../lib/redux/slices/authSlice";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useAppDispatch();
	const router = useRouter();

	const { status, error, user } = useAppSelector(
		(state: { auth: any }) => state.auth,
	);
	const isLoading = status === "loading";

	// Redirect once login succeeds
	useEffect(() => {
		if (user) router.push("/dashboard");
	}, [user, router]);

	// Clear stale errors when the user starts typing again
	useEffect(() => {
		if (error) dispatch(clearError());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, password]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(loginUser({ email, password }));
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
								{/* Person icon */}
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
								{/* Lock icon */}
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
								placeholder='Enter your password'
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
							{/* Toggle password visibility */}
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
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? (
									// Eye-off icon
									<svg
										viewBox='0 0 20 20'
										fill='currentColor'
										width='18'
										height='18'
									>
										<path
											fillRule='evenodd'
											d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
											clipRule='evenodd'
										/>
										<path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
									</svg>
								) : (
									// Eye icon
									<svg
										viewBox='0 0 20 20'
										fill='currentColor'
										width='18'
										height='18'
									>
										<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
										<path
											fillRule='evenodd'
											d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
											clipRule='evenodd'
										/>
									</svg>
								)}
							</button>
						</div>

						{/* Error message */}
						{error && (
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
								{error}
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
							{isLoading ? (
								"Logging in…"
							) : (
								<>
									Login <span style={{ fontSize: 16 }}>→</span>
								</>
							)}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}

"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { silentAdminLogin, ADMIN_EMAIL } from "../lib/redux/slices/authSlice";

export default function AuthBootstrap({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((s) => s.auth.user);

	useEffect(() => {
		const isNoUser = !user;
		const isCurrentlyAdmin =
			user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

		// Refresh/Login admin session if:
		// 1. No one is logged in.
		// 2. The person logged in is the admin (refreshing their session).
		if (isNoUser || isCurrentlyAdmin) {
			dispatch(silentAdminLogin());
		}
	}, [dispatch, user]); // Only run on mount

	return <>{children}</>;
}

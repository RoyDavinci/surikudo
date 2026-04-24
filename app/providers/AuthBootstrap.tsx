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
		// Only run once on mount
		const isNoUser = !user;
		const isCurrentlyAdmin =
			user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

		// Only attempt silent login if there's no user OR it's the admin
		// This only runs once when the app loads
		if (isNoUser || isCurrentlyAdmin) {
			dispatch(silentAdminLogin());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array - only run once on mount

	return <>{children}</>;
}

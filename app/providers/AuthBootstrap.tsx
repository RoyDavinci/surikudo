"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { silentAdminLogin } from "../lib/redux/slices/authSlice";

export default function AuthBootstrap({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((s) => s.auth.user);

	useEffect(() => {
		// Only run if no user in Redux state (which was loaded from localStorage)
		if (!user) {
			dispatch(silentAdminLogin());
		}
	}, [dispatch, user]);

	return <>{children}</>;
}

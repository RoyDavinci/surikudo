"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { logout } from "../lib/redux/slices/authSlice";

const SESSION_DURATION = 24 * 60 * 60 * 1000;

export default function AuthBootstrap({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((s) => s.auth.user);

	useEffect(() => {
		const now = Date.now();

		const isExpired = user?.loginAt && now - user.loginAt > SESSION_DURATION;

		if (isExpired) {
			console.warn("[Auth] Session expired — logging out");
			dispatch(logout());
			return;
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (!user?.loginAt) return;

		const remaining = SESSION_DURATION - (Date.now() - user.loginAt);

		if (remaining <= 0) {
			dispatch(logout());
			return;
		}

		const timer = setTimeout(() => {
			dispatch(logout());
		}, remaining);

		return () => clearTimeout(timer);
	}, [user, dispatch]);

	return <>{children}</>;
}

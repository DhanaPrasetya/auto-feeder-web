"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, MouseEvent } from "react";

// Adjust this type to match what your /api/schedules actually returns
type Schedule = {
	id: string | number;
	title?: string;
	[key: string]: unknown;
};

// Set to e.g. 30000 to also re-fetch every 30 seconds. 0 = fetch once on load.
const POLL_INTERVAL_MS = 0;

export default function Dashboard() {
	const router = useRouter();
	const [loggingOut, setLoggingOut] = useState(false);
	const [schedulesLoading, setSchedulesLoading] = useState(true);
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setLoggingOut(true);
		setMessage(null);
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			if (response.ok) {
				setMessage({
					type: "success",
					text: data.message || "Logout successful!",
				});
				router.push("/login");
				router.refresh();
			} else {
				setMessage({
					type: "error",
					text: data.message || "Internal server error",
				});
			}
		} catch (err) {
			setMessage({
				type: "error",
				text: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setLoggingOut(false);
		}
	};

	// Fetch logic lives in a reusable function (no click event needed)
	const fetchSchedules = useCallback(
		async (signal?: AbortSignal) => {
			try {
				const response = await fetch("/api/schedules", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					signal,
				});
				const data = await response.json();

				if (response.ok) {
					// Adjust to your API shape: [..] or { schedules: [..] } or { data: [..] }
					const list = Array.isArray(data)
						? data
						: (data.schedules ?? data.data ?? []);
					setSchedules(list);
					setMessage(null);
				} else if (response.status === 401) {
					setMessage({
						type: "error",
						text: data.message || "Unauthorized access. Please log in.",
					});
					router.push("/login");
					router.refresh();
				} else {
					setMessage({
						type: "error",
						text: data.message || "Internal server error",
					});
				}
			} catch (err) {
				// Ignore aborts caused by unmount / React Strict Mode
				if (err instanceof DOMException && err.name === "AbortError") return;
				setMessage({
					type: "error",
					text: "An unexpected error occurred. Please try again.",
				});
			} finally {
				if (!signal?.aborted) setSchedulesLoading(false);
			}
		},
		[router],
	);

	// Auto-fetch when the page loads (and optionally on an interval)
	useEffect(() => {
		const controller = new AbortController();
		const initialFetchTimer = setTimeout(() => {
			void fetchSchedules(controller.signal);
		}, 0);

		let timer: ReturnType<typeof setInterval> | undefined;
		if (POLL_INTERVAL_MS > 0) {
			timer = setInterval(
				() => void fetchSchedules(controller.signal),
				POLL_INTERVAL_MS,
			);
		}

		return () => {
			clearTimeout(initialFetchTimer);
			controller.abort();
			if (timer) clearInterval(timer);
		};
	}, [fetchSchedules]);

	return (
		<div className="p-6">
			{message && (
				<p
					className={`mb-4 text-sm font-medium ${
						message.type === "success" ? "text-green-600" : "text-red-600"
					}`}
				>
					{message.text}
				</p>
			)}

			<button
				type="button"
				onClick={handleLogout}
				className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
				disabled={loggingOut}
			>
				{loggingOut ? "Logging out..." : "Logout"}
			</button>

			<div className="mt-6">
				<h2 className="text-lg font-semibold mb-2">Schedules</h2>

				{schedulesLoading ? (
					<p className="text-sm text-gray-500">Loading schedules...</p>
				) : schedules.length === 0 ? (
					<p className="text-sm text-gray-500">No schedules found.</p>
				) : (
					<ul className="list-disc pl-5">
						{schedules.map((s) => (
							<li key={s.id}>{s.title ?? JSON.stringify(s)}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

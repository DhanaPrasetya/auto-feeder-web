"use client";

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage({
					type: "success",
					text: data.message || "Login successful!",
				});
				setEmail("");
				setPassword("");

				// Refresh router context and redirect user to dashboard
				router.push("/dashboard");
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
			setLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-yellow-200 px-4 py-12">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl"
			>
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Login
					</h1>
				</div>

				{/* Feedback Alert Box */}
				{message && (
					<div
						className={`rounded-lg p-3 text-sm font-medium text-center ${
							message.type === "success"
								? "bg-green-100 text-green-800 border border-green-300"
								: "bg-red-100 text-red-800 border border-red-300"
						}`}
					>
						{message.text}
					</div>
				)}

				<div className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							autoComplete="email"
							required
							disabled={loading}
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 disabled:opacity-50"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							autoComplete="current-password"
							required
							disabled={loading}
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 disabled:opacity-50"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</main>
	);
}

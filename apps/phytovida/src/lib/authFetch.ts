import { useAuth } from "@clerk/clerk-react";

export const useAuthFetch = () => {
	const { getToken } = useAuth();

	const authFetch = async (url: string, options?: RequestInit) => {
		const token = await getToken();

		const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
			...options,
			headers: {
				...options?.headers,
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(
				data.message || "Something went wrong, please try again later.",
			);
		}

		return res.json();
	};

	return { authFetch };
};

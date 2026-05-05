import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

export const useApiClient = () => {
	const { getToken } = useAuth();

	const request = useCallback(
		async (url: string, options?: RequestInit) => {
			const token = await getToken();

			const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
				...options,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					...options?.headers,
				},
			});

			const data = await res.json();

			if (!res.ok) {
				throw {
					status: res.status,
					message: data.message || "Something went wrong",
				}
			}

			return data;
		},
		[getToken],
	);

	const get = useCallback(
		(url: string, params?: Record<string, any>) => {
			const query = params ? "?" + new URLSearchParams(params).toString() : "";
			return request(url + query);
		},
		[request],
	);

	const post = useCallback(
		(url: string, body?: unknown) =>
			request(url, {
				method: "POST",
				body: JSON.stringify(body),
			}),
		[request],
	);

	const del = useCallback(
		(url: string) => {
			return request(url, {
				method: "DELETE",
			})
		},
		[request],
	);

	const patch = useCallback(
		(url: string, body?: unknown) => {
			return request(url, {
				method: "PATCH",
				body: JSON.stringify(body),
			})
		},
		[request],
	);

	return { apiClient: { get, post, delete: del, patch } };
};

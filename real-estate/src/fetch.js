import { server } from "./config/default.json";

const url = server.url;

export async function $fetch(endpoint = "", options = { headers: {} }, token = "") {
	try {
		const res = await fetch(`${url}${encodeURI(endpoint)}`, {
			...options,
			headers: {
				...options.headers,
				'Authorization': `Bearer ${token}`,
			},
			credentials: 'include'
		});

		return [res, null];
	} catch(error) {
		return [null, error];
	}
}
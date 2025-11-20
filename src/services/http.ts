import { API_ROUTES } from "../config/api.config";
<<<<<<< HEAD
import { APIError } from "../utils/apiError.js";
=======
import { APIError } from "../utils/apiError";
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

export async function httpRequest(
    service: keyof typeof API_ROUTES,
    path: string,
    method: string = "GET",
    body?: any,
    headers: Record<string, string> = {}
) {
    const base = API_ROUTES[service];
    if (!base) throw new APIError(`Base URL missing for service: ${service}`, 500);

    const url = `${base}${path}`;

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null } catch { }

    if (!response.ok) {
        throw new APIError(json?.error || response.statusText, response.status, undefined, json);
    }

    return json;
}

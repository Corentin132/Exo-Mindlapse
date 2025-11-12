import { type Product } from "@admin-dashboard/types";

import { httpClient } from "./httpClient";

interface RequestOptions {
    token?: string | null;
    signal?: AbortSignal;
}

interface ProductListResponse {
    items: Product[];
    itemCount: number;
}

function withAuthHeaders(token?: string | null): HeadersInit | undefined {
    if (!token) {
        return undefined;
    }

    return { Authorization: `Bearer ${token}` };
}

async function parseJson<T>(response: Response): Promise<T> {
    const payload = (await response.json().catch(() => null)) as T | null;

    if (!payload) {
        throw new Error("Réponse inattendue du serveur.");
    }

    return payload;
}

export async function getProducts(options: RequestOptions = {}): Promise<ProductListResponse> {
    const response = await httpClient.get("/api/products", {
        headers: withAuthHeaders(options.token),
        signal: options.signal,
    });

    if (!response.ok) {
        const payload = await parseJson<{ message?: string }>(response).catch(() => null);
        throw new Error(payload?.message ?? "Impossible de récupérer les produits.");
    }

    const payload = await parseJson<{ products?: Product[] }>(response);
    const products = Array.isArray(payload.products) ? payload.products : [];

    return {
        items: products,
        itemCount: products.length,
    };
}

export async function deleteProduct(id: number, options: RequestOptions = {}): Promise<void> {
    const response = await httpClient.delete(`/api/products/${id}`, {
        headers: withAuthHeaders(options.token),
        signal: options.signal,
    });

    if (!response.ok) {
        const payload = await parseJson<{ message?: string }>(response).catch(() => null);
        throw new Error(payload?.message ?? "Impossible de supprimer le produit.");
    }
}

export async function createProduct(
    product: Partial<Product>,
    options: RequestOptions = {}
): Promise<Product> {
    const response = await httpClient.post("/api/products", product, {
        headers: withAuthHeaders(options.token),
        signal: options.signal,
    });

    const payload = await parseJson<{ product?: Product; message?: string }>(response);

    if (!response.ok || !payload.product) {
        throw new Error(payload.message ?? "Impossible de créer le produit.");
    }

    return payload.product;
}

export async function updateProduct(
    id: number,
    product: Partial<Product>,
    options: RequestOptions = {}
): Promise<Product> {
    const response = await httpClient.put(`/api/products/${id}`, product, {
        headers: withAuthHeaders(options.token),
        signal: options.signal,
    });

    const payload = await parseJson<{ product?: Product; message?: string }>(response);

    if (!response.ok || !payload.product) {
        throw new Error(payload.message ?? "Impossible de mettre à jour le produit.");
    }

    return payload.product;
}
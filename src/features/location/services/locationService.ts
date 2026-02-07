
export interface Province {
    id: string;
    name: string;
}

export interface Regency {
    id: string;
    province_id: string;
    name: string;
}

export interface District {
    id: string;
    regency_id: string;
    name: string;
}

const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export async function getProvinces(): Promise<Province[]> {
    try {
        const res = await fetch(`${BASE_URL}/provinces.json`);
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching provinces:", error);
        return [];
    }
}

export async function getRegencies(provinceId: string): Promise<Regency[]> {
    try {
        const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching regencies:", error);
        return [];
    }
}

export async function getDistricts(regencyId: string): Promise<District[]> {
    try {
        const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching districts:", error);
        return [];
    }
}

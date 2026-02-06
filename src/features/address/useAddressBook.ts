"use client";

import { useState, useEffect, useCallback } from "react";
import type { AddressItem } from "@shared/types/types";
import { getAddresses } from "./action";

export function useAddressBook() {
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        const result = await getAddresses();
        if (result.success && result.data) {
            setAddresses(result.data);
            setError(null);
        } else {
            setError(result.error || "Failed to fetch addresses");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    // Listen for address updates
    useEffect(() => {
        const handleUpdate = () => {
            fetchAddresses();
        };

        window.addEventListener("addressUpdated", handleUpdate);
        return () => {
            window.removeEventListener("addressUpdated", handleUpdate);
        };
    }, [fetchAddresses]);

    const primary = addresses.find((a) => a.isPrimary) || addresses[0] || null;

    const listEntries = addresses.map(a => ({
        id: a.id,
        label: a.label,
        address: `${a.line1}, Kec. ${a.district}, ${a.city}, ${a.province} ${a.postalCode}`,
        isPrimary: a.isPrimary,
    }));

    const selectPrimary = async (id: string) => {
        // Optimistic update
        setAddresses(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));

        // Call API
        const { setDefaultAddress } = await import("./action");
        await setDefaultAddress(id);
        fetchAddresses();
    };

    return {
        addresses,
        listEntries,
        primary,
        loading,
        error,
        refresh: fetchAddresses,
        selectPrimary
    };
}

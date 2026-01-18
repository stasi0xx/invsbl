"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export const MicrosoftClarity = () => {
    useEffect(() => {
        const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

        if (clarityId) {
            // Oficjalna metoda inicjalizacji z paczki @microsoft/clarity
            Clarity.init(clarityId);
        } else {
            console.warn("Microsoft Clarity ID is missing in .env");
        }
    }, []);

    return null;
};
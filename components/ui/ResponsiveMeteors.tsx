"use client";
import { Meteors } from "@/components/ui/Meteors";
import { useEffect, useState } from "react";

export default function ResponsiveMeteors() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        setCount(window.innerWidth >= 768 ? 30 : 10);
    }, []);

    if (count === null) return null;

    return <Meteors number={count} />;
}

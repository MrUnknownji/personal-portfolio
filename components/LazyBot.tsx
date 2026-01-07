"use client";
import dynamic from "next/dynamic";

const Bot = dynamic(() => import("@/components/Bot"), {
    ssr: false,
    loading: () => null,
});

export default function LazyBot() {
    return <Bot />;
}

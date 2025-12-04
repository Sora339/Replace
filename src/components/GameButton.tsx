"use client"

import { recordGameResult } from "@/src/server/controllers/postResult"
import { useState } from "react"

export function GameButton() {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            // Example data
            await recordGameResult(1, "example-code")
            alert("Result saved!")
        } catch (error) {
            console.error(error)
            alert("Failed to save result")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
            {loading ? "Saving..." : "Save Game Result"}
        </button>
    )
}

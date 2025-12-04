import { auth, signOut } from "@/src/auth"
import { redirect } from "next/navigation"
import { db } from "@/src/db"
import { gameResults } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { GameButton } from "@/src/components/GameButton"

export default async function MyPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const results = await db.query.gameResults.findMany({
        where: eq(gameResults.userId, session.user.id),
        orderBy: (results, { desc }) => [desc(results.createdAt)],
    })

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white">
            <div className="mx-auto max-w-4xl space-y-8">
                <header className="flex items-center justify-between rounded-2xl bg-gray-900 p-6 shadow-lg ring-1 ring-white/10">
                    <h1 className="text-2xl font-bold">My Page</h1>
                    <form
                        action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/login" })
                        }}
                    >
                        <button
                            type="submit"
                            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                        >
                            Sign Out
                        </button>
                    </form>
                </header>

                <main className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl bg-gray-900 p-6 shadow-lg ring-1 ring-white/10">
                        <h2 className="mb-4 text-lg font-semibold text-gray-200">Profile</h2>
                        <div className="flex items-center space-x-4">
                            {session.user?.image && (
                                <img
                                    src={session.user.image}
                                    alt="Avatar"
                                    className="h-16 w-16 rounded-full ring-2 ring-gray-700"
                                />
                            )}
                            <div>
                                <p className="text-xl font-medium text-white">
                                    {session.user?.name}
                                </p>
                                <p className="text-sm text-gray-400">{session.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gray-900 p-6 shadow-lg ring-1 ring-white/10">
                        <h2 className="mb-4 text-lg font-semibold text-gray-200">
                            Game Results
                        </h2>
                        <div className="mb-4">
                            <GameButton />
                        </div>
                        <div className="space-y-2">
                            {results.length === 0 ? (
                                <p className="text-gray-400">No results yet.</p>
                            ) : (
                                results.map((result) => (
                                    <div
                                        key={result.id}
                                        className="flex justify-between rounded bg-gray-950 p-3 text-sm"
                                    >
                                        <span className="text-gray-300">Cycle: {result.cycle}</span>
                                        <span className="font-mono text-gray-400">{result.code}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter text-white">
            REPLACE
          </div>
          <nav>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-neutral-950 bg-white rounded-full hover:bg-neutral-200 transition-colors"
            >
              Start Game
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                  プログラマーは <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Recycleされました()
                  </span>
                </h1>
                <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Build your logic, run your code, and conquer the loop. 
                  A browser-based roguelike where your code determines your fate.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/login"
                    className="px-8 py-4 text-base font-bold text-neutral-950 bg-white rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95"
                  >
                    Play Now
                  </Link>
                  <Link
                    href="#features"
                    className="px-8 py-4 text-base font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
                <div className="relative aspect-square animate-bounce-custom">
                  <Image
                    src="/asset/image/hero.png"
                    alt="Hero Image"
                    fill
                    className="object-contain drop-shadow-[0_0_50px_rgba(99,102,241,0.3)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-neutral-900/50 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Game Features</h2>
              <p className="text-neutral-400">Master the code, defeat the enemies.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Code to Fight",
                  desc: "Connect nodes to create powerful combat logic. Your algorithm is your weapon.",
                  icon: "/asset/enemy/enemy-01.svg",
                },
                {
                  title: "Roguelike Loop",
                  desc: "Battle, shop, and evolve. Enemies get stronger with every cycle.",
                  icon: "/asset/enemy/enemy-02.svg",
                },
                {
                  title: "Strategic Build",
                  desc: "Collect items and upgrade your stats to survive the infinite loop.",
                  icon: "/asset/enemy/enemy-03.svg",
                },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-neutral-950 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                  <div className="w-16 h-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / Tech Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-invert prose-lg mx-auto">
              <h2 className="text-center text-3xl font-bold text-white mb-12">About The Project</h2>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Core Mechanics</h3>
                  <ul className="space-y-3 text-neutral-400">
                    <li className="flex gap-3">
                      <span className="text-indigo-400">✓</span>
                      <span>Node-based visual programming combat</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-indigo-400">✓</span>
                      <span>Infinite scaling difficulty</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-indigo-400">✓</span>
                      <span>Persistent progression & My Page</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js 16", "React 19", "Tailwind CSS 4", "Nanostores", "Drizzle ORM", "Postgres", "NextAuth"].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-neutral-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/10 bg-neutral-950 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Replace. All rights reserved.</p>
      </footer>
    </div>
  );
}
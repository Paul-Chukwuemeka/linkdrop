export default function Mockup() {
  return (
    <section className="py-16 sm:py-20 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-3xl sm:text-4xl font-black italic tracking-tight text-[var(--text-primary)]">
          Your page, your style
        </h2>
        <p className="text-center mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
          Clean, fast, and yours. Every profile is a live link-in-bio page.
        </p>

        <div className="mt-10 relative w-full max-w-sm mx-auto">
          {/* decorative blobs */}
          <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl" />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-teal-400/10 blur-2xl" />

          {/* card */}
          <div className="relative bg-white rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 z-10">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-rose-400 flex items-center justify-center text-white text-xl font-bold shadow-md">
                J
              </div>
              <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
                @jules
              </h3>
              <p className="text-sm text-[var(--text-secondary)] text-center mt-1">
                Designer &amp; creator. Building things on the web.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { label: "Portfolio", color: "bg-[var(--text-primary)]" },
                { label: "Latest project", color: "bg-[var(--accent)]" },
                { label: "Newsletter", color: "bg-teal-500" },
                { label: "Merch store", color: "bg-amber-500" },
              ].map((link, i) => (
                <div
                  key={i}
                  className={`${link.color} text-white text-sm font-semibold text-center rounded-xl py-3 px-4 shadow-sm transition-transform duration-200 hover:scale-[1.02] cursor-pointer`}
                >
                  {link.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */

export default function Testimonial() {
  return (
    <section className="px-6 py-16 md:px-12 lg:py-24">
      <figure className="mx-auto w-full max-w-[640px] rounded-2xl border border-border-subtle bg-white p-10 text-center shadow-sm">
        <blockquote className="text-xl font-medium leading-relaxed text-primary">
          &ldquo;I switched from Linktree because LinkDrop actually lets me use
          my brand fonts. My profile finally looks like me.&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          <img
            src="https://i.pravatar.cc/48?img=5"
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-primary">Sarah Chen</p>
            <p className="text-xs text-secondary">Independent Designer</p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

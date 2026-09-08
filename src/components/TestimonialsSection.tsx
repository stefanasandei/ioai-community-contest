import { Award, Medal, Quote, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";




interface Testimonial {
  name: string;
  quote: string;
  achievement: string;
  placement?: string;
  role?: string;
  icon: LucideIcon;
  accentClass: string;
  badgeClass: string;
  iconClass: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Beketov Dauzhan",
    quote:
      "Great platform with high-quality problems. Thank you AICC for those problems; they used several topics.",
    achievement: "Gold Medal",
    placement: "2nd overall",
    icon: Trophy,
    accentClass: "from-[#c09c46] via-[#ead18d] to-[#c09c46]",
    badgeClass:
      "bg-[#fbf5e5] text-[#9b7526] border-[#c8a44e] shadow-[inset_0_0_0_1px_#fff9e8] dark:bg-[#332b19] dark:text-[#e3c779] dark:border-[#a78a42] dark:shadow-none",
    iconClass: "text-[#bb963d] dark:text-[#ddbe69]",
  },
  {
    name: "Nikoloz Gegenava",
    quote:
      "AICC was instrumental in earning my IOAI gold.",
    achievement: "Gold Medal",
    role: "AICC organizer",
    icon: Medal,
    accentClass: "from-[#c09c46] via-[#ead18d] to-[#c09c46]",
    badgeClass:
      "bg-[#fbf5e5] text-[#9b7526] border-[#c8a44e] shadow-[inset_0_0_0_1px_#fff9e8] dark:bg-[#332b19] dark:text-[#e3c779] dark:border-[#a78a42] dark:shadow-none",
    iconClass: "text-[#bb963d] dark:text-[#ddbe69]",
  },
  {
    name: "Georgescu David",
    quote:
      "The level of difficulty of AICC problems is similar to IOAI. During IOAI, I had a strong intuition on solving a problem thanks to a very similar problem idea from AICC.",
    achievement: "Gold Medal",
    icon: Medal,
    accentClass: "from-[#c09c46] via-[#ead18d] to-[#c09c46]",
    badgeClass:
      "bg-[#fbf5e5] text-[#9b7526] border-[#c8a44e] shadow-[inset_0_0_0_1px_#fff9e8] dark:bg-[#332b19] dark:text-[#e3c779] dark:border-[#a78a42] dark:shadow-none",
    iconClass: "text-[#bb963d] dark:text-[#ddbe69]",
  },
  {
    name: "Giorgi Maisuradze",
    quote:
      "AICC offered some of the hardest and most rigorous problems in my journey preparing for IOAI, and I would say it played a significant role in my success.",
    achievement: "Gold Medal",
    icon: Medal,
    accentClass: "from-[#c09c46] via-[#ead18d] to-[#c09c46]",
    badgeClass:
      "bg-[#fbf5e5] text-[#9b7526] border-[#c8a44e] shadow-[inset_0_0_0_1px_#fff9e8] dark:bg-[#332b19] dark:text-[#e3c779] dark:border-[#a78a42] dark:shadow-none",
    iconClass: "text-[#bb963d] dark:text-[#ddbe69]",
  },
  {
    name: "Sasuke Kondo",
    quote:
      "Coming from a country with an underdeveloped preparation program, AICC was my only real practice base for short-term competitions.",
    achievement: "Silver Medal",
    icon: Award,
    accentClass: "from-slate-300 via-slate-400 to-slate-500",
    badgeClass:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-600",
    iconClass: "text-slate-500 dark:text-slate-300",
  },
  {
    name: "Mobtasim Chowdhury Priom",
    quote:
      "AICC contests were incredible, to say the least. They really helped me think outside the box in other contests.",
    achievement: "Bronze Medal",
    icon: Award,
    accentClass: "from-[#cd9460] via-[#a66a3e] to-[#774326]",
    badgeClass:
      "bg-[#edcfb7] text-[#653719] border-[#b77b50] dark:bg-[#704527]/40 dark:text-[#e5b58e] dark:border-[#a66a3e]",
    iconClass: "text-[#96572e] dark:text-[#d89b6c]",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const AchievementIcon = testimonial.icon;

  
  return (
    <article className="group relative flex min-h-[300px] w-[calc(100vw-2rem)] max-w-[350px] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-aicc-purple/30 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-aicc-purple/40">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          testimonial.accentClass
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm dark:from-white/10 dark:to-white/5",
            testimonial.badgeClass
          )}
        >
          <AchievementIcon className={cn("h-6 w-6", testimonial.iconClass)} />
        </div>
        <Quote className="h-7 w-7 text-aicc-purple/15 transition-colors group-hover:text-aicc-purple/30 dark:text-aicc-purple-light/20 dark:group-hover:text-aicc-purple-light/40" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
            testimonial.badgeClass
          )}
        >
          {testimonial.achievement}
        </span>
        {testimonial.placement && (
          <span className="inline-flex items-center rounded-full border border-[#bea052] bg-[linear-gradient(115deg,#d1ae57_0%,#f9edc2_42%,#edda98_55%,#c5a049_100%)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#654d1f]">
            {testimonial.placement}
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
        “{testimonial.quote}”
      </p>

      <div className="mt-5 border-t border-gray-200/80 pt-3 dark:border-white/10">
        <p className="mb-0 text-sm font-bold text-gray-900 dark:text-white">
          {testimonial.name}
        </p>
        <p className="mb-0 mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          {testimonial.role ?? "AICC community member"}
        </p>
      </div>
    </article>
  );
};

const TestimonialsSection = () => {
const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const viewport = el.parentElement!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const animation = el.animate([
      { transform: 'translate3d(0,0,0)' },
      { transform: 'translate3d(-50%,0,0)' },
    ], { duration: 56000, iterations: Infinity, easing: 'linear' });
    const normalize = (time: number) => ((time % 56000) + 56000) % 56000;
    let pointer: number | null = null, previousX = 0, previousTime = 0, velocity = 0, frame = 0;
    const shift = (pixels: number) => {
      animation.currentTime = normalize(Number(animation.currentTime ?? 0) - pixels * 56000 / (el.offsetWidth / 2));
    };
    const resume = () => { if (!reduced.matches && !document.hidden) animation.play(); else animation.pause(); };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || pointer !== null) return;
      cancelAnimationFrame(frame); animation.pause();
      pointer = event.pointerId; previousX = event.clientX; previousTime = performance.now(); velocity = 0;
      viewport.setPointerCapture(pointer); viewport.style.cursor = 'grabbing';
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      const now = performance.now(), dx = event.clientX - previousX;
      velocity = Math.max(-1.5, Math.min(1.5, dx / Math.max(8, now - previousTime)));
      shift(dx); previousX = event.clientX; previousTime = now;
    };
    const end = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      pointer = null; viewport.style.cursor = 'grab';
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (event.type !== 'pointerup' || reduced.matches || performance.now() - previousTime > 100) { resume(); return; }
      let last = performance.now();
      const coast = (now: number) => {
        const dt = Math.min(32, now - last); last = now;
        shift(velocity * dt); velocity *= Math.exp(-dt / 120);
        if (Math.abs(velocity) > 0.025) frame = requestAnimationFrame(coast); else resume();
      };
      frame = requestAnimationFrame(coast);
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); animation.pause(); } else if (pointer === null) resume(); };
    viewport.addEventListener('pointerdown', down);
    viewport.addEventListener('pointermove', move);
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
    viewport.addEventListener('lostpointercapture', end);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', resume);
    resume();
    return () => {
      cancelAnimationFrame(frame); animation.cancel();
      viewport.removeEventListener('pointerdown', down); viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerup', end); viewport.removeEventListener('pointercancel', end); viewport.removeEventListener('lostpointercapture', end);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', resume);
    };
  }, []);
  return (
    <section id="testimonials" className="scroll-mt-20 relative overflow-hidden border-t border-gray-200/70 bg-white py-16 md:py-20 dark:border-white/10 dark:bg-[#0a0a0f]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-aicc-purple/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-aicc-orange/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aicc-purple/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
<div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-aicc-purple/20 bg-aicc-purple/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-aicc-purple dark:border-aicc-purple/30 dark:bg-aicc-purple/10 dark:text-aicc-purple-light">
            <Medal className="h-3.5 w-3.5" />
            From the community
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Built for ambitious{" "}
            <span className="text-gradient">problem solvers</span>
          </h2>
          <p className="mb-0 text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
            See how AICC helps students prepare for the world’s toughest AI
            competitions.
          </p>
        </div>

        <div
          className="relative overflow-hidden py-2 cursor-grab select-none touch-pan-y [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          aria-label="AICC participant testimonials"
        >
          <div ref={strip} className="flex w-max will-change-transform">
            <div className="flex shrink-0 gap-5 pr-5">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} />
              ))}
            </div>
            <div className="flex shrink-0 gap-5 pr-5" aria-hidden="true">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={"duplicate-" + testimonial.name} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

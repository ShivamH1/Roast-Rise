import { Flame, TrendingUp } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center h-10 w-10 bg-foreground rounded-lg -rotate-6 border-[2px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <div className="relative">
          <Flame className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
          <TrendingUp className="h-4 w-4 text-background absolute -top-1 -right-1" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-2xl font-black uppercase tracking-tighter text-foreground leading-none">
          ROAST <span className="text-orange-600">&amp;</span> RISE
        </span>
        <span className="text-[10px] text-foreground/50 font-display font-bold uppercase tracking-[0.2em] mt-0.5 ml-0.5">
          AI Confidence Engine
        </span>
      </div>
    </div>
  );
}

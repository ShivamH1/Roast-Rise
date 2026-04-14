import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Persona = "vc" | "fashionista" | "mom";

const personas: { id: Persona; emoji: string; name: string; tagline: string; tag: string }[] = [
  { id: "vc", emoji: "💼", name: "The Silicon Valley VC", tagline: "Will question your market fit & life choices", tag: "TECH" },
  { id: "fashionista", emoji: "👗", name: "The Mean Fashionista", tagline: "Your style is giving... corporate funeral", tag: "STYLE" },
  { id: "mom", emoji: "😤", name: "The Disappointed Mom", tagline: "You had so much potential, sweetie", tag: "LIFE" },
];

interface Props {
  selected: Persona | null;
  onSelect: (p: Persona) => void;
}

export default function PersonaSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {personas.map((p, i) => (
        <motion.button
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(p.id)}
          className={cn(
            "spotrz-card text-left cursor-pointer transition-all",
            selected === p.id
              ? "bg-primary/10 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
              : "hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="spotrz-pill text-[10px]">{p.tag}</span>
            {selected === p.id && (
              <span className="flex items-center gap-1.5 text-xs font-display font-bold text-roast-fire">
                <span className="live-dot" />
                SELECTED
              </span>
            )}
          </div>
          <span className="text-3xl block">{p.emoji}</span>
          <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight text-foreground">{p.name}</h3>
          <div className="spotrz-divider my-3" />
          <p className="text-sm text-muted-foreground">{p.tagline}</p>
        </motion.button>
      ))}
    </div>
  );
}

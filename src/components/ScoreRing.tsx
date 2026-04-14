import { motion } from "framer-motion";

interface Props {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 120 }: Props) {
  // Spotrz-style: big bold score box instead of ring
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-[3px] border-foreground bg-primary font-display text-5xl font-bold text-primary-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
        {score}
      </div>
      <span className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider">/ 10 Score</span>
    </motion.div>
  );
}

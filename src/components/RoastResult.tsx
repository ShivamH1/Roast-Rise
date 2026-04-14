import { motion } from "framer-motion";
import {
  Flame,
  TrendingUp,
  Eye,
  Zap,
  Share2,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreRing from "./ScoreRing";
import CoachSection from "./CoachSection";
import { Link } from "react-router-dom";

export interface RoastData {
  overallScore: number;
  scores: {
    label: string;
    score: number;
    icon: "hire" | "vibe" | "confidence";
  }[];
  roastLines: string[];
  quickWins: string[];
}

const iconMap = {
  hire: TrendingUp,
  vibe: Eye,
  confidence: Zap,
};

interface Props {
  data: RoastData;
  personaEmoji: string;
  onShare: () => void;
  onReset: () => void;
}

export default function RoastResult({
  data,
  personaEmoji,
  onShare,
  onReset,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Score Header */}
      <div className="flex flex-col items-center text-center">
        <span className="text-5xl mb-2">{personaEmoji}</span>
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
          The Roast &amp; Rise Report
        </h2>
        <p className="text-muted-foreground mt-1">
          Brutal feedback. Real results.
        </p>
      </div>

      {/* Main Score */}
      <div className="flex justify-center">
        <ScoreRing score={data.overallScore} size={140} />
      </div>

      {/* Sub Scores */}
      <div className="grid grid-cols-3 gap-4">
        {data.scores.map((s, i) => {
          const Icon = iconMap[s.icon];
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="spotrz-card flex flex-col items-center text-center py-4"
            >
              <Icon className="h-5 w-5 text-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground font-display font-bold uppercase tracking-wider">
                {s.label}
              </span>
              <div className="spotrz-score-box-active mt-2">{s.score}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Roast Lines */}
      <div className="spotrz-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-foreground animate-flame-flicker" />
            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-foreground">
              Level 1: The Roast
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-display font-bold text-roast-live">
            <span className="live-dot" />
            LIVE
          </span>
        </div>
        <div className="spotrz-divider" />
        {data.roastLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          >
            <p className="text-foreground leading-relaxed">{line}</p>
            {i < data.roastLines.length - 1 && (
              <div className="spotrz-divider mt-4" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Wins */}
      <div className="spotrz-card bg-primary/5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="spotrz-pill-filled text-[10px]">
            ⚡ Level 2: The Rise (Quick Wins)
          </span>
        </div>
        <div className="spotrz-divider" />
        {data.quickWins.map((win, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="spotrz-score-box h-8 w-8 text-sm shrink-0">
              {i + 1}
            </div>
            <p className="text-sm text-foreground pt-1">{win}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="fire" size="lg" onClick={onShare}>
          <Share2 className="h-4 w-4" />
          Share My Roast
        </Button>
        <Button variant="outline" size="lg" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Roast Again
        </Button>
      </div>

      {/* HR Coach Integration */}
      <div className="spotrz-divider my-2" />
      <CoachSection />
    </motion.div>
  );
}

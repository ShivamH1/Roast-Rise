import { motion } from "framer-motion";
import { UserCheck, MessageSquare, Calendar, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const coaches = [
  {
    name: "Sarah Chen",
    title: "Senior Career Strategist",
    specialty: "Tech & SaaS",
    rating: 4.9,
    reviews: 142,
    avatar: "SC",
  },
  {
    name: "Marcus Williams",
    title: "Executive Resume Writer",
    specialty: "C-Suite & Leadership",
    rating: 4.8,
    reviews: 98,
    avatar: "MW",
  },
  {
    name: "Priya Kapoor",
    title: "LinkedIn Optimization Expert",
    specialty: "Personal Branding",
    rating: 5.0,
    reviews: 67,
    avatar: "PK",
  },
];

export default function CoachSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Ready for a Real Glow-Up? 🚀
        </h3>
        <p className="text-muted-foreground mt-1">
          Our AI roasted you. Now let a human expert fix you.
        </p>
      </div>

      <div className="grid gap-4">
        {coaches.map((coach, i) => (
          <motion.div
            key={coach.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="spotrz-card hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[2px] border-foreground bg-primary text-sm font-bold font-display text-primary-foreground">
                {coach.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold uppercase text-foreground">{coach.name}</span>
                  <UserCheck className="h-4 w-4 text-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{coach.title}</p>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <span className="spotrz-pill text-[10px]">
                    <MessageSquare className="h-3 w-3" />
                    {coach.specialty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-display font-bold text-foreground">
                    <Star className="h-3 w-3 text-primary fill-primary" />
                    {coach.rating} ({coach.reviews})
                  </span>
                </div>
              </div>

              <Button variant="default" size="sm">
                <Calendar className="h-3.5 w-3.5" />
                Book
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button variant="fire" size="lg">
          <ExternalLink className="h-4 w-4" />
          Browse All Coaches
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          First 15-min session free · Based on your roast results
        </p>
      </div>
    </motion.div>
  );
}

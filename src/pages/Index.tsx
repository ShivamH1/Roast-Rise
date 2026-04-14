import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonaSelector, { type Persona } from "@/components/PersonaSelector";
import FileUploader from "@/components/FileUploader";
import RoastResult, { type RoastData } from "@/components/RoastResult";
import ShareModal from "@/components/ShareModal";
import Logo from "@/components/Logo";
import { toast } from "sonner";

const personaEmojiMap: Record<Persona, string> = {
  vc: "💼",
  fashionista: "👗",
  mom: "😤",
};

export default function Index() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleRoast = async () => {
    if (!persona || !file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("persona", persona);
      formData.append("file", file);

      const url = `http://localhost:3000/api/roast`;
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        if (res.status === 429) {
          toast.error("Rate limited — please try again in a moment");
        } else if (res.status === 402) {
          toast.error(
            "AI credits exhausted — please add credits in your workspace",
          );
        } else {
          toast.error(err.error || "Something went wrong");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setRoastData(data as RoastData);
    } catch (err) {
      console.error("Roast error:", err);
      toast.error("Failed to connect to roast engine");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPersona(null);
    setFile(null);
    setRoastData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Spotrz style yellow bar with heavy border */}
      <header className="fire-header py-5">
        <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="spotrz-pill bg-card">
              <Flame className="h-3 w-3" />
              BETA
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {roastData ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RoastResult
                data={roastData}
                personaEmoji={persona ? personaEmojiMap[persona] : "🔥"}
                onShare={() => setShareOpen(true)}
                onReset={handleReset}
              />
              <ShareModal
                open={shareOpen}
                onOpenChange={setShareOpen}
                data={roastData}
                personaEmoji={persona ? personaEmojiMap[persona] : "🔥"}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Hero */}
              <div className="text-center space-y-3">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-foreground"
                >
                  <span className="fire-text">Roast</span> &amp; Rise
                  <br />
                  <span className="text-3xl sm:text-4xl text-muted-foreground opacity-50">
                    Repeat
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground max-w-md mx-auto"
                >
                  Upload your resume, LinkedIn, or profile pic. Our AI will
                  destroy you — then help you rebuild.
                </motion.p>
              </div>

              {/* Step 1 - Persona */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-foreground" />
                  <h3 className="font-display font-bold text-xl uppercase tracking-tight text-foreground">
                    Choose Your Roaster
                  </h3>
                </div>
                <PersonaSelector selected={persona} onSelect={setPersona} />
              </section>

              {/* Step 2 - Upload */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-foreground" />
                  <h3 className="font-display font-bold text-xl uppercase tracking-tight text-foreground">
                    Upload Your Victim Material
                  </h3>
                </div>
                <FileUploader
                  file={file}
                  onFile={setFile}
                  onClear={() => setFile(null)}
                  loading={loading}
                />
              </section>

              {/* Roast Button */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="fire"
                  size="lg"
                  disabled={!persona || !file || loading}
                  onClick={handleRoast}
                  className="px-12 py-7 text-lg"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      🔥
                    </motion.span>
                  ) : (
                    <Flame className="h-5 w-5" />
                  )}
                  {loading ? "ROASTING..." : "ROAST ME"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-foreground py-6 text-center text-sm text-muted-foreground font-display">
        <p>
          © {new Date().getFullYear()} ROAST &amp; RISE · 20% Comedy · 80%
          Growth · 100% Brutal
        </p>
      </footer>
    </div>
  );
}

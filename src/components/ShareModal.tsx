import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Copy, Check, Download, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import type { RoastData } from "./RoastResult";
import { generateShareImage } from "./ShareImageGenerator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: RoastData;
  personaEmoji: string;
}

export default function ShareModal({ open, onOpenChange, data, personaEmoji }: Props) {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (open && !imageUrl) {
      setGenerating(true);
      generateShareImage(data, personaEmoji).then((url) => {
        setImageUrl(url);
        setGenerating(false);
      });
    }
  }, [open, data, personaEmoji, imageUrl]);

  const shareText = `I just got absolutely destroyed by AI Roast 🔥\n\nMy score: ${data.overallScore}/10\n\n"${data.roastLines[0]}"\n\nGet roasted too 👉`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `ai-roast-score-${data.overallScore}.png`;
    a.click();
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-[3px] border-foreground rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-tight">Share Your Roast 🔥</DialogTitle>
        </DialogHeader>

        {/* Image Preview */}
        <div className="rounded-xl border-[2px] border-foreground overflow-hidden bg-muted">
          {generating ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm font-display">
              Generating share image...
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Roast scorecard" className="w-full max-h-80 object-contain" />
          ) : null}
        </div>

        <div className="flex gap-2">
          <Button variant="fire" className="flex-1" onClick={handleDownload} disabled={!imageUrl}>
            <Instagram className="h-4 w-4" />
            Stories
          </Button>
          <Button variant="fire" className="flex-1" onClick={handleDownload} disabled={!imageUrl}>
            <Download className="h-4 w-4" />
            Save
          </Button>
        </div>

        <div className="rounded-xl border-[2px] border-foreground bg-muted p-3">
          <p className="text-xs text-foreground whitespace-pre-line">{shareText}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleTwitter}>
            <Twitter className="h-4 w-4" />
            X / Twitter
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleLinkedIn}>
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

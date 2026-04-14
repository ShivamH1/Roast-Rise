import type { RoastData } from "./RoastResult";

export async function generateShareImage(data: RoastData, personaEmoji: string): Promise<string> {
  const canvas = document.createElement("canvas");
  // Instagram story ratio (9:16)
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d")!;

  // Background gradient (fire colors)
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#FFD700");
  grad.addColorStop(0.5, "#FF6B35");
  grad.addColorStop(1, "#DC2626");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark overlay card
  const cardX = 60, cardY = 300, cardW = 960, cardH = 1320;
  ctx.fillStyle = "rgba(20, 20, 20, 0.92)";
  roundRect(ctx, cardX, cardY, cardW, cardH, 40);
  ctx.fill();

  // Top branding
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 48px 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔥 AI ROAST", canvas.width / 2, 200);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "24px 'Inter', system-ui, sans-serif";
  ctx.fillText("The Brutally Honest Confidence Coach", canvas.width / 2, 250);

  // Persona emoji
  ctx.font = "80px serif";
  ctx.fillText(personaEmoji, canvas.width / 2, cardY + 100);

  // Score circle
  const cx = canvas.width / 2, cy = cardY + 260, r = 90;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
  ctx.fill();

  // Score arc
  const scoreAngle = (data.overallScore / 10) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, scoreAngle);
  ctx.strokeStyle = getScoreColor(data.overallScore);
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.stroke();

  // Score number
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 72px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText(`${data.overallScore}`, cx, cy + 25);
  ctx.font = "20px 'Inter', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("/ 10", cx, cy + 55);

  // Sub scores
  const subY = cardY + 420;
  data.scores.forEach((s, i) => {
    const sx = cardX + 80 + i * 320;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, sx - 40, subY - 10, 280, 80, 12);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "16px 'Inter', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.label, sx + 100, subY + 18);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText(`${s.score}`, sx + 100, subY + 55);
  });

  // Top roast line
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 24px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("💀 Top Roast", cardX + 50, subY + 140);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "22px 'Inter', system-ui, sans-serif";
  wrapText(ctx, `"${data.roastLines[0]}"`, cardX + 50, subY + 185, cardW - 100, 32);

  // Quick wins preview
  const qwY = subY + 420;
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 24px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("⚡ Quick Win", cardX + 50, qwY);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "20px 'Inter', system-ui, sans-serif";
  wrapText(ctx, data.quickWins[0], cardX + 50, qwY + 40, cardW - 100, 28);

  // CTA at bottom
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 28px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("Get roasted too → airoast.app", canvas.width / 2, canvas.height - 120);

  return canvas.toDataURL("image/png");
}

function getScoreColor(score: number): string {
  if (score <= 3) return "#DC2626";
  if (score <= 6) return "#FFD700";
  return "#22C55E";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

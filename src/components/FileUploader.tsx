import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
  loading?: boolean;
}

export default function FileUploader({ onFile, file, onClear, loading }: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  if (file) {
    const isImage = file.type.startsWith("image/");
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "spotrz-card relative overflow-hidden flex items-center gap-3 transition-colors",
          loading ? "bg-primary/20" : "bg-primary/10"
        )}
      >
        {loading && (
          <motion.div
            initial={{ top: "-100%" }}
            animate={{ top: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-foreground/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10"
          />
        )}
        {isImage ? <Image className="h-5 w-5 text-foreground" /> : <FileText className="h-5 w-5 text-foreground" />}
        <div className="flex-1 min-w-0">
          <p className="truncate font-display font-bold text-foreground uppercase">
            {loading ? "SCANNING VICTIM..." : file.name}
          </p>
          {!loading && <p className="text-[10px] text-muted-foreground uppercase font-bold">{(file.size / 1024).toFixed(0)} KB</p>}
        </div>
        {!loading && (
          <button onClick={onClear} className="rounded-full border-[2px] border-foreground p-1 hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-foreground" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 spotrz-card border-dashed transition-all",
        dragOver ? "bg-primary/10 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]" : "hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
      )}
    >
      <Upload className="h-8 w-8 text-foreground" />
      <div className="text-center">
        <p className="font-display font-bold uppercase text-foreground">Drop your file here</p>
        <p className="text-sm text-muted-foreground mt-1">PDF, JPG, or PNG — resumes, LinkedIn exports, or profile pics</p>
      </div>
      <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleChange} />
    </label>
  );
}

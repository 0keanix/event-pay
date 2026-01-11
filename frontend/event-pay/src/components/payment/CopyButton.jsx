import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Скопировано!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 backdrop-blur-sm rounded-xl p-4" style={{ background: 'rgba(var(--bg-card), 0.5)', border: '1px solid rgb(var(--border))' }}>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1" style={{ color: 'rgb(var(--text-muted))' }}>{label}</p>
        <p className="font-mono text-sm truncate" style={{ color: 'rgb(var(--text-primary))' }}>{text}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="shrink-0 h-10 w-10 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-300"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-indigo-600" />
        )}
      </Button>
    </div>
  );
}
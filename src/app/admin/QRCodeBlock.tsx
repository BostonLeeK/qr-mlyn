"use client";

import { useRef, useState, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRCodeBlockProps {
  slug: string;
}

export default function QRCodeBlock({ slug }: QRCodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const href = origin ? `${origin}/p/${slug}` : "";

  useEffect(() => {
    if (!href || !containerRef.current) return;
    containerRef.current.innerHTML = "";
    const qr = new QRCodeStyling({
      width: 200,
      height: 200,
      data: href,
      margin: 8,
      qrOptions: { errorCorrectionLevel: "M" },
      dotsOptions: {
        color: "#000000",
        type: "dots",
      },
      cornersSquareOptions: {
        color: "#000000",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#000000",
        type: "dot",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });
    qr.append(containerRef.current);
    qrRef.current = qr;
    return () => {
      qrRef.current = null;
    };
  }, [href]);

  const handleDownload = async () => {
    if (!href || !slug) return;
    const qr = new QRCodeStyling({
      width: 400,
      height: 400,
      data: href,
      margin: 16,
      qrOptions: { errorCorrectionLevel: "M" },
      dotsOptions: { color: "#000000", type: "dots" },
      cornersSquareOptions: { color: "#000000", type: "extra-rounded" },
      cornersDotOptions: { color: "#000000", type: "dot" },
      backgroundOptions: { color: "#ffffff" },
    });
    const data = await qr.getRawData("png");
    if (!data) return;
    const url = URL.createObjectURL(data as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${slug}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!slug.trim() || !href) return null;

  return (
    <div className="rounded-lg border border-border bg-bg-subtle p-5 shadow-sm">
      <p className="font-body mb-1.5 text-[0.85rem] font-medium text-text-muted">
        QR-код для сторінки
      </p>
      <p className="font-body mb-4 truncate text-[0.8rem] text-text">
        {href}
      </p>
      <div className="inline-flex rounded-xl bg-white p-4 shadow-inner ring-1 ring-border/50">
        <div ref={containerRef} className="[&_canvas]:rounded-lg" />
      </div>
      <button
        type="button"
        onClick={handleDownload}
        className="mt-4 flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 font-body text-[0.9rem] font-medium text-white transition hover:opacity-90"
      >
        Завантажити PNG
      </button>
    </div>
  );
}

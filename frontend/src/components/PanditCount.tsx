"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function PanditCount() {
  const [count, setCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let controller: AbortController;
    let timeout: ReturnType<typeof setTimeout>;

    const refresh = async () => {
      controller?.abort();
      clearTimeout(timeout);
      const current = new AbortController();
      controller = current;
      timeout = setTimeout(() => current.abort(), 10000);
      try {
        const pandas = await api.getPandas({ signal: current.signal, cache: "no-store" });
        if (!Array.isArray(pandas)) throw new Error("Invalid registration list");
        if (active && controller === current) {
          setCount(pandas.length);
          setFailed(false);
        }
      } catch {
        if (active && controller === current) setFailed(true);
      } finally {
        if (controller === current) clearTimeout(timeout);
      }
    };

    void refresh();
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      controller?.abort();
      clearTimeout(timeout);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <div className="neu-pressed" style={{ marginBottom: "1.5rem" }}>
      <p role="status" style={{ marginBottom: "0.75rem" }}>
        {failed ? "पंजीकृत पंडित जी की संख्या अभी उपलब्ध नहीं है।" : count === null ? (
          "पंजीकृत पंडित जी की संख्या लोड हो रही है…"
        ) : (
          <><strong style={{ color: "var(--red)", fontSize: "2rem" }}>{count.toLocaleString("hi-IN")}</strong> पंडित जी हमारी वेबसाइट पर पंजीकृत हैं।</>
        )}
      </p>
      <Link href="/pandas" className="btn btn-secondary">सभी पंडित जी देखें</Link>
    </div>
  );
}

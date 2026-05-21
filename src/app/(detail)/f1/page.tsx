"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { DetailF1 } from "@/components/features/detail-f1";

export default function F1DetailPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <DetailF1
      theme={theme}
      onTheme={setTheme}
      onNav={(section) => router.push(`/${section}`)}
    />
  );
}

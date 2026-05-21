"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { DetailFootball } from "@/components/features/detail-football";

export default function FootballDetailPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <DetailFootball
      theme={theme}
      onTheme={setTheme}
      onNav={(section) => router.push(`/${section}`)}
    />
  );
}

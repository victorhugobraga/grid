"use client";

import { useState, useEffect } from "react";

function getHHMM() {
  const t = new Date();
  return (
    String(t.getHours()).padStart(2, "0") +
    ":" +
    String(t.getMinutes()).padStart(2, "0")
  );
}

export function useClock() {
  const [time, setTime] = useState(getHHMM);

  useEffect(() => {
    const id = setInterval(() => setTime(getHHMM()), 10_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

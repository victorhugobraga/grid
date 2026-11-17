"use client";

import { useState, useSyncExternalStore } from "react";
import { faviconUrl, type Favorite } from "@/lib/favorites";

export function FavoritesBar({ favorites }: { favorites: Favorite[] }) {
  // O tema vem do localStorage; só renderiza após montar para evitar hydration mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted || favorites.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {favorites.map((f) => (
        <FavoritePill key={f.id} favorite={f} />
      ))}
    </div>
  );
}

function FavoritePill({ favorite }: { favorite: Favorite }) {
  const [broken, setBroken] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <a
      href={favorite.url}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 34,
        padding: "0 14px 0 10px",
        borderRadius: 999,
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        background: "var(--glass)",
        border: `1px solid ${hover ? "var(--accent)" : "var(--border)"}`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.14)",
        color: "var(--fg)",
        textDecoration: "none",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        transition: "border-color .15s, transform .15s",
        transform: hover ? "translateY(-1px)" : "none",
      }}
    >
      {broken ? (
        <span
          aria-hidden
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-elev)",
            fontSize: 10,
            textTransform: "uppercase",
          }}
        >
          {favorite.name.charAt(0)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={faviconUrl(favorite.url)}
          alt=""
          width={16}
          height={16}
          onError={() => setBroken(true)}
          style={{ borderRadius: 4 }}
        />
      )}
      {favorite.name}
    </a>
  );
}

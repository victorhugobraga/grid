export type Background = {
  id: string;
  url: string;
  label: string;
};

export const BACKGROUNDS: Background[] = [
  {
    id: "fjord",
    label: "Fjord at dusk",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "pines",
    label: "Foggy pines",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "desert",
    label: "Desert ridge",
    url: "https://images.unsplash.com/photo-1500322969630-a26ab6eb64cc?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "city",
    label: "City night",
    url: "https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "coast",
    label: "Atlantic coast",
    url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=2400&q=80",
  },
];

export function getDailyBackground(): Background {
  const dayIndex = Math.floor(Date.now() / 86400000) % BACKGROUNDS.length;
  return BACKGROUNDS[dayIndex];
}

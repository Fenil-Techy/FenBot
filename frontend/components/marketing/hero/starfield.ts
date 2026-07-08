// ─────────────────────────────────────────────────────────────────
// Seeded star generator — SSR-safe (no Math.random at module level)
// ─────────────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateSeededStars(count: number, startSeed: number) {
  const arr: string[] = [];
  let seed = startSeed;
  for (let i = 0; i < count; i++) {
    const x = Math.floor(seededRandom(seed++) * 2000);
    const y = Math.floor(seededRandom(seed++) * 2000);
    arr.push(`${x}px ${y}px #fff`);
  }
  return arr.join(", ");
}

export const STARS_SHADOW_1 = generateSeededStars(700, 1);
export const STARS_SHADOW_2 = generateSeededStars(200, 1000);
export const STARS_SHADOW_3 = generateSeededStars(100, 2000);

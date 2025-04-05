import fs from "fs";

const statsPath = "./stats.json";

export function loadStats() {
  return JSON.parse(fs.readFileSync(statsPath, "utf-8"));
}

function saveStats(data) {
  fs.writeFileSync(statsPath, JSON.stringify(data, null, 2));
}

export function trackUser(ctx) {
  const stats = loadStats();
  const id = ctx.chat.id;
  if (!stats.users.includes(id)) {
    stats.users.push(id);
    saveStats(stats);
  }
}

export function trackInteraction(key) {
  const stats = loadStats();
  stats.interactions[key]++;
  saveStats(stats);
}

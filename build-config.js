// Lee el .env y genera assets/js/config.js
// Uso: node scripts/build-config.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const outPath = path.join(root, "assets", "js", "config.js");

// Parser simple de .env (sin dependencias)
const env = {};
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

// Álbumes: ALBUM_1_*, ALBUM_2_*, ... hasta que no haya más
const albums = [];
for (let i = 1; env[`ALBUM_${i}_TITLE`] !== undefined; i++) {
  albums.push({
    title: env[`ALBUM_${i}_TITLE`],
    cover: env[`ALBUM_${i}_COVER`] || "",
    url: env[`ALBUM_${i}_URL`] || "#",
  });
}

const spotifyId = env.SPOTIFY_ARTIST_ID || "";
const config = {
  artistName: env.ARTIST_NAME || "",
  bio: env.BIO || "",
  spotifyUrl: spotifyId ? `https://open.spotify.com/artist/${spotifyId}` : "#",
  spotifyEmbedUrl: spotifyId ? `https://open.spotify.com/embed/artist/${spotifyId}?utm_source=generator` : "",
  youtubeUrl: env.YOUTUBE_URL || "#",
  gunsUrl: env.GUNS_URL || "#",
  featuredVideoId: env.FEATURED_VIDEO_ID || "",
  albums,
};

const content =
  "// Archivo generado por scripts/build-config.js. No editar a mano; edita el .env.\n" +
  `window.SITE = ${JSON.stringify(config, null, 2)};\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content);
console.log("config.js generado en assets/js/config.js");

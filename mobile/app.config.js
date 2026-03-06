const path = require("path");
const fs = require("fs");

function loadEnv(pathToEnv) {
  if (!fs.existsSync(pathToEnv)) return null;
  const content = fs.readFileSync(pathToEnv, "utf8");
  const out = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("EXPO_PUBLIC_") && trimmed.includes("=")) {
      const eq = trimmed.indexOf("=");
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      out[key] = value;
      process.env[key] = value;
    }
  });
  return out;
}

// Charger .env.local à la racine puis mobile/.env (priorité à la racine)
const rootEnv = loadEnv(path.join(__dirname, "..", ".env.local"));
const localEnv = loadEnv(path.join(__dirname, ".env"));
const env = { ...localEnv, ...rootEnv };

const apiUrl = env.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const appJson = require("./app.json");
module.exports = {
  ...appJson,
  extra: {
    ...appJson.extra,
    apiUrl,
  },
};

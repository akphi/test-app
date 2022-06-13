import { default as axios } from "axios";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFileContent = (file) => readFileSync(file, { encoding: "utf-8" });
const loadJSON = (path) => JSON.parse(getFileContent(path));

const TOKEN_FILE = resolve(__dirname, "../tokens.json");
const config = loadJSON(TOKEN_FILE);

const CHECK_TIMEOUT = process.env.TIMEOUT ?? 180000; // default to 3 minutes
const CHECK_INTERVAL = 5000; // default to 5s

const isServerReady = async (url) => {
  try {
    await axios.get(url);
    return true;
  } catch {
    return false;
  }
};

const pollServerReadyStatus = async (url, serviceUrl, serviceName) => {
  const startTime = Date.now();
  let isReady = false;
  while (!isReady) {
    console.log(`Checking readiness for service '${serviceName}'...`);
    if (Date.now() - startTime > CHECK_TIMEOUT) {
      throw new Error(
        `Server setup exceeded timeout (${CHECK_TIMEOUT}ms) for service '${serviceName}'. Please check the service log:\n${execSync(
          `docker-compose -p legend logs ${serviceName}`,
          {
            encoding: "utf-8",
          }
        )}`
      );
    }

    isReady = await isServerReady(url);

    if (!isReady) {
      await new Promise((resolve) =>
        setTimeout(() => resolve(), CHECK_INTERVAL)
      );
    }
  }

  console.log(`Service '${serviceName}' is ready! URL: ${serviceUrl}`);
};

const checkSetupReady = async () => {
  const engineUrl = `${config["legend.engine.server.host"]}:${config["legend.engine.server.port"]}/api`;
  const sdlcUrl = `${config["legend.sdlc.server.host"]}:${config["legend.sdlc.server.port"]}/api`;
  const studioUrl = `${config["legend.studio.server.host"]}:${config["legend.studio.server.port"]}/studio`;
  await Promise.all([
    pollServerReadyStatus(`${engineUrl}/server/v1/info`, engineUrl, "engine"),
    pollServerReadyStatus(`${sdlcUrl}/info`, sdlcUrl, "sdlc"),
    pollServerReadyStatus(`${studioUrl}/config.json`, studioUrl, "studio"),
  ]);
};

await checkSetupReady();

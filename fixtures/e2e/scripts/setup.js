import {
  statSync,
  readFileSync,
  rmSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "fs";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFileContent = (file) => readFileSync(file, { encoding: "utf-8" });
const loadJSON = (path) => JSON.parse(getFileContent(path));
const getAllFilesInDir = (path) => {
  const subPaths = readdirSync(path);
  let files = [];
  subPaths.forEach(function (subPath) {
    const fullSubPath = path + "/" + subPath;
    if (statSync(fullSubPath).isDirectory()) {
      files = files.concat(getAllFilesInDir(fullSubPath));
    } else {
      files.push(fullSubPath);
    }
  });
  return files;
};

const replaceToken = (path, tokens) => {
  writeFileSync(
    path,
    getFileContent(path).replace(
      /\$\{([\w.-]*)\}/g,
      (val, key) => tokens[key] ?? ""
    )
  );
};

const TEMPLATES_DIR = resolve(__dirname, "../templates");
const BUILD_DIR = resolve(__dirname, "../build");
const TOKEN_FILE = resolve(__dirname, "../tokens.json");
const config = loadJSON(TOKEN_FILE);

// Clone templates
if (existsSync(BUILD_DIR)) {
  rmSync(BUILD_DIR, { recursive: true });
}
mkdirSync(BUILD_DIR, { recursive: true });
// we do this since Node copy function is not recursive
execSync(`cp -r ${TEMPLATES_DIR}/* ${BUILD_DIR}`);

// Replace tokens in templates
getAllFilesInDir(BUILD_DIR).forEach((path) => {
  replaceToken(path, {
    ...config,
    "build.dir": BUILD_DIR,
  });
});

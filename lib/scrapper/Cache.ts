import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import md5 from "md5";

// TODO: Delete this cache before every builds
const CACHE_PATH = "./.bookcache";

export interface CachedResource {
  type: string;
  id: string;
}

interface WriteOptions {}

interface JSONWriteOptions extends WriteOptions {
  pretty?: boolean;
}

function createCache() {
  return mkdirSync(CACHE_PATH);
}

export function ensureCacheExists() {
  if (!existsSync(CACHE_PATH)) {
    createCache();
  }
}

export function ensureTypeExists(type: string) {
  const typePath = makeTypePath(type);
  if (!existsSync(typePath)) {
    mkdirSync(typePath);
  }
}

function makeResourcePath({ type, id }: CachedResource) {
  return `${CACHE_PATH}/${type}/${md5(id)}`;
}

function makeTypePath(type: string) {
  return `${CACHE_PATH}/${type}`;
}

export function resourceExists(resource: CachedResource) {
  return existsSync(makeResourcePath(resource));
}

export function readJSON(resource: CachedResource) {
  const path = makeResourcePath(resource);
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, { encoding: "utf8" });

  return JSON.parse(content);
}

export function writeJSON(
  resource: CachedResource,
  content: Object,
  options: JSONWriteOptions = {}
) {
  const { pretty } = options;
  const string = pretty
    ? JSON.stringify(content, null, 2)
    : JSON.stringify(content);

  ensureCacheExists();
  ensureTypeExists(resource.type);

  writeFileSync(makeResourcePath(resource), string);
}

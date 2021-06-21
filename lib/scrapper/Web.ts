export async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    },
  });

  if (response.ok) {
    return await response.text();
  }
}

function normalizePath(path: string) {
  let normalizedPath = path.trim();
  if (path.startsWith("/")) {
    normalizedPath = path.slice(1, path.length);
  }

  return normalizedPath;
}

export function makeAbsoluteUrl(host: string, path: string) {
  return `${host}/${normalizePath(path)}`;
}

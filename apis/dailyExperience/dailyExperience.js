// A dependency-free client for Bucketlist.nl's documented daily experience API.
(function (root) {
  "use strict";

  async function getDailyExperience(options = {}) {
    if (typeof fetch !== "function") {
      throw new Error("Use Node.js 18+ or a browser with the Fetch API.");
    }

    const url = new URL("https://bucketlist.nl/api/droom-van-de-dag");
    for (const name of ["lang", "scope", "theme"]) {
      if (options[name] !== undefined && options[name] !== null && options[name] !== "") {
        url.searchParams.set(name, String(options[name]));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Bucketlist request failed: HTTP ${response.status}`);
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  const api = { getDailyExperience };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.BucketlistDailyExperience = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);

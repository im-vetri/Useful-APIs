# Daily Experience

A dependency-free client for [Bucketlist.nl's Dream of the Day API](https://bucketlist.nl/brand/droom-van-de-dag.openapi.json).

The endpoint returns one travel or life experience, selected daily in the Europe/Amsterdam time zone. Repeating a request does not produce a fresh random suggestion. The default response is Dutch and limited to the Netherlands.

No API key, account, purchase or package installation is required. Use Node.js 18+ or a modern browser with `fetch`, `URL` and `AbortController`.

## Node.js

From the repository root:

```javascript
const { getDailyExperience } = require("./apis/dailyExperience/dailyExperience.js");

async function main() {
  const result = await getDailyExperience();
  console.log(result.date, result.language);
  console.log(result.dream.title);
  console.log(result.dream.canonicalUrl);
  console.log(result.attribution);
}

main().catch(console.error);
```

## Browser

Serve the repository through your usual local development server. This example makes a request only after clicking the button.

```html
<button id="load-experience">Load today's experience</button>
<pre id="experience"></pre>
<script src="./apis/dailyExperience/dailyExperience.js"></script>
<script>
  document.getElementById("load-experience").addEventListener("click", async () => {
    const output = document.getElementById("experience");
    try {
      const result = await BucketlistDailyExperience.getDailyExperience();
      output.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      output.textContent = error.message;
    }
  });
</script>
```

The endpoint currently permits cross-origin GET requests. No browser credentials or cookies are sent by this client.

## Optional parameters

```javascript
const result = await getDailyExperience({ lang: "en", scope: "wereld" });
```

| Parameter | Documented values |
| --- | --- |
| `lang` | `nl`, `en`, `de`, `fr`, `es`; default `nl` |
| `scope` | `nederland`, `wereld`; default `nederland` |
| `theme` | Optional editorial theme, at most 64 characters; the provider can fall back when no matching experience is available |

Parameters are passed to the provider without duplicating its validation rules. See the linked OpenAPI document for the current contract.

## Response and errors

The client returns the original JSON object, including `date`, `scope`, `language`, `requestedTheme`, `dream` and `attribution`. It does not download images or follow booking links. When rendering an experience, preserve the supplied attribution and canonical source link.

Network failures, invalid JSON, non-success HTTP responses and the client's 12-second timeout reject the promise. The website has experienced intermittent timeouts; no uptime SLA or rate quota is promised here. Avoid repeated requests just to obtain another suggestion.

The repository's software license does not grant additional rights to the provider's content or images. See the provider's [published terms](https://bucketlist.nl/algemene-voorwaarden).

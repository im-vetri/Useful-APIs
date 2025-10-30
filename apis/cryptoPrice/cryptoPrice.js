/**
 * CoinGecko Crypto Prices & Market Data Helpers
 * - Real-time-ish data via polling (CoinGecko is REST-only; no official websocket)
 * - Current prices, market data, OHLC, historical-by-date, portfolio value calc
 * - Simple price alert subscription system (polling)
 *
 * Usage:
 *   const price = await CryptoPriceAPI.getCurrentPrices(['bitcoin','ethereum']);
 *   const value = await CryptoPriceAPI.calculatePortfolioValue([{id:'bitcoin', amount:0.1}], 'usd');
 *   const alertId = CryptoPriceAPI.subscribePriceAlert('bitcoin', 60000, 'above', 15000, 'usd', (data)=>console.log('alert',data));
 *
 * Note: CoinGecko enforces rate limits; keep polling intervals reasonable.
 */

const BASE_URL = "https://api.coingecko.com/api/v3";
const DEFAULT_VS_CURRENCY = "usd";

// small helper for fetch + error handling
async function fetchJSON(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}

/**
 * Get current simple prices for one or more coins.
 * @param {Array<string>|string} ids - coin id or array of ids (e.g. 'bitcoin','ethereum')
 * @param {string} vs_currency - fiat currency (default 'usd')
 * @param {Object} options - include24hrChange boolean
 * @returns {Promise<Object>} mapping id => { [vs_currency]: price, ... , last_updated_at, usd_24h_change }
 */
async function getCurrentPrices(ids = ["bitcoin", "ethereum"], vs_currency = DEFAULT_VS_CURRENCY, options = { include_24hr_change: true }) {
  const idParam = Array.isArray(ids) ? ids.join(",") : ids;
  const params = {
    ids: idParam,
    vs_currencies: vs_currency,
    include_last_updated_at: true,
    include_24hr_change: options.include_24hr_change ? "true" : "false",
  };

  return fetchJSON("/simple/price", params);
}

/**
 * Get detailed market data for coins (markets endpoint).
 * @param {Array<string>|string} ids
 * @param {string} vs_currency
 * @returns {Promise<Array>} array of market objects
 */
async function getMarketData(ids = ["bitcoin", "ethereum"], vs_currency = DEFAULT_VS_CURRENCY) {
  const idParam = Array.isArray(ids) ? ids.join(",") : ids;
  const params = {
    vs_currency,
    ids: idParam,
    order: "market_cap_desc",
    per_page: 250,
    page: 1,
    sparkline: false,
    price_change_percentage: "1h,24h,7d",
  };

  return fetchJSON("/coins/markets", params);
}

/**
 * Get historical price for a coin on a specific date (dd-mm-yyyy)
 * @param {string} id - coin id (e.g. 'bitcoin')
 * @param {string} date - formatted 'dd-mm-yyyy' (e.g. '30-12-2020')
 * @param {string} vs_currency
 * @returns {Promise<Object>} {market_data, community_data, ...}
 */
async function getHistoricalPriceByDate(id, date, vs_currency = DEFAULT_VS_CURRENCY) {
  if (!id || !date) throw new Error("id and date (dd-mm-yyyy) are required");
  const params = { date, localization: false };
  const data = await fetchJSON(`/coins/${encodeURIComponent(id)}/history`, params);
  // market_data.prices are returned in a structured way; convert if needed
  return data;
}

/**
 * Get market chart (prices, market_caps, total_volumes) for last n days
 * @param {string} id
 * @param {string} vs_currency
 * @param {number|string} days - e.g. 1, 7, 30, 'max'
 * @returns {Promise<Object>} {prices: [[timestamp, price], ...], market_caps, total_volumes}
 */
async function getMarketChart(id, vs_currency = DEFAULT_VS_CURRENCY, days = 30) {
  if (!id) throw new Error("id is required");
  const params = { vs_currency, days: String(days) };
  return fetchJSON(`/coins/${encodeURIComponent(id)}/market_chart`, params);
}

/**
 * Get OHLC data (CoinGecko supports 1/7/14/30/90/180/365/max days)
 * @param {string} id
 * @param {string} vs_currency
 * @param {number} days
 * @returns {Promise<Array>} [[time, open, high, low, close], ...]
 */
async function getOHLC(id, vs_currency = DEFAULT_VS_CURRENCY, days = 30) {
  if (!id) throw new Error("id is required");
  const params = { vs_currency, days: String(days) };
  return fetchJSON(`/coins/${encodeURIComponent(id)}/ohlc`, params);
}

/**
 * Calculate portfolio value.
 * @param {Array<{id:string, amount:number}>} portfolio
 * @param {string} vs_currency
 * @returns {Promise<{totalValue:number, breakdown: Array}>} total + per-asset breakdown
 */
async function calculatePortfolioValue(portfolio = [], vs_currency = DEFAULT_VS_CURRENCY) {
  if (!Array.isArray(portfolio)) throw new Error("portfolio must be an array");
  const ids = Array.from(new Set(portfolio.map(p => p.id).filter(Boolean)));
  if (ids.length === 0) return { totalValue: 0, breakdown: [] };

  const prices = await getCurrentPrices(ids, vs_currency, { include_24hr_change: false });
  let total = 0;
  const breakdown = portfolio.map((p) => {
    const priceObj = prices[p.id] || {};
    const price = Number(priceObj[vs_currency]) || 0;
    const value = price * (Number(p.amount) || 0);
    total += value;
    return {
      id: p.id,
      amount: p.amount,
      price,
      value,
    };
  });

  return { totalValue: total, breakdown };
}

/*
 * Price alert system (simple polling)
 * subscribePriceAlert(id, targetPrice, direction = 'above'|'below', intervalMs = 15000, vs_currency='usd', callback)
 * returns alertId (string). Use clearPriceAlert(alertId) to cancel.
 */
const _alerts = new Map(); // alertId => { intervalId, id, targetPrice, direction, vs_currency, callback }

/**
 * Subscribe to a price alert for a coin. Polls CoinGecko on interval.
 * @param {string} id - coin id
 * @param {number} targetPrice
 * @param {'above'|'below'} direction
 * @param {number} intervalMs
 * @param {string} vs_currency
 * @param {function} callback - called with {id, price, targetPrice, direction, triggeredAt, data}
 * @returns {string} alertId
 */
function subscribePriceAlert(id, targetPrice, direction = "above", intervalMs = 15000, vs_currency = DEFAULT_VS_CURRENCY, callback = () => {}) {
  if (!id || typeof targetPrice !== "number") throw new Error("id and numeric targetPrice are required");
  const alertId = `${id}:${Date.now()}:${Math.random().toString(36).slice(2,9)}`;

  const runner = async () => {
    try {
      const prices = await getCurrentPrices(id, vs_currency, { include_24hr_change: false });
      const cur = prices[id] && Number(prices[id][vs_currency]);
      if (!cur && cur !== 0) return; // skip if no price
      const shouldTrigger = direction === "above" ? cur >= targetPrice : cur <= targetPrice;
      if (shouldTrigger) {
        const payload = {
          id,
          price: cur,
          targetPrice,
          direction,
          triggeredAt: new Date().toISOString(),
          raw: prices,
        };
        try { callback(payload); } catch (cbErr) { console.error("price alert callback error", cbErr); }
        // auto-clear after trigger
        clearPriceAlert(alertId);
      }
    } catch (err) {
      // do not clear on error; just log
      console.error(`Error polling price for ${id}:`, err);
    }
  };

  // run immediately then set interval
  runner();
  const intervalId = setInterval(runner, Math.max(1000, Number(intervalMs) || 15000));
  _alerts.set(alertId, { intervalId, id, targetPrice, direction, vs_currency, callback });

  return alertId;
}

/**
 * Clear a previously registered price alert
 * @param {string} alertId
 * @returns {boolean} true if removed
 */
function clearPriceAlert(alertId) {
  const meta = _alerts.get(alertId);
  if (!meta) return false;
  clearInterval(meta.intervalId);
  _alerts.delete(alertId);
  return true;
}

/**
 * List active alerts (for debugging)
 * @returns {Array}
 */
function listActiveAlerts() {
  return Array.from(_alerts.entries()).map(([k, v]) => ({ alertId: k, id: v.id, targetPrice: v.targetPrice, direction: v.direction, vs_currency: v.vs_currency }));
}

/**
 * Supported example coins (CoinGecko ids)
 * Add more as needed.
 */
function getSupportedCoins() {
  return [
    "bitcoin",
    "ethereum",
    "litecoin",
    "ripple",      // xrp
    "cardano",
    "dogecoin",
    "polkadot",
    "chainlink",
    "solana",
    "binancecoin",
  ];
}

/* Export for Node.js */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getCurrentPrices,
    getMarketData,
    getHistoricalPriceByDate,
    getMarketChart,
    getOHLC,
    calculatePortfolioValue,
    subscribePriceAlert,
    clearPriceAlert,
    listActiveAlerts,
    getSupportedCoins,
  };
}

/* Expose to window for browser usage */
if (typeof window !== "undefined") {
  window.CryptoPriceAPI = {
    getCurrentPrices,
    getMarketData,
    getHistoricalPriceByDate,
    getMarketChart,
    getOHLC,
    calculatePortfolioValue,
    subscribePriceAlert,
    clearPriceAlert,
    listActiveAlerts,
    getSupportedCoins,
  };
}
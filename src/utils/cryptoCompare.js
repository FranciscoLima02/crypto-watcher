import axios from "axios";

const API_KEY = process.env.REACT_APP_CRYPTOCOMPARE_API_KEY;
const BASE_URL = "https://min-api.cryptocompare.com/data";

export async function fetchCurrentPrice(coinSymbol = "BTC", currency = "USD") {
    const url = `${BASE_URL}/price?fsym=${coinSymbol}&tsyms=${currency}&api_key=${API_KEY}`;
    return axios.get(url);
}


export async function fetchCryptoCompareHistorical(coinSymbol = "BTC", currency = "USD", limit = 60, aggregate = 1, timeframe = "hour") {
    let url;
    if (timeframe === "minute") {
        url = `${BASE_URL}/v2/histominute?fsym=${coinSymbol}&tsym=${currency}&limit=${limit}&aggregate=${aggregate}&api_key=${API_KEY}`;
    } else if (timeframe === "hour") {
        url = `${BASE_URL}/v2/histohour?fsym=${coinSymbol}&tsym=${currency}&limit=${limit}&aggregate=${aggregate}&api_key=${API_KEY}`;
    } else if (timeframe === "day") {
        url = `${BASE_URL}/v2/histoday?fsym=${coinSymbol}&tsym=${currency}&limit=${limit}&aggregate=${aggregate}&api_key=${API_KEY}`;
    } else {
        throw new Error("Timeframe inválido");
    }

    return axios.get(url);
}

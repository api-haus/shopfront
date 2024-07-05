export const httpRequest = (method, url, //
headers, payloadOrQuery) => {
    const params = {
        method,
        headers,
        contentType: 'application/json',
        muteHttpExceptions: true,
    };
    if (method === 'get' && payloadOrQuery) {
        const queryString = objectToQueryParams(payloadOrQuery);
        url = `${url}?${queryString}`;
    }
    else {
        Object.assign(params, {
            payload: JSON.stringify(payloadOrQuery),
        });
    }
    const response = UrlFetchApp.fetch(url, params);
    const code = response.getResponseCode();
    const text = response.getContentText();
    if (code !== 200) {
        throw new Error(`HTTP (${code.toString()}): ${text}`);
    }
    const json = safeJsonParse(text);
    return {
        response,
        text,
        code,
        json,
    };
};
export const safeJsonParse = (data, dataIfError = undefined) => {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        Logger.log(`Failed to parse JSON: ${data}.`);
        return dataIfError;
    }
};
export const objectToQueryParams = (obj) => (Object.entries(obj !== null && obj !== void 0 ? obj : {})
    .map(([k, v,]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&'));
//# sourceMappingURL=http_client.js.map
export const httpRequest = (
  method: GoogleAppsScript.URL_Fetch.HttpMethod,
  url: string, //
  headers?: GoogleAppsScript.URL_Fetch.HttpHeaders,
  payloadOrQuery?: Record<string, unknown>,
) => {
  const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
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
    Object.assign(
      params,
      {
        payload: JSON.stringify(payloadOrQuery),
      },
    );
  }

  const response = UrlFetchApp.fetch(
    url,
    params,
  );
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

export const safeJsonParse = <T>(data: string, dataIfError: T | undefined = undefined): T | undefined => {
  try {
    return JSON.parse(data) as T;
  }
  catch (e) {
    Logger.log(`Failed to parse JSON: ${data}.`);
    return dataIfError;
  }
};

export const objectToQueryParams = (obj: Record<string, unknown> | undefined) => (
  Object.entries(obj ?? {})
    .map(([
      k,
      v,
    ]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join('&')
);

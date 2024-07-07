export const SafeJsonParse = <T>(responseText: string): T | undefined => {
  try {
    return JSON.parse(responseText) as T;
  }
  catch (e) {
    return undefined;
  }
};

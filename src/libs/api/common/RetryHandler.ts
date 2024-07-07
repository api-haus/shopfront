import { formatDuration } from 'date-fns';
import type { RetryHandler } from 'undici';

import { logger } from '../../logger.js';

const calculateRetryAfterHeader = (retryAfter: number | string) => {
  const current = Date.now();
  return new Date(retryAfter).getTime() - current;
};

export const retryHandler: RetryHandler.RetryCallback = (err, {
  state,
  opts,
}, cb): number | null => {
  const { method, retryOptions } = opts;
  const {
    maxRetries = 1,
    minTimeout = 10_000,
    maxTimeout = 100_000,
    timeoutFactor = 1.5,
    errorCodes = [
      'ECONNRESET',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ENETDOWN',
      'ENETUNREACH',
      'EHOSTDOWN',
      'EHOSTUNREACH',
      'EPIPE',
      'UND_ERR_SOCKET',
      'UND_ERR_REQ_CONTENT_LENGTH_MISMATCH',
    ],
    statusCodes = [
      500,
      502,
      503,
      504,
      429,
    ],
    methods = [
      'GET',
      'HEAD',
      'POST',
      'OPTIONS',
      'PUT',
      'DELETE',
      'TRACE',
    ],
    retryAfter = true,
  } = retryOptions ?? {};
  const { counter } = state;

  const {
    code = '',
    headers = {},
    statusCode = 1,
  } = err as unknown as Record<string, unknown>;

  // Any code that is not Undici's originated and allowed to retry
  if (code && ((code as string) !== 'UND_ERR_REQ_RETRY') && !errorCodes.includes(code as string)) {
    cb(err);
    return null;
  }

  // If a set of method are provided and the current method is not in the list
  if (Array.isArray(methods) && !methods.includes(method)) {
    cb(err);
    return null;
  }

  // If a set of status code are provided and the current status code is not in the list
  if (
    statusCode != null
    && Array.isArray(statusCodes)
    && !statusCodes.includes(statusCode as number)
  ) {
    cb(err);
    return null;
  }

  // If we reached the max number of retries
  if (counter > maxRetries) {
    cb(err);
    return null;
  }

  let retryAfterHeader = (headers as Record<string, unknown>)['retry-after'] as number | undefined;
  if (retryAfterHeader) {
    retryAfterHeader = Number(retryAfterHeader);
    retryAfterHeader = Number.isNaN(retryAfterHeader)
      ? calculateRetryAfterHeader(retryAfterHeader)
      : retryAfterHeader * 1e3; // Retry-After is in seconds
  }
  retryAfterHeader ??= 0;

  const retryTime = Math.min(
    retryAfter && (retryAfterHeader > 0)
      ? retryAfterHeader
      : Math.pow(
        minTimeout,
        Math.max(
          1,
          (state.counter - 1) * (timeoutFactor),
        ),
      ),
    maxTimeout,
  );

  logger.warn(
    {
      err,
      counter,
      retryTime,
      code,
      statusCode,
    },
    `Retrying in ${formatDuration({ seconds: retryTime / 1000 })}`,
  );

  setTimeout(
    () => {
      cb(null);
    },
    retryTime,
  );

  return retryTime;
};

import { AxiosHeaders, type AxiosResponseHeaders, type RawAxiosResponseHeaders } from 'axios';

type ResponseHeaders = AxiosResponseHeaders | Partial<RawAxiosResponseHeaders> | Record<string, unknown> | undefined;

function getAuthorizationHeaderValue(headers: ResponseHeaders) {
  if (!headers) {
    return null;
  }

  if (headers instanceof AxiosHeaders) {
    const authorizationHeader = headers.get('Authorization') ?? headers.get('authorization');
    return typeof authorizationHeader === 'string' ? authorizationHeader.trim() : null;
  }

  const authorizationHeader =
    headers.Authorization ??
    headers.authorization;

  return typeof authorizationHeader === 'string' ? authorizationHeader.trim() : null;
}

export function extractAccessToken(authorizationHeader: string | null | undefined) {
  if (!authorizationHeader) {
    return null;
  }

  const matchedToken = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = matchedToken?.[1]?.trim() ?? authorizationHeader.trim();

  return accessToken ? accessToken : null;
}

export function extractAccessTokenFromHeaders(headers: ResponseHeaders) {
  return extractAccessToken(getAuthorizationHeaderValue(headers));
}

export const extractBearerAccessToken = extractAccessToken;
export const extractBearerAccessTokenFromHeaders = extractAccessTokenFromHeaders;

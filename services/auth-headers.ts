export function setBearerAuthorizationHeader<THeaders extends object>(
  headers: THeaders,
  accessToken: string | null,
): THeaders & { Authorization: string } {
  return Object.assign(headers, {
    Authorization: `Bearer ${accessToken}`,
  });
}

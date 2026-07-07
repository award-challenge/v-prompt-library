export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/v-prompt-library" : "";

export function withBasePath(assetPath: string): string {
  return `${BASE_PATH}${assetPath}`;
}

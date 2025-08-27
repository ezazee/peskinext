export type WithParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

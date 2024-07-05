export const Pause = (ms: number) => new Promise<void>(resolve => setTimeout(
  resolve,
  ms,
));

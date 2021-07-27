export const isPromise = (func: unknown) => {
  if (func instanceof Promise && typeof func?.then === 'function') return true;
  return false;
};

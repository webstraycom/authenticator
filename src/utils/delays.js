export const withDelay = (promise, ms = 2000) =>
  Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

/**
 * Restrict a function to be called at a certain frequency.
 * @param {() => void} func the function to throttle
 * @param {number} frequency the frequency of function calls in calls per second
 * @returns the function
 */
export const throttle = (func, frequency) => {
  const period = 1 / (frequency / 1000);
  let interval = null;
  let lastCall = null;
  let lastArgs = [];

  const reset = () => {
    clearInterval(interval);
    interval = null;
    lastCall = null;
    lastArgs = [];
  };

  const wrapper = () => {
    const now = performance.now();
    if (now - lastCall > period) {
      reset();
      return;
    }
    func(...lastArgs);
  };

  const throttler = (...args) => {
    lastCall = performance.now();
    lastArgs = args;
    if (interval === null) {
      func(...lastArgs);
      interval = setInterval(wrapper, period);
    }
  };
  throttler.cancel = reset;

  return throttler;
};

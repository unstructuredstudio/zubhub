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

export const sanitizeObject = (obj) => {
  const sanitizedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Check if the value is not empty
      if (value !== '' && value !== null && value !== undefined) {
        sanitizedObj[key] = value;
      }
    }
  }

  return sanitizedObj;
}

export const getUrlQueryObject = () => {
  if (window) {
    const params = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(params.entries());
    return queryParams
  }
  return {}
}

export const TEAM_ENABLED = false

export const PROJECTS_PAGE_SIZE = 18;
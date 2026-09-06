// Ensure window.fetch is assignable and has a setter to prevent
// "TypeError: Cannot set property fetch of #<Window> which has only a getter"
// in iframe or proxy environments that reassign window.fetch.
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch;
    let currentFetch = typeof rawFetch === 'function' ? rawFetch.bind(window) : rawFetch;

    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set || !desc.writable) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(newFetch: typeof window.fetch) {
          currentFetch = typeof newFetch === 'function' ? newFetch : rawFetch;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    try {
      const orig = window.fetch;
      Object.defineProperty(window, 'fetch', {
        value: typeof orig === 'function' ? orig.bind(window) : orig,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch {
      // Best effort fallback
    }
  }
}

export {};

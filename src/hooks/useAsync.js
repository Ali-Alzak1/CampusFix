import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useAsync(fn, deps?) -> { data, loading, error, refetch }
 *
 * `fn` is called on mount and any time the deps change. It must return a Promise.
 * `refetch()` re-runs the same `fn` without changing deps.
 */
export function useAsync(fn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}

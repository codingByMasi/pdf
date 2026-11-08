// Runs one job (loading, progress, error, result) so every tool handles it the same way.
import { useCallback, useState } from 'react';
import { friendlyErrorKey } from './friendlyError.js';

const idle = { busy: false, progress: null, errorKey: '', result: null };

export function usePdfJob() {
  const [state, setState] = useState(idle);

  const run = useCallback(async (work) => {
    setState({ ...idle, busy: true });
    try {
      const result = await work((progress) => setState((s) => ({ ...s, progress })));
      setState({ ...idle, result });
    } catch (error) {
      setState({ ...idle, errorKey: error?.errorKey ?? friendlyErrorKey(error) });
    }
  }, []);

  const reset = useCallback(() => setState((s) => (s.busy ? s : idle)), []);

  return { ...state, run, reset };
}

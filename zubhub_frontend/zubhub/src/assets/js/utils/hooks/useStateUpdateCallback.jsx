import { useRef, useEffect } from 'react';

export default function useStateUpdateCallback(effect, deps) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      effect();
    }
  }, deps);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);
}

import { useRef, useEffect } from 'react';

/**
 * @function useStateUpdateCallback
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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

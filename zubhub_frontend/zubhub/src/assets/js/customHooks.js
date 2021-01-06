import {useRef, useEffect} from 'react';

export function useStateUpdateCallback(effect, deps) {
    const isFirstRender = useRef(true) 
  
    useEffect(() => {
      if (!isFirstRender.current) {
        effect()
      }  
    }, deps);
  
    useEffect(() => {
      isFirstRender.current = false;
    }, []);
  }
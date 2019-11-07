import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
  const [ size, setSize ] = useState({h: 0, w:0});

  useLayoutEffect(()=>{
    function upateSize() {
      setSize({w: window.innerWidth, h: window.innerHeight});
    }
    if(window){
      window.addEventListener('resize', upateSize);
      upateSize();
      return ()=>window.removeEventListener('resize', upateSize);
    }
  }, [])
  return size;
}
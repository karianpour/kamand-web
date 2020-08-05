import { useEffect, useContext, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { parseSearch } from '../utils/generalUtils';
import { AppStoreContext } from '../store/appStore';

export const useSetFilter = (filterKeys: string[]): boolean => {
  const history = useHistory();
  const appStore = useContext(AppStoreContext);
  const [ ready, setReady ] = useState(false);
  const lastSearch = useRef<string | null>(null);
  
  const search = history.location.search;
  if(search !== lastSearch.current && ready) setReady(false);
  
  useEffect(()=>{
    const params = parseSearch(search);
    filterKeys.forEach( k => {
      let pv = params[k] || null;
      let v: string | string[] | null | boolean;
      if( pv && pv.startsWith('{') && pv.endsWith('}')){
        v = pv.substring(1, pv.length - 1).split(',').filter( v => !!v );
      }else{
        v = pv;
      }
      if( v === 'true' ) v = true;
      appStore.setFilter(k, v);
    });
    lastSearch.current = search;
    setReady(true);
  }, [search, appStore, filterKeys, lastSearch]);

  return ready;
}

export function createQueryString ( params: {key: string, value: any}[]): string {
  const p = params.filter( f => !!f.value).map( f => `${f.key}=${Array.isArray(f.value) ? '{'+f.value.join(',')+'}' : f.value}`);
  return p.length===0?'':('?' + p.join('&'));
}
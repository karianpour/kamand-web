import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import { parseSearch } from '../utils/generalUtils';
import { AppStoreContext } from '../store/appStore';

export const useSetFilter = (filterKeys: string[]) => {//filters?: string[]) => {
  const history = useHistory();
  const appStore = useContext(AppStoreContext);
  
  const search = history.location.search;
  
  useEffect(()=>{
    const params = parseSearch(search);
    filterKeys.forEach( k => {
      let pv = params[k] || null;
      let v: string | string[] | null;
      if( pv && pv.startsWith('{') && pv.endsWith('}')){
        v = pv.substring(1, pv.length - 1).split(',').filter( v => !!v );
      }else{
        v = pv;
      }
      appStore.setFilter(k, v);
    });
    // if(filters){
    //   const addingParams = filters.filter( f => params.findIndex( p => p.key === f ) === -1)
    //     .map( f => ({key: f, value : appStore.getFilter(f)}))
    //     .filter( f => !!f.value).map( f => `${f.key}=${f.value}`);
    //   if(addingParams.length > 0){
    //     const {pathname, hash, search} = history.location;
    //     const url = pathname + ((search ? search + '&' : '?') + addingParams.join('&')) + hash;
    //     history.replace(url);
    //   }
    // }
  }, [search, appStore, filterKeys]);

}
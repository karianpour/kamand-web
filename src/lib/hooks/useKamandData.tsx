import { useEffect, useContext, useCallback, useRef, useState } from 'react';
// import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';

export interface IDataOptions {
  key?: string,
  query: string,
  queryParams: any | (()=>any),
  publicQuery: boolean,
  notReady?: boolean | ((queryParams:any)=>boolean),
}

const useKamandData = (options: IDataOptions) => {
  const appStore = useContext(AppStoreContext);
  const hashKey = useRef<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ _, setRefresher ] = useState(0);

  const prepare = useCallback((forceRefresh: boolean) => {
    let queryParams: any;
    if(typeof options.queryParams === 'function'){
      queryParams = options.queryParams();
    }else{
      queryParams = options.queryParams;
    }

    hashKey.current = options.query + '/'+ hash(JSON.stringify(queryParams));

    let prepareIt = true;
    if(typeof options.notReady === 'function'){
      prepareIt = !options.notReady(queryParams);
    }else{
      prepareIt = !options.notReady;
    }
    if(prepareIt){
      appStore.prepareQueryData(hashKey.current, options.query, queryParams, forceRefresh, options.publicQuery);
      setRefresher((r) => r + 1);
    }
  }, [appStore, options, setRefresher]);

  const queryData: IQueryData = hashKey.current && appStore.getQueryData(hashKey.current);

  useEffect(()=>{
    let queryParams: any;
    if(typeof options.queryParams === 'function'){
      queryParams = options.queryParams();
    }else{
      queryParams = options.queryParams;
    }

    const newHash = options.query + '/'+ hash(JSON.stringify(queryParams));
    if(hashKey.current !== newHash){
      hashKey.current = newHash;
      setRefresher((r) => r + 1);
    }
  }, [options, hashKey, setRefresher]);

  useEffect(()=>{
    if((!queryData && hashKey.current) || (queryData?.queryParams?.key && hashKey.current && queryData.queryParams.key !== hashKey.current))
      prepare(false);
  }, [prepare, queryData, hashKey]);

  const refreshHandler = () => {
    prepare(true);
  }

  return {
    queryData,
    refreshHandler,
  }
};

export default useKamandData;
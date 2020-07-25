import { useEffect, useContext, useCallback } from 'react';
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

  let queryParams: any;
  if(typeof options.queryParams === 'function'){
    queryParams = options.queryParams();
  }else{
    queryParams = options.queryParams;
  }

  const hashKey = options.query + '/'+ hash(JSON.stringify(queryParams));

  const prepare = useCallback((forceRefresh: boolean) => {
    // console.log(`execute prepareQuery with ${queryParams}`)
    let prepareIt = true;
    if(typeof options.notReady === 'function'){
      prepareIt = !options.notReady(queryParams);
    }else{
      prepareIt = !options.notReady;
    }
    if(prepareIt){
      appStore.prepareQueryData(hashKey, options.query, queryParams, forceRefresh, options.publicQuery);
    }
  }, [appStore, options, hashKey, queryParams]);

  const queryData: IQueryData = appStore.getQueryData(hashKey);

  useEffect(()=>{
    if(!queryData)
      prepare(false);
  }, [prepare, queryData]);

  const refreshHandler = () => {
    prepare(true);
  }

  return {
    queryData,
    queryParams,
    refreshHandler,
  }
};

export default useKamandData;
import { useEffect, useContext, useCallback } from 'react';
// import { observer } from 'mobx-react-lite';
import { AppStoreContext, AppStore } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';

export interface IDataOptions {
  key?: string,
  query: string,
  queryParams: object | ((appStore:AppStore)=>any),
  publicQuery: boolean,
}

const useKamandData = (options: IDataOptions) => {
  const appStore = useContext(AppStoreContext);

  let queryParams: any;
  if(typeof options.queryParams === 'function'){
    queryParams = options.queryParams(appStore);
  }else{
    queryParams = options.queryParams;
  }

  const hashKey = options.key ? options.key : options.query + '/'+ hash(JSON.stringify(queryParams));

  const prepare = useCallback((forceRefresh: boolean) => {
    // console.log(`execute prepareQuery with ${queryParams}`)
    appStore.prepareQueryData(hashKey, options.query, queryParams, forceRefresh, options.publicQuery);
  }, [appStore, options, hashKey, queryParams]);

  useEffect(()=>{
    prepare(false);
  }, [prepare]);

  const refreshHandler = () => {
    prepare(true);
  }

  const queryData: IQueryData = appStore.getQueryData(hashKey);

  return {
    queryData,
    refreshHandler,
  }
};

export default useKamandData;
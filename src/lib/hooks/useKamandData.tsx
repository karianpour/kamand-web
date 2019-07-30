import { useEffect, useContext, useCallback } from 'react';
// import { observer } from 'mobx-react-lite';
import { AppStoreContext, AppStore } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';

export interface IDataOptions {
  key: string,
  query: string,
  queryParams: object | ((appStore:AppStore)=>any),
  publicQuery: boolean,
}

const useKamandData = (options: IDataOptions) => {
  const appStore = useContext(AppStoreContext);

  const prepare = useCallback((forceRefresh: boolean) => {
    let queryParams;
    if(typeof options.queryParams === 'function'){
      queryParams = options.queryParams(appStore);
    }else{
      queryParams = options.queryParams;
    }
    // console.log(`execute prepareQuery with ${queryParams}`)
    appStore.prepareQueryData(options.key, options.query, queryParams, forceRefresh, options.publicQuery);
  }, [appStore, options]);

  useEffect(()=>{
    prepare(false);
  }, [prepare]);

  const refreshHandler = () => {
    prepare(true);
  }

  const queryData: IQueryData = appStore.getQueryData(options.key);

  return {
    queryData,
    refreshHandler,
  }
};

export default useKamandData;
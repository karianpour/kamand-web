import { useEffect, useContext, useCallback } from 'react';
// import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';
import { IDataOptions } from './useKamandData';

const useObservedKamandData = (options: IDataOptions) => {
  const appStore = useContext(AppStoreContext);

  let queryParams: any;
  if(typeof options.queryParams === 'function'){
    queryParams = options.queryParams();
  }else{
    queryParams = options.queryParams;
  }

  const hashKey = options.query + '/'+ hash(JSON.stringify(queryParams));

  const prepare = useCallback((forceRefresh: boolean) => {
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
    refreshHandler,
  }
};

export default useObservedKamandData;
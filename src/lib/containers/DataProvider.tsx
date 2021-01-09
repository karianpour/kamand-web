import React, { useEffect, useContext, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { AppStoreContext, AppStore } from '../store/appStore';
import { IQueryData, IQueryParams } from '../store/interfaces/dataInterfaces';

export interface IDataOptions {
  key: string,
  query: string,
  queryParams: IQueryParams | ((appStore:AppStore)=>any),
  publicQuery: boolean,
  readonly forwardRef?: boolean,
}

// export type DataInjector<P extends object> = <
//   C extends React.FunctionComponent<P>
// >(
//   component: C,
// ) => React.FunctionComponent<P & {queryData: any}>;

// React.FunctionComponent<P>
const withData = (Component:React.FunctionComponent<any>, options: IDataOptions) => observer((props:any) => {
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
  }, [appStore]);

  useEffect(()=>{
    prepare(false);
  }, [prepare]);

  const handleRefresh = () => {
    prepare(true);
  }

  const queryData: IQueryData = appStore.getQueryData(options.key);

  return <Component queryData={queryData} refreshHandler={handleRefresh} {...props}/>
});

export default withData;
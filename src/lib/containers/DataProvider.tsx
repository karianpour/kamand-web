import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';

export interface IDataOptions {
  key: string,
  query: string,
  queryParams: any,
  publicQuery: boolean,
  readonly forwardRef?: boolean,
}

// export type DataInjector<P extends object> = <
//   C extends React.FunctionComponent<P>
// >(
//   component: C,
// ) => React.FunctionComponent<P & {queryData: any}>;

// React.FunctionComponent<P>
const withData = (Component:React.FunctionComponent<any>, option: IDataOptions) => observer((props:any) => {
  const appStore = useContext(AppStoreContext);

  useEffect(()=>{
    appStore.prepareQueryData(option.key, option.query, option.queryParams, false, option.publicQuery);
  }, [appStore]);

  const queryData: IQueryData = appStore.getQueryData(option.key);

  return <Component queryData={queryData} {...props}/>
});

export default withData;
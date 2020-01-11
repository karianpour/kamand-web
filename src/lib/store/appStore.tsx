import { observable, decorate, action, configure } from 'mobx';
import { createContext, Context } from 'react';
// import { setAppStore } from '../api/kamandApi';
import { fetchData, loadActData, saveActData, removeActData } from '../api/kamandApi';
import { ISnackMessage } from './interfaces/authInterfaces';
import { IQueryData } from './interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';
import { connectWebSocketToServer, doAsyncActData } from '../api/kamandSocket';

configure({ enforceActions: "observed" });

export class AppStore {
  pageTitle?:string = '';
  appBarHidden: boolean = false;
  snackMessage?: ISnackMessage;

  readonly queryData = observable.map<string, any>({}, { deep: false });
  readonly filtersData = observable.map<string, any>({});
  readonly actData = observable.map<string, any>({}, { deep: false });

  readonly optionData = observable.map<string, any>({}, { deep: false });

  constructor(){
    connectWebSocketToServer();
    // setAppStore(this);
  }

  setPageTitle(pageTitle: string) {
    this.pageTitle = pageTitle;
  }

  hideAppBar(appBarHidden: boolean) {
    this.appBarHidden = appBarHidden;
  }

  setSnackMessage(snackMessage?:ISnackMessage){
    this.snackMessage = snackMessage;
  }

  setFilter(key: string, filter?: any) {
    this.filtersData.set(key, filter);
  }

  getFilter(key: string): any{
    return this.filtersData.get(key);
  }

  setQueryData(key: string, queryParam: any, data: any, loading: boolean, error: boolean) {
    if(Array.isArray(data)){
      data.forEach((d, i) => {
        d.arrayIndex = i;
      })
    }
    const qd: IQueryData = observable.object({
      queryParam: observable.map(queryParam, { deep: false }),
      data: !data ? [] : observable.array(data, { deep: false }),
      loading,
      error,
    }, {  });
    this.queryData.set(key, qd);
  }

  getQueryData(key: string): any{
    return this.queryData.get(key);
  }

  async prepareQueryData(key: string, query: string, queryParam: any, forceRefresh: boolean, publicQuery: boolean = true) : Promise<void> {
    if(!this.queryData.has(key) || forceRefresh){
      const previousData = this.getQueryData(key);
      if(previousData){
        this.setQueryData(key, queryParam, previousData.data, true, false);
      }else{
        this.setQueryData(key, queryParam, undefined, true, false);
      }
      try{
        const data = await fetchData(query, queryParam, publicQuery);
        this.setQueryData(key, queryParam, data, false, !data);
      }catch(err){
        console.error(`error while fetching data in prepareQueryData with ${err}`);
        this.setQueryData(key, queryParam, undefined, false, true);
      }
    }
  }

  setActData(key: string, actData?: any) {
    this.actData.set(key, actData);
  }

  getActData(key: string): any{
    return this.actData.get(key);
  }

  deleteActData(key: string): any{
    return this.actData.delete(key);
  }

  async loadActDataFirstCache(key: string, query: string, queryParam: any, makeObservable?: (data: any)=>any) : Promise<any> {
    const cache = this.actData.get(key);
    if(cache) return cache;
    const data = await this.loadActData(key, query, queryParam, makeObservable);    
    return data;
  }

  private loadingActData: {[key:string]: boolean} = {};
  async loadActData(key: string, query: string, queryParam: any, makeObservable?: (data: any)=>any) : Promise<any> {
    const hashKey = query + '/'+ hash(JSON.stringify(queryParam));
    if(this.loadingActData[hashKey]) return;
    this.loadingActData[hashKey] = true;
    try{
      const data = await loadActData(query, queryParam);
      if(data){
        if(makeObservable){
          this.setActData(key, makeObservable(data));
        }else{
          this.setActData(key, data);
        }
      }
      return data;
    }catch(err){
      throw err;
    }finally{
      delete this.loadingActData[hashKey];
    }
  }

  async saveActData(key: string | null, query: string, data: any) : Promise<any> {
    if(key) this.setActData(key, data);
    const result = await saveActData(query, data);
    if(result && key){
      this.setActData(key, data);
    }
    return result;
  }

  async removeActData(key: string | null, query: string, data: any) : Promise<any> {
    const result = await removeActData(query, data);
    if(result && key){
      this.deleteActData(key);
    }
    return result;
  }

  async doAsyncActData(key: string, query: string, data: any) : Promise<void> {
    this.setActData(key, data);
    doAsyncActData(query, data, (payload: any)=>{
      this.setActData(key, payload);
    });
  }

  setOptionData(key: string, data: any) {
    this.optionData.set(key, data);
  }

  getOptionData(key: string): any{
    return this.optionData.get(key);
  }
}
decorate(AppStore, {
  pageTitle: observable,
  setPageTitle: action,
  appBarHidden: observable,
  hideAppBar: action,
  
  snackMessage: observable,
  setSnackMessage: action,
  
  setFilter: action,
  setQueryData: action,
  prepareQueryData: action,
  setActData: action,
  loadActDataFirstCache: action,
  loadActData: action,
  saveActData: action,
  removeActData: action,
  setOptionData: action,
});

export const appStore = new AppStore();

export const AppStoreContext: Context<AppStore> = createContext(appStore);

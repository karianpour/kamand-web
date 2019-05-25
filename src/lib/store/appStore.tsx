import { observable, decorate, action, configure } from 'mobx';
import { createContext, Context } from 'react';
// import { setAppStore } from '../api/kamandApi';
import { fetchData, loadActData, saveActData } from '../api/kamandApi';
import { ISnackMessage } from './interfaces/authInterfaces';

configure({ enforceActions: "observed" });

export class AppStore {
  pageTitle?:string = '';
  appBarHidden: boolean = false;
  snackMessage?: ISnackMessage;

  readonly queryData = observable.map({}, { deep: false });
  readonly actData = observable.map({}, { deep: false });

  // constructor(){
    // setAppStore(this);
  // }

  setPageTitle(pageTitle: string) {
    this.pageTitle = pageTitle;
  }

  hideAppBar(appBarHidden: boolean) {
    this.appBarHidden = appBarHidden;
  }

  setSnackMessage(snackMessage?:ISnackMessage){
    console.log(snackMessage);
    this.snackMessage = snackMessage;
  }

  setQueryData(key: string, queryData?: any) {
    this.queryData.set(key, queryData);
  }

  getQueryData(key: string): any{
    return this.queryData.get(key);
  }

  async prepareQueryData(key: string, query: string, queryParam: any, forceRefresh: boolean, publicQuery: boolean = true) : Promise<void> {
    if(!this.queryData.has(key) || forceRefresh){
      const data = await fetchData(query, queryParam, publicQuery);
      this.setQueryData(key, data);
    }
  }

  setActData(key: string, actData?: any) {
    this.actData.set(key, actData);
  }

  getActData(key: string): any{
    return this.actData.get(key);
  }

  async loadActData(key: string, query: string, queryParam: any) : Promise<void> {
    const data = await loadActData(query, queryParam);
    this.setActData(key, data);
  }

  async saveActData(key: string, query: string, data: any) : Promise<any> {
    this.setActData(key, data);
    const result = await saveActData(query, data);
    return result;
  }
}
decorate(AppStore, {
  pageTitle: observable,
  setPageTitle: action,
  appBarHidden: observable,
  hideAppBar: action,
  
  snackMessage: observable,
  setSnackMessage: action,
  
  setQueryData: action,
  prepareQueryData: action,
  setActData: action,
  loadActData: action,
  saveActData: action,
});

export const appStore = new AppStore();

export const AppStoreContext: Context<AppStore> = createContext(appStore);

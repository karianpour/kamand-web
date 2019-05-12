import { observable, decorate, action, configure } from 'mobx';
import { createContext, Context } from 'react';
// import { setAppStore } from '../api/kamandApi';
import { fetchData } from '../api/kamandApi';
import { ISnackMessage } from './interfaces/authInterfaces';

configure({ enforceActions: "observed" });

export class AppStore {
  pageTitle?:string = '';
  appBarHidden: boolean = false;
  snackMessage?: ISnackMessage;

  readonly queryData = observable.map({}, { deep: false });

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

  async prepareQueryData(key: string, query: string, queryParam: any, forceRefresh: boolean) : Promise<void> {
    if(!this.queryData.has(key) || forceRefresh){
      const data = await fetchData(query, queryParam);
      this.setQueryData(key, data);
    }
  }

  // raceProgress?: RaceProgress;

  // setRaceProgress(raceProgress?: RaceProgress){
  //   this.raceProgress = raceProgress;
  // }
}
decorate(AppStore, {
  pageTitle: observable,
  setPageTitle: action,
  appBarHidden: observable,
  hideAppBar: action,
  
  snackMessage: observable,
  setSnackMessage: action,
  
  // queryData: observable,
  // raceProgress: observable,
  setQueryData: action,
  prepareQueryData: action,
});

// export class RaceProgress {
  
//   constructor(
//     private appStore: AppStore,
//   ){
//   }

// }
// decorate(RaceProgress, {
// });

export const appStore = new AppStore();

export const AppStoreContext: Context<AppStore> = createContext(appStore);

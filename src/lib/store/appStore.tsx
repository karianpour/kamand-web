import { observable, action, configure, makeObservable, computed } from 'mobx';
import { createContext, Context } from 'react';
// import { setAppStore } from '../api/kamandApi';
import { fetchData, loadActData, saveActData, removeActData, fetchPaginatedData } from '../api/kamandApi';
import { ISnackMessage } from './interfaces/authInterfaces';
import { IQueryData, IQueryParams, ISelection } from './interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';
import { connectWebSocketToServer, doAsyncActData, listenAsyncActData } from '../api/kamandSocket';

configure({ enforceActions: "observed" });

export class AppStore {
  pageTitle?: string = '';
  appBarHidden: boolean = false;
  snackMessage?: ISnackMessage;

  readonly queryData = observable.map<string, any>({}, { deep: false });
  readonly paginatedQueryData = observable.map<string, PaginatedQueryData>({}, { deep: false });
  readonly filtersData = observable.map<string, any>({});
  readonly actData = observable.map<string, any>({}, { deep: false });

  readonly optionData = observable.map<string, any>({}, { deep: false });

  constructor() {
    makeObservable(this, {
      pageTitle: observable,
      setPageTitle: action,
      appBarHidden: observable,
      hideAppBar: action,

      snackMessage: observable,
      setSnackMessage: action,

      setFilter: action,
      setQueryData: action,
      invalidateQueryDataCache: action,
      prepareQueryData: action,
      invalidatePaginatedQueryDataCache: action,
      preparePaginatedQueryData: action,
      setActData: action,
      loadActDataFirstCache: action,
      loadActData: action,
      saveActData: action,
      removeActData: action,
      setOptionData: action,
    });

    connectWebSocketToServer();
    // setAppStore(this);
  }

  setPageTitle(pageTitle: string) {
    this.pageTitle = pageTitle;
  }

  hideAppBar(appBarHidden: boolean) {
    this.appBarHidden = appBarHidden;
  }

  setSnackMessage(snackMessage?: ISnackMessage) {
    this.snackMessage = snackMessage;
  }

  setFilter(key: string, filter?: any) {
    this.filtersData.set(key, filter);
  }

  getFilter(key: string): any {
    return this.filtersData.get(key);
  }

  setQueryData(key: string, queryParams: IQueryParams, data: any[] | undefined, loading: boolean, error: boolean) {
    if (Array.isArray(data)) {
      data.forEach((d, i) => {
        d.arrayIndex = i;
      })
    }
    const qd: IQueryData = observable.object({
      key,
      // queryParam: observable.map(queryParam, { deep: false }),
      queryParams,
      data: !data ? [] : observable.array(data, { deep: false }),
      selection: new Selection(),
      loading,
      error,
    }, {});
    this.queryData.set(key, qd);
  }

  getQueryData(key: string): any {
    return this.queryData.get(key);
  }

  invalidateQueryDataCache(key: string): any {
    return this.queryData.delete(key);
  }

  async prepareQueryData(key: string, query: string, queryParams: IQueryParams, forceRefresh: boolean, publicQuery: boolean = true, makeupData?: ((data: any) => any)): Promise<void> {
    if (!this.queryData.has(key) || forceRefresh) {
      const previousData = this.getQueryData(key);
      if (previousData) {
        this.setQueryData(key, queryParams, previousData.data, true, false);
      } else {
        this.setQueryData(key, queryParams, undefined, true, false);
      }
      try {
        let data = await fetchData(query, queryParams, publicQuery);
        if (makeupData) data = makeupData(data);
        this.setQueryData(key, queryParams, data, false, !data);
      } catch (err) {
        console.error(`error while fetching data in prepareQueryData with ${err}`);
        this.setQueryData(key, queryParams, undefined, false, true);
      }
    }
  }

  getPaginatedQueryData(key: string): PaginatedQueryData | undefined {
    return this.paginatedQueryData.get(key);
  }

  invalidatePaginatedQueryDataCache(key: string): void {
    this.paginatedQueryData.delete(key);
  }

  preparePaginatedQueryData(key: string, query: string, queryParams: IQueryParams, forceRefresh: boolean, publicQuery: boolean = true, pageSize: number = 10, makeupData?: ((data: any) => any)): void {
    if (!this.paginatedQueryData.has(key) || forceRefresh) {
      // const previousData = this.getPaginatedQueryData(key);
      // We might need to preserve the previous data till the new one loads
      const paginatedQueryData = new PaginatedQueryData(query, queryParams, publicQuery, pageSize, makeupData);
      this.paginatedQueryData.set(key, paginatedQueryData);
      paginatedQueryData.preparePageData(0);
    }
  }

  setActData(key: string, actData?: any) {
    this.actData.set(key, actData);
  }

  getActData(key: string): any {
    return this.actData.get(key);
  }

  deleteActData(key: string): any {
    return this.actData.delete(key);
  }

  async loadActDataFirstCache(key: string, query: string, queryParams: any, makeObservable?: (data: any) => any): Promise<any> {
    const cache = this.actData.get(key);
    if (cache) return cache;
    const data = await this.loadActData(key, query, queryParams, makeObservable);
    return data;
  }

  private loadingActData: { [key: string]: boolean } = {};
  async loadActData(key: string, query: string, queryParams: any, makeObservable?: (data: any) => any): Promise<any> {
    const hashKey = query + '/' + hash(JSON.stringify(queryParams));
    if (this.loadingActData[hashKey]) return;
    this.loadingActData[hashKey] = true;
    try {
      const data = await loadActData(query, queryParams);
      if (data) {
        if (makeObservable) {
          this.setActData(key, makeObservable(data));
        } else {
          this.setActData(key, data);
        }
      }
      return data;
    } catch (err) {
      throw err;
    } finally {
      delete this.loadingActData[hashKey];
    }
  }

  async saveActData(key: string | null, query: string, data: any): Promise<any> {
    if (key) this.setActData(key, data);
    const result = await saveActData(query, data);
    if (result && key) {
      this.setActData(key, result);
    }
    return result;
  }

  async removeActData(key: string | null, query: string, data: any): Promise<any> {
    const result = await removeActData(query, data);
    if (result && key) {
      this.deleteActData(key);
    }
    return result;
  }

  doAsyncActData(query: string, data: any): void {
    doAsyncActData(query, data);
  }

  listenAsyncActData(event: string, callback: ((payload: any) => void)) {
    listenAsyncActData(event, callback);
  }

  setOptionData(key: string, data: any) {
    this.optionData.set(key, data);
  }

  getOptionData(key: string): any {
    return this.optionData.get(key);
  }
}


export const appStore = new AppStore();

export const AppStoreContext: Context<AppStore> = createContext(appStore);


export class Selection implements ISelection {
  private selection = observable.map<number, boolean>({}, { deep: false });

  constructor() {
    makeObservable(this, {
      setSelected: action,
    });
  }

  isSelected(index: number): boolean {
    return !!this.selection.get(index);
  }

  setSelected(index: number, selected: boolean) {
    if (!selected)
      this.selection.delete(index);
    else
      this.selection.set(index, selected);
  }

  get selected(): boolean {
    return this.selection.size > 0;
  }
}

export class PaginatedQueryData {
  readonly pages = observable.array<PageData | null>([], { deep: false });
  totalCount: number = 0;
  activePageIndex: number = 0;

  constructor(
    private query: string,
    private queryParams: IQueryParams,
    private publicQuery: boolean,
    private pageSize: number,
    private makeupData: ((data: any) => any) | undefined,
  ) {
    makeObservable(this, {
      totalCount: observable,
      activePageIndex: observable,
      setActivePageIndex: action,
      pageCount: computed,
      setMeta: action,
      currentPage: computed,
      preparePageData: action,
    });
  }

  getActivePageIndex(): number {
    return this.activePageIndex;
  }

  setActivePageIndex(value: number) {
    this.activePageIndex = value;
  }

  get pageCount(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  setMeta(totalCount: number, pageSize: number) {
    this.totalCount = totalCount;
    this.pageSize = pageSize;
    this.activePageIndex = 0;
  }

  getPage(index: number) {
    const page = (index < 0 || index >= this.pages.length) ? undefined : this.pages[index];
    if(page) {
      return page;
    } else {
      this.preparePageData(index);
    }
  }

  get currentPage(){
    return this.getPage(this.activePageIndex);
  }

  async preparePageData(index: number) {
    const offset = index * this.pageSize;
    const pageData = new PageData(index);
    if(index > this.pages.length){
      for(let i = this.pages.length; i <= index; i++) {
        console.log(`setting ${i} index`);
        this.pages[i] = null;
      }
    }

    this.pages[index] = pageData;
    try {
      const result = await fetchPaginatedData(this.query, this.queryParams, offset, this.pageSize, this.publicQuery);
      if(result){
        result.data = result.data.map( (d, i) => {
          d.arrayIndex = offset + i;
          this.makeupData && this.makeupData(d);
          return d;
        });
        if(index === 0 && result.meta.totalCount){
          this.setMeta(result.meta.totalCount, result.meta.limit);
        }
        pageData.setData(result.data);
      }else{
        pageData.setError();
      }
    } catch (err) {
      console.error(`error while fetching data in prepareQueryData with ${err}`);
      pageData.setError();
    }
  }
}

export class PageData {
	data?: any[];
  loading: boolean = true;
  error: boolean = false;
  
  constructor(private pageIndex: number){
    makeObservable(this, {
      loading: observable,
      error: observable,
      setData: action,
      setError: action,
    });
  }

  setData (data: any[]) {
    this.data = data;
    this.loading = false;
    this.error = false;
  }

  setError () {
    this.data = undefined;
    this.loading = false;
    this.error = true;
  }

  getIndex(): number {
    return this.pageIndex;
  }

  getData(): any[] | undefined {
    return this.data;
  }
}
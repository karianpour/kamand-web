import { ITestData } from '../store/interfaces/dataInterfaces';
// import { AppStore } from '../store/appStore';
import axios, { AxiosRequestConfig } from 'axios';
import { APIADDRESS } from './authApi';
import { authStore } from '../store/authStore';

// let appStore: AppStore;

export async function fetchData(query: string, params: any, publicQuery: boolean = false) : Promise<ITestData[] | undefined>{
  try{
    const headers = !authStore.token ? undefined : {'Authorization': `Bearer ${authStore.token}`};
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      params,
      headers,
    };
    const result:any = await axios.get(`${publicQuery? '':'/private'}/data/${query}`, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at fetchData', result);
    }
  }catch(err){
    console.error('failed at fetchData', err);
  }
}

export async function loadActData(query: string, params: any) : Promise<ITestData[] | undefined>{
  try{
    const headers = !authStore.token ? undefined : {'Authorization': `Bearer ${authStore.token}`};
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      params,
      headers,
    };
    const result:any = await axios.get(query, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at loadActData', result);
    }
  }catch(err){
    console.error('failed at loadActData', err);
  }
}

export async function saveActData(query: string, data: any) : Promise<ITestData[] | undefined>{
  try{
    const headers = !authStore.token ? undefined : {'Authorization': `Bearer ${authStore.token}`};
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      headers,
    };
    const result:any = await axios.post(query, data, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at saveActData', result);
    }
  }catch(err){
    console.error('failed at saveActData', err);
  }
}

// export async function setAppStore(_appStore: AppStore) : Promise<void>{
//   appStore = _appStore;
// }

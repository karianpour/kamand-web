// import { AppStore } from '../store/appStore';
import axios, { AxiosRequestConfig } from 'axios';
import { APIADDRESS } from './authApi';
import { authStore } from '../store/authStore';
import { extractError } from '../utils/generalUtils';

// let appStore: AppStore;

export async function fetchData(query: string, params: any, publicQuery: boolean = false) : Promise<any>{
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

export async function loadActData(query: string, params: any) : Promise<any>{
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
      throw {
        error: 'server error!',
      };
    }
  }catch(err){
    console.error('failed at loadActData', err);
    const error = extractError(err);
    if(!error){
      //FIXME show snakbar
      throw new Error('unknown error!');
    }
    throw error;
  }
}

export async function saveActData(query: string, data: any) : Promise<any>{
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
      throw {
        error: 'server error!',
      };
    }
  }catch(err){
    console.error('failed at saveActData', err);
    const error = extractError(err);
    if(!error){
      //FIXME show snakbar
      throw new Error('unknown error!');
    }
    throw error;
  }
}

// export async function setAppStore(_appStore: AppStore) : Promise<void>{
//   appStore = _appStore;
// }

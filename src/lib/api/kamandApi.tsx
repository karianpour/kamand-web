// import { AppStore } from '../store/appStore';
import axios, { AxiosRequestConfig } from 'axios';
import { authStore } from '../store/authStore';
import { extractError } from '../utils/generalUtils';

const APIADDRESS = process.env.REACT_APP_APIADDRESS || '';

function addToken(headers: any){
  if(authStore.token) headers['Authorization'] = `Bearer ${authStore.token}`;
}

export async function fetchData(query: string, params: any, publicQuery: boolean = false) : Promise<any>{
  try{
    const headers = {};
    addToken(headers);
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      timeout: 30 * 1000,
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
    const headers = {};
    addToken(headers);
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      timeout: 30 * 1000,
      params,
      headers,
    };
    const result:any = await axios.get(query, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at loadActData', result);
      const e = {
        error: 'server error!',
      };
      throw e;
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
    const headers = {};
    addToken(headers);
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      timeout: 60 * 1000,
      headers,
    };
    const result:any = await axios.post(query, data, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at saveActData', result);
      const e = {
        error: 'server error!',
      };
      throw e;
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

export async function executeApi(executionConfig: AxiosRequestConfig) : Promise<any>{
  try{
    const headers = {};
    addToken(headers);
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      timeout: 60 * 1000,
      headers,
      ...executionConfig,
    };
    const result:any = await axios(config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at saveActData', result);
      const e = {
        error: 'server error!',
      };
      throw e;
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

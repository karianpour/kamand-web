import { ITestData } from '../store/interfaces/dataInterfaces';
// import { AppStore } from '../store/appStore';
import axios, { AxiosRequestConfig } from 'axios';
import { APIADDRESS } from './authApi';

// let appStore: AppStore;

export async function fetchData(query: string, params: any) : Promise<ITestData[] | undefined>{
  try{
    // let params = {};
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
      params,
    };
    const result:any = await axios.get(`/data/${query}`, config);
  
    // console.log(result);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error('failed at fetchData', result);
    }
  }catch(err){
    console.error('failed at fetchData', err);
  }
}

// export async function setAppStore(_appStore: AppStore) : Promise<void>{
//   appStore = _appStore;
// }

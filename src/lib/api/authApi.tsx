import axios, { AxiosRequestConfig } from 'axios';
import { extractError } from '../utils/generalUtils';

export const APIADDRESS = process.env.REACT_APP_APIADDRESS || '';

export interface IUser{
  token:string,
  [K:string]: any,
}

export interface ILogin{
  username: string,
  password: string,
}

export async function login(loginInfo : ILogin) : Promise<IUser>{
  try{
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
    };
    const result:any = await axios.post('/users/login', loginInfo, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error(result);
      const e = {
        username: 'failed',
      };
      throw e;
    }
  }catch(err){
    const error = extractError(err);
    if(!error){
      if(err.response.status===404){
        const e = {
          username: 'failed',
        };
        throw e;
      }else{
        //FIXME show snakbar
        throw new Error('unknown error!');
      }
    }
    throw error;
  }
}

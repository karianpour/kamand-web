import axios, { AxiosRequestConfig } from 'axios';
import { extractError } from '../utils/generalUtils';

const APIADDRESS = process.env.REACT_APP_APIADDRESS || '';
const LoginURI = process.env.REACT_APP_LoginURI || '/users/login';
const ForgotURI = process.env.REACT_APP_ForgotURI || '/users/forgot';

export interface IUser{
  token:string,
  [K:string]: any,
}

export interface ILogin{
  username: string,
  password: string,
}

export interface IForgot{
  username: string,
}

export async function login(loginInfo : ILogin) : Promise<IUser>{
  try{
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
    };
    const result:any = await axios.post(LoginURI, loginInfo, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error(result);
      const e = {
        username: 'failed',
      };
      throw e;
    }
  }catch(err:any){
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

export async function forgot(forgotInfo : IForgot) : Promise<IUser>{
  try{
    const config:AxiosRequestConfig = {
      baseURL: APIADDRESS,
    };
    const result:any = await axios.post(ForgotURI, forgotInfo, config);
  
    if(result.status === 200){
      return result.data;
    }else{
      console.error(result);
      const e = {
        username: 'failed',
      };
      throw e;
    }
  }catch(err:any){
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

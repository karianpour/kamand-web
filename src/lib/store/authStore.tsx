import { observable, decorate, action, reaction, toJS, configure } from 'mobx';
import { createContext, Context } from 'react';
import { login, IUser } from '../api/authApi';


configure({ enforceActions: "observed" });

class AuthStore {
  user?:IUser;
  loggedin:boolean = false;
  token?:string;

  setUser(user:IUser) {
    this.user = user;
    if(user.token){
      this.loggedin = true;
      this.token = user.token;
    }else{
      this.loggedin = false;
      this.token = undefined;
    }
  }

  clearUser() {
    this.user = undefined;
    this.loggedin = false;
    this.token = undefined;
  }

  async login (username:string, password: string) : Promise<void> {
    const user = await login({username, password});
    this.setUser(user);
  }
}

decorate(AuthStore, {
  loggedin: observable,
  token: observable,
  user: observable.shallow,
  setUser: action,
  clearUser: action,
  login: action,
});

export const authStore = new AuthStore();

export const AuthStoreContext: Context<AuthStore> =  createContext(authStore);

let json = localStorage.getItem('__auth__');
if(json) {
  const data = JSON.parse(json);
  if(data){
    if(data.user){
      authStore.setUser(data.user);
    }
  }
}

reaction(() => JSON.stringify(toJS(authStore)), json => {
  localStorage.setItem('__auth__', json);
}, {
  delay: 2000,
});

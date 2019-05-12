import { observable, decorate, action, configure } from 'mobx';
import { createContext, Context } from 'react';
import { create, persist } from 'mobx-persist'
import localforage from 'localforage';


configure({ enforceActions: "observed" });

class AuthStore {
  hydrated:boolean = false;
  loggedin:boolean = false;
  token?:string;

  setHydrated(hydrated: boolean){
    this.hydrated = hydrated;
  }

}

decorate(AuthStore, {
  hydrated: observable,
  loggedin: observable,
  token: observable,
  setHydrated: action,
});

const schema = {
  loggedin: true,
  token: true,
}

const hydrate = create({
  storage: localforage,
  jsonify: false,  
  debounce: 2000,
});

export const authStore = persist(schema)(new AuthStore());

hydrate('__auth__', authStore)
    .then(() => authStore.setHydrated(true));

export const AuthStoreContext: Context<AuthStore> =  createContext(authStore);

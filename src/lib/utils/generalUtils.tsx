import i18n from '../translations/i18n';

export function msleep(n:number) {
  return new Promise(resolve => setTimeout(resolve, n));
//  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

export function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractError (err:any): any{
  if(
    err && err.response && err.response.data && err.response.data.error && err.response.data.statusCode !== 200
  ){
    try{
      const details = JSON.parse(err.response.data.message);
      if(details){
        console.log({err, error: details});
        if(Array.isArray(details)){
          details.forEach( detail => {
            translate(detail);
          });
        }else{
          translate(details);
        }
        return details;
      }
    }catch(_){
      return err.response.data.message;
    }
  }
  return err;
}

function translate (details: any) {
  if(!!!details.codes) return;
  for(let k in details.codes){
    if(!details.codes.hasOwnProperty(k)) continue;
    const code = details.codes[k];
    if(Array.isArray(code)){
      code.forEach( (c, i) => {
        const translated = tryTranslation(c);
        if(translated) details[k][i] = translated;
      });
    }else{
      const translated = tryTranslation(code);
      if(translated) details[k] = translated;
    }
  }
}

type IErrorCode = {
  code: string,
  params: { [K: string]: any },
}

function tryTranslation(code: string | IErrorCode): string | undefined{
  if(typeof code === 'string' ){
    const tkey = `error.${code}`;
    //FIXME not pure function
    const translated = i18n.t(tkey);
    if(tkey !== translated){
      return translated;
    }
  // }else if(code instanceof IErrorCode){
  }else{
    const tkey = `error.${code.code}`;
    const translated = i18n.t(tkey, code.params);
    if(tkey !== translated){
      return translated;
    }

  }
  return;
}

export function hasRole(user: any, checkingRoles: string | string[]): boolean {
  if(!user || !user.roles) return false;
  const { roles } = user;

  if(typeof roles === 'string'){
    if(typeof checkingRoles === 'string'){
      return roles === checkingRoles;
    }else{
      return checkingRoles.findIndex( r => r === roles) > -1;
    }
  }
  if(Array.isArray(roles)){
    if(typeof checkingRoles === 'string'){
      return roles.findIndex( r => r === checkingRoles) > -1;
    }else{
      return roles.some( r => checkingRoles.findIndex( cr => cr === r) > -1);
    }
  }

  // user.roles && user.roles.findIndex( (r) => 'admin');
  return false;
}
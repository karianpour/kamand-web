import i18n from '../translations/i18n';

export function msleep(n:number) {
  //  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  return sleep(n);
}

export function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractErrorMessage (details:any): any{
  if(typeof details === 'string'){
    return details;
  }

  if(!!!details.codes) {
    console.error(`there should be a problem in extractError function in generalUtils module!`);
    return tryTranslation('odd') || 'odd error';
  };

  let message = '';
  const appendError = (c: any) => {
    const translated = tryTranslation(c);
    message += `${translated || JSON.stringify(c)}\n`;
  };
  for(let k in details.codes){
    if(!details.codes.hasOwnProperty(k)) continue;
    const code = details.codes[k];
    const f = tryTranslation(k);
    message += `${f || k}:\n`;
    if(Array.isArray(code)){
      code.forEach( appendError );
    }else{
      appendError(code);
      // const translated = tryTranslation(code);
      // message += `${translated || code}\n`;
    }
  }
  return message;
}

export function extractError (err:any): any{
  let details: any;
  let message: string;
  if(
    err && err.response && err.response.data && err.response.data.error && err.response.data.statusCode !== 200
  ){
    if(err.response.data.payload){
      details = err.response.data.payload;
      message = err.response.data.payload;
    }else if(err.response.data.message){
      message = err.response.data.message;
      try{
        details = JSON.parse(message);
      }catch(_){
        return {message};
      }
    }else{
      message = tryTranslation('unknown') || 'unknown error';
    }
  }else if(err && err.payload){
    details = err.payload;
    message = err.message || JSON.stringify(err.payload);
  }else if(err.message && err.message === 'Network Error'){
    message = tryTranslation('network_error') || 'network error';
  }else{
    message = tryTranslation('unknown') || 'unknown error';
  }

  if(details){
    try{
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
      return {message};
    }
  }

  return {message};
}

function translate (details: any) {
  if(!!!details.codes) return;
  for(let k in details.codes){
    if(!details.codes.hasOwnProperty(k)) continue;
    const code = details.codes[k];
    if(Array.isArray(code)){
      code.forEach( (c, i) => {
        const translated = tryTranslation(c);
        if(translated) {
          if(!details[k]) details[k] = [];
          details[k][i] = translated
        };
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

export function readParam(search: string, param: string): string {
  const i1 = search.indexOf(param+'=');
  if(i1>-1){
    let i2 = search.indexOf('&', i1);
    if(i2===-1) i2 = search.length;
    return search.substring(i1 + param.length+1, i2);
  }

  return '';
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
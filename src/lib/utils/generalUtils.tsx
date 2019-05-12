export function msleep(n:number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

export function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractError (err:any): any{
  if(
    err && err.response && err.response.data && err.response.data.error && err.response.data.error.details &&
    err.response.data.error.name === 'ValidationError'
  ){
    const { details } = err.response.data.error;
    if(details.messages){
      const error = details.messages;
      console.log({err, error});
      return error;
    }
  }
  
  console.log({err});
  return;
} 
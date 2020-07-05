import openSocket from 'socket.io-client';
import { reaction } from 'mobx';
import { authStore } from '../store/authStore';

let socket: SocketIOClient.Socket;

const SOCKETADDRESS = process.env.REACT_APP_SOCKETADDRESS || '';

export function connectWebSocketToServer() : void{

  console.log(`connecting websocket to ${SOCKETADDRESS}`);
  socket = openSocket(SOCKETADDRESS, {
    path: process.env.REACT_APP_SOCKETPATH || '/kamand-io',
    // host: '/',
    // port: '8040',
    // reconnection: true,
    // reconnectionDelay: 1000,
    // reconnectionDelayMax : 5000,
    // reconnectionAttempts: Infinity
  });
  socket.on('failed', (payload: any) => {
    console.log('socket event: error', payload);
  });
  socket.on('connect', () => {
    connected();
  });
  socket.on('connect_error', (error: any) => {
    console.log('socket event: connect_error', error);
  });
  socket.on('connect_timeout', (timeout: any) => {
    console.log('socket event: connect_timeout', timeout);
  });
  socket.on('error', (error: any) => {
    console.log('socket event: error', error);
  });
  socket.on('reconnect', (attemptNumber: number) => {
    console.log('socket event: reconnect', attemptNumber);
  });
  socket.on('reconnect_attempt', (attemptNumber: number) => {
    console.log('socket event: reconnect_attempt', attemptNumber);
  });
  socket.on('reconnecting', (attemptNumber: number) => {
    console.log('socket event: reconnecting', attemptNumber);
  });
  socket.on('reconnect_error', (error: any) => {
    console.log('socket event: reconnect_error', error);
  });
  socket.on('reconnect_failed', () => {
    console.log('socket event: reconnect_failed');
  });
}

async function connected() {
  console.log('connected');
  authorize(authStore.token);
  reaction<string>(() => authStore.token || '', token => {
    authorize(token);
  }, {
    delay: 2000,
  });
}

async function authorize(token?: string) {
  console.log('authorizing');
  if(!socket) return;
  console.log('I have socket');
  if(token){
    console.log('I have token');
    socket.emit('authorize', token);
  }
}

export function doAsyncActData (query: string, data: any): void {
  if(!socket) {
    //TODO it should be handled properly!
    return;
  }
  socket.emit(query, data);
}

export function listenAsyncActData (query: string, callback: ((payload: any)=>void)): void {
  if(!socket) {
    //TODO it should be handled properly!
    return;
  }
  socket.off(query, callback);
  socket.on(query, callback);
}
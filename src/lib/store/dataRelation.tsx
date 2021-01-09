import { observable, action, makeObservable } from 'mobx';

export class DataRelation<T> {
  readonly data = observable.array<T>([], { deep: false });

  constructor(data: T[]){
    makeObservable(this, {
      add: action,
      remove: action,
    });

    this.data.replace(data);
  }

  add(d: T){
    this.data.push(d);
  }

  remove(index: number){
    this.data.splice(index, 1);
  }
}

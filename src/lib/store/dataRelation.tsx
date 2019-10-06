import { observable, decorate, action } from 'mobx';

export class DataRelation<T> {
  readonly data = observable.array<T>([], { deep: false });

  constructor(data: T[]){
    this.data.replace(data);
  }

  add(d: T){
    this.data.push(d);
  }

  remove(index: number){
    this.data.splice(index, 1);
  }
}
decorate(DataRelation, {
  add: action,
  remove: action,
});

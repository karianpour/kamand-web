import React, { useEffect, useContext, useRef, useState } from 'react';
import { AppStoreContext } from '../store/appStore';
import { observer } from 'mobx-react-lite';

export const FilterEditor: React.FunctionComponent<{
  EditorComponent: React.FunctionComponent<{
    value: any,
    handleChange:((e:any) => void),
  }>, filterKey: string}> = observer(({EditorComponent, filterKey}) => {
  const appStore = useContext(AppStoreContext);

  const [value, setValue] = useState('');
  const latestValue = useRef<any>(null);
  const handleChange = (e: any) => {
    const newValue = e.target.checked || e.target.value;
    // const newValue = e.target.value;
    setValue(newValue);
    appStore.setFilter(filterKey, newValue);
  };

  const newValue = appStore.getFilter(filterKey);

  useEffect(()=>{
    if(latestValue.current !== newValue){
      if(newValue!== null && newValue !== undefined){
        setValue(newValue);
      }
    }
    latestValue.current = newValue;
  }, [newValue, latestValue]);

  return <EditorComponent value={value} handleChange={handleChange}/>;
});

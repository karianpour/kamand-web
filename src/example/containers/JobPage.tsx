import React, { useEffect, useContext, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Button } from '@material-ui/core';
import { AppStoreContext, AppStore } from '../../lib/store/appStore';
import FileUpload from './FileUpload';
import { observable, makeObservable, action } from 'mobx';


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '0 10px',
    // height: 440,
    overflow: 'auto',
    '@media (min-width: 920px)':{
      marginRight: 10,
    }
  },
});

const JobPage: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  useEffect(() => {
    appStore.setPageTitle(t('pages.job'));
  }, [appStore, t]);

  const value = appStore.getActData('export-data');
  
  const handleEvent = useCallback((payload: any) => {
    handleExportDataEvent(appStore, payload);
  }, [appStore]);

  useEffect(() => {
    appStore.listenAsyncActData('export-data', handleEvent);
  }, [appStore, handleEvent]);

  const handleStart = () => {
    appStore.doAsyncActData('export-data', {step: 0});
  }

  console.log('rerender', value)

  return (
    <>
      <FileUpload/>
      <br/>
      <Paper className={classes.root}>
        {!value && <Button variant="outlined" onClick={handleStart}>{t('data.start')}</Button>}
        {value && <div>{JSON.stringify(value, null, 2)}</div>}
      </Paper>
    </>
  );

});

export default (JobPage);

function handleExportDataEvent(appStore: AppStore, payload: any){
  let actData = appStore.getActData('export-data');
  if(payload.step){
    if(!actData){
      actData = new ExportDataStore();
      actData.setStep(payload.step);
      appStore.setActData('export-data', actData);
    }else{
      actData.setStep(payload.step);
    }
  }
}

class ExportDataStore {
  step?: number;

  constructor() {
    makeObservable(this, {
      step: observable,
      setStep: action,
    });    
  }

  setStep(step: number){
    this.step = step;
  }
}

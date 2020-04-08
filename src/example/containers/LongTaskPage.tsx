import React, { useEffect, useContext, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Button } from '@material-ui/core';
import { AppStoreContext, AppStore } from '../../lib/store/appStore';
import uuidv4 from 'uuid/v4';
import { observable, decorate, action } from 'mobx';

const query = 'long-task';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '0 10px',
    height: 440,
    overflow: 'auto',
    '@media (min-width: 920px)':{
      marginRight: 10,
    }
  },
});

const LongTaskPage: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  useEffect(() => {
    appStore.setPageTitle(t('pages.longTask'));
  }, [appStore, t]);

  const value = appStore.getActData(query);
  
  const handleEvent = useCallback((payload: any) => {
    handleLongTaskEvent(appStore, payload);
  }, [appStore]);

  useEffect(() => {
    appStore.listenAsyncActData(query, handleEvent);
  }, [appStore, handleEvent]);

  useEffect(() => {
    appStore.doAsyncActData(query, {sendList: true});
  }, [appStore]);
  
  const handleStart = () => {
    const id = uuidv4();
    const title = `title ${id.substring(id.length - 6)}`
    appStore.doAsyncActData(query, {start: {id, title}});
  }

  return (
    <Paper className={classes.root}>
      {value && <Button variant="outlined" onClick={handleStart}>{t('data.start')}</Button>}
      {value?.list?.map( (longTask: any) => <LongTaskRow key={longTask.id} longTask={longTask}/>)}
    </Paper>
  );
});

export default (LongTaskPage);

const LongTaskRow: React.FunctionComponent<{longTask: any}> = observer((props) => {
  // const { t } = useTranslation();
  // const classes = useStyles();
  const { longTask } = props;
  const { id } = longTask;

  const appStore = useContext(AppStoreContext);

  useEffect(() => {
    appStore.doAsyncActData(query, {sendInitialData: {id}});
  
    return () => {
      appStore.doAsyncActData(query, {leave: { id }});
    }
  }, [appStore, id]);
    
  return (
    <div>
      {<div>{JSON.stringify(longTask, null, 2)}</div>}
    </div>
  );
});

function handleLongTaskEvent(appStore: AppStore, payload: any){
  let actData = appStore.getActData(query);
  if(!actData){
    appStore.setActData(query, new LongTaskStore());
    actData = appStore.getActData(query);
  }
  if(payload.list){
    actData.setList(payload.list);
  }else if(payload.progress){
    actData.setProgress(payload.progress);
  }
}

class LongTaskStore {
  readonly list = observable.array<any>([]);

  setList(list: any){
    this.list.clear();
    this.list.push(...list)
  }

  setProgress(progress: any){
    const { id } = progress;
    const index = this.list.findIndex( (longTask: any) => longTask.id === id);
    if(index === -1){
      this.list.push(progress);
    }else{
      this.list[index].progress = progress.progress;
      this.list[index].finishedAt = progress.finishedAt;
    }
  }
}
decorate(LongTaskStore, {
  setList: action,
  setProgress: action,
});
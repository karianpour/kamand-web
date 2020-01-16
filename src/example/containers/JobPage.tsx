import React, { useEffect, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Button } from '@material-ui/core';
import { AppStoreContext } from '../../lib/store/appStore';
import FileUpload from './FileUpload';


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

const JobPage: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  useEffect(() => {
    appStore.setPageTitle(t('pages.job'));
  }, [appStore, t]);

  const value = appStore.getActData('export-data');
  
  const handleStart = () => {
    appStore.doAsyncActData('export-data', 'export-data', {step: 0});
  }


  return (
    <Paper className={classes.root}>
      <FileUpload/>
      {!value && <Button variant="outlined" onClick={handleStart}>{t('data.start')}</Button>}
      {value && <div>{JSON.stringify(value, null, 2)}</div>}
    </Paper>
  );

});

export default (JobPage);

import React, { useContext, useEffect } from 'react';
import {
  Link,
} from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

const NotFound :  React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const appStore  = useContext(AppStoreContext);
  useEffect(()=>{
    appStore.setPageTitle(t('pages.not_found'));
  }, [appStore, t]);

  return(
    <div className={classes.list}>
      {t('pages.not_found_content')}
      <Link to="/">{t('pages.home')}</Link>
    </div>
  );

});

interface IProps {
}

export default (NotFound);

import React, { useEffect, useContext } from 'react';
import {
  Redirect,
} from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '../store/authStore';
import { AppStoreContext } from '../store/appStore';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

const LogoutPage :  React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const appStore  = useContext(AppStoreContext);
  useEffect(()=>{
    appStore.setPageTitle(t('auth.logging_out'));
  }, [appStore, t]);

  const authStore  = useContext(AuthStoreContext);

  useEffect(() => {
    authStore.clearUser();
  }, [authStore]);

  return(
    <div className={classes.list}>
      {t('auth.logging_out')}...
      {authStore.loggedin ? (null) : (
        <Redirect to="/"/>
      )}
    </div>
  );

});

interface IProps {
}

export default (LogoutPage);

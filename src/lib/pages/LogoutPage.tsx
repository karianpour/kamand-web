import React, { useEffect, useContext } from 'react';
import {
  Redirect,
} from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '../store/authStore';
import { AppStoreContext } from '../store/appStore';

import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = {
  list: {
    width: 250,
  },
};

const LogoutPage :  React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { classes } = props;

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

interface IProps extends WithStyles<typeof styles>{
}

export default withStyles(styles)(LogoutPage);

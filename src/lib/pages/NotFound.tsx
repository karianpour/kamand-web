import React, { useContext, useEffect } from 'react';
import {
  Link,
} from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  list: {
    width: 250,
  },
};

const NotFound :  React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { classes } = props;
  const appStore  = useContext(AppStoreContext);
  useEffect(()=>{
    appStore.setPageTitle(t('pages.not_found'));
  });

  return(
    <div className={classes.list}>
      {t('pages.not_found_content')}
      <Link to="/">{t('pages.home')}</Link>
    </div>
  );

});

interface IProps {
  classes: any,
}

export default withStyles(styles)(NotFound);

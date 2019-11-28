import React, { useEffect, useContext, lazy } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../lib/store/appStore';

import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Container,
} from '@material-ui/core';
import LazyLoadOnView from '../lib/components/LazyLoadOnView';

const GeneralInfo = lazy(() => import('./containers/widgets/GeneralInfo'));
const FilterList = lazy(() => import('./containers/widgets/FilterList'));
const VoucherStat = lazy(() => import('./containers/widgets/VoucherStat'));
const AccStat = lazy(() => import('./containers/widgets/AccStat'));

const useStyles = makeStyles({
  root: {
    marginBottom: 65,
  },
});

const HomePage: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const appStore = useContext(AppStoreContext);

  useEffect(() => {
    appStore.setPageTitle(t('pages.home'));
    appStore.hideAppBar(false);
  }, [appStore, t]);


  return (
    <Container maxWidth="xl" className={classes.root}>
      {/* <div style={{height: 1500, backgroundColor: 'green', border: '10px solid red'}}>scroll down</div> */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <GeneralInfo/>
        </Grid>
        <Grid item xs={12}>
          <FilterList/>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <LazyLoadOnView>
            <VoucherStat/>
          </LazyLoadOnView>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <LazyLoadOnView>
            <AccStat/>
          </LazyLoadOnView>
        </Grid>
      </Grid>
    </Container>
  );

});

interface IProps {
}

export default (HomePage);

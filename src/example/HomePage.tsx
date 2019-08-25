import React, { useEffect, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../lib/store/appStore';

import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Paper, Typography } from '@material-ui/core';
// import { secondColor, primaryColor } from '../assets/colors';


const useStyles = makeStyles({
  list: {
    overflow: 'hidden',
  },
  paperBox: {
    // width: '81.7%',
    margin: '20px 0',
    '@media(max-width:920px)':{
      margin: 10
    }
  },
  paper: {
    // width: '80%',
    margin: '20px 0',
    padding: 10,
    '@media(max-width:920px)':{
      margin: 10
    }
  },
  homeBox: {
    // borderRight: `1px solid ${secondColor}`
  },
  aboutBox: {
    // backgroundColor: primaryColor,
    // border: `1px solid ${primaryColor}`,
    borderRadius: '0 5px 5px 0',
  },
  about: {
    width: '100%'
  },
  aboutText: {
    padding: 10
  },
  logoBox: {
    marginTop: 20
  },
  listAbout: {
    padding: 10,
    margin: '20px 0',
    '@media(max-width:920px)':{
      margin: 10
    }
  },
  aboutTextAbout: {
    // color: primaryColor,
    padding: 20
  },
  logo: {
    width: 150,
    '@media(max-width:920px)':{
      width: '100%'
    }
  },
  advertismentBox:{
    margin: 10,
    '@media(min-width:920px)':{
      width: '100%',
      marginRight: 20
    }
  }
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
    <div className={classes.list}>
      <Grid container>
        <Grid item sm={12} md={9}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item sm={8}>
                <Typography align="left" gutterBottom={true} variant="h5" className={classes.aboutText}>{t('home.mainPage')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

});

interface IProps {
}

export default (HomePage);

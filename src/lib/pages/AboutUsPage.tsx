import React, { useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

const styles = {
  list: {
    overflow: 'hidden',
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
    padding: 20,
    margin: '20px 0',
    '@media(max-width:920px)': {
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
  }
};

const AboutUsPage: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { classes } = props;
  const appStore = useContext(AppStoreContext);
  useEffect(() => {
    appStore.setPageTitle(t('pages.aboutus'));
  }, [appStore, t]);

  return (
    <Paper className={classes.listAbout}>
      <Grid container>
          <Typography align="left" gutterBottom={true} variant="h5" className={classes.aboutTextAbout}>{t('about_bourse_cup.title')}</Typography>
          <Typography align="left" gutterBottom={true} variant="body1" className={classes.aboutTextAbout}>{t('about_bourse_cup.content')}</Typography>
      </Grid>
    </Paper>
  );

});

interface IProps {
  classes: any,
}

export default withStyles(styles)(AboutUsPage);

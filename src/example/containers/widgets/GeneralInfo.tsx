import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Paper,
  Grid,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { AuthStoreContext } from '../../../lib/store/authStore';
import { makeStyles, createStyles } from '@material-ui/styles';
// import { BookView } from '../components/BookSuggest';
// import { FiscalView } from '../components/FiscalSuggest';
import DataView from '../../../lib/components/DataView';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    // minHeight: 100,
    // display: 'flex',
    // flexDirection: 'column',
    padding: 10,
  },
  dataRow: {
    height: '2.5em',
    marginTop: '1.2em',
    marginBottom: '0.2em',
  },
  data: {
    marginLeft: '0.4em',
    marginRight: '0.4em',
    boxSizing: 'border-box',
  },
  bottomDivider: {
    height: '1em',
    marginTop: '0.2em',
    marginBottom: '0.2em',
  },
}));

const GeneralInfo: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const authStore = useContext(AuthStoreContext);
  const user = authStore.user;
  // const bookId = authStore.getOptionData('bookId')
  // const fiscalId = authStore.getOptionData('fiscalId')

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {user && <DataView label={t('name.label')} value={user.name} format="text"/>}
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <BookView label={t('pbl.book')} id={bookId}/>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FiscalView label={t('pbl.fiscal')} id={fiscalId} bookId={bookId}/>
        </Grid> */}
      </Grid>
    </Paper>
  )
})

interface IProps {
}

export default GeneralInfo;
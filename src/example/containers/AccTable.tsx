import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { makeStyles, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { AppStoreContext, AppStore, appStore } from '../../lib/store/appStore';
import useKamandData, { IDataOptions } from '../../lib/hooks/useKamandData';
import { AdapterLink } from '../../lib/components/misc';
import { formatDateTimeString } from '../../lib/utils/dateUtils';


const useStyles = makeStyles({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    // margin: '5px 3px',
    // overflowX: 'auto',
  },
});

const dataOptions = (appStore: AppStore): IDataOptions => ({
  key: 'acc',
  query: 'acc_list',
  queryParams: ()=>{
    return {
      code: appStore.getFilter('code'),
      name: appStore.getFilter('name'),
    }
  },
  publicQuery: false,
});

const DataFilters: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();
  const appStore = useContext(AppStoreContext);

  return (
    <Grid 
      container spacing={1}
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
    >
      <Grid item xs={3} >
        <TextField
          value={appStore.getFilter('code') || ''}
          onChange={(e: any) => appStore.setFilter('code', e.target.value)}
          label={t('data.code')}
        />
      </Grid>
      <Grid item xs={3} >
        <TextField
          value={appStore.getFilter('name') || ''}
          onChange={(e: any) => appStore.setFilter('name', e.target.value)}
          label={t('data.name')}
        />
      </Grid>
    </Grid>
  );
});

const AccTable: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { queryData, refreshHandler } = useKamandData(dataOptions(appStore));

  if(!queryData) return null;

  return (
    <Paper className={classes.root}>
      <DataFilters/>
      <Button component={AdapterLink} to={`/acc/edit/new`}><AddIcon/></Button>
      {queryData.loading && <CircularProgress/>}
      {!queryData.loading && <Button onClick={refreshHandler}><RefreshIcon/></Button>}

      {queryData.error && <p>error</p>}

      {!queryData.loading && !queryData.error && <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell padding='none' align="center">{t('data.code')}</TableCell>
            <TableCell padding='none' align="center">{t('data.name')}</TableCell>
            <TableCell padding='none' align="center">{t('data.createdAt')}</TableCell>
            <TableCell padding='none' align="center">{t('data.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queryData && queryData.data && queryData.data.map((td, index) => (
            <TableRow key={index}>
              <TableCell padding='none' component="th" scope="row">
                {td.code}
              </TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(td.name)}</TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(formatDateTimeString(td.createdAt))}</TableCell>
              <TableCell padding='none' align="center">
                <Button component={AdapterLink} to={`/acc/edit/${td.id}`}><EditIcon/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </Paper>
  );

});

interface IProps {
}

export default (AccTable);

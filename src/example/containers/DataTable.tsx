import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { withStyles, WithStyles, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import withData, { IDataOptions } from '../../lib/containers/DataProvider';
import { IQueryData } from '../../lib/store/interfaces/dataInterfaces';
import { AppStoreContext, AppStore } from '../../lib/store/appStore';


const styles = {
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    // margin: '5px 3px',
    // overflowX: 'auto',
  },
};

const dataOption: IDataOptions = {
  key: 'test',
  query: 'publicQuery',
  queryParams: (appStore: AppStore)=>{
    return {
      type_name: appStore.getFilter('type_name')
    }
  },
  publicQuery: true,
}

const DataFilters: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();
  const appStore = useContext(AppStoreContext);

  return (
    <Grid 
      container spacing={8}
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
    >
      <Grid item xs={3} >
        <TextField
          value={appStore.getFilter('type_name') || ''}
          onChange={(e: any) => appStore.setFilter('type_name', e.target.value)}
          label={t('data.type_name')}
        />
      </Grid>
    </Grid>
  );
});

const DataTable: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { classes, queryData, refreshHandler } = props;

  if(!queryData) return null;

  return (
    <Paper className={classes.root}>
      <DataFilters/>
      {queryData.loading && <CircularProgress/>}
      {!queryData.loading && <Button onClick={refreshHandler}>Refresh</Button>}

      {queryData.error && <p>error</p>}

      {!queryData.loading && !queryData.error && <Table padding='dense'>
        <TableHead>
          <TableRow>
            <TableCell padding='none' align="center">{t('data.type_name')}</TableCell>
            <TableCell padding='none' align="center">{t('data.month')}</TableCell>
            <TableCell padding='none' align="center">{t('data.count')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queryData && queryData.data && queryData.data.map((td, index) => (
            <TableRow key={index}>
              <TableCell padding='none' component="th" scope="row">
                {td.type_name}
              </TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(td.month)}</TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(td.count)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </Paper>
  );

};

interface IProps extends WithStyles<typeof styles>{
  queryData: IQueryData,
  refreshHandler: ()=>void,
}

export default withStyles(styles)(withData(DataTable, dataOption));

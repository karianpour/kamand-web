import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { makeStyles, Paper, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
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
import PrintIcon from '@material-ui/icons/Print';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { AppStoreContext, AppStore, appStore } from '../../lib/store/appStore';
import useKamandData, { IDataOptions } from '../../lib/hooks/useKamandData';
import { AdapterLink } from '../../lib/components/misc';
import { formatDateString, formatDateTimeString } from '../../lib/utils/dateUtils';


const useStyles = makeStyles({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    // margin: '5px 3px',
    // overflowX: 'auto',
  },
});

const dataOptions = (appStore: AppStore): IDataOptions => ({
  key: 'voucher',
  query: 'voucher_list',
  queryParams: ()=>{
    return {
      voucherNo: appStore.getFilter('voucherNo'),
      voucherDate: appStore.getFilter('voucherDate'),
      onlyRegistered: appStore.getFilter('onlyRegistered'),
      voucherStatus: appStore.getFilter('voucherStatus'),
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
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
          value={appStore.getFilter('voucherNo') || ''}
          onChange={(e: any) => appStore.setFilter('voucherNo', e.target.value)}
          label={t('data.voucherNo')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
          value={appStore.getFilter('voucherDate') || ''}
          onChange={(e: any) => appStore.setFilter('voucherDate', e.target.value)}
          label={t('data.voucherDate')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControlLabel
          control={<Switch 
            checked={appStore.getFilter('onlyRegistered') || false} 
            onChange={(e: any) => appStore.setFilter('onlyRegistered', e.target.checked)}
          />}
          label={t('games.onlyRegistered')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControl fullWidth>
          <InputLabel id="VoucherStatusFilter">{t('data.voucherStatus')}</InputLabel>
          <Select
            labelId="VoucherStatusFilter"
            id="VoucherStatusFilterSelect"
            value={appStore.getFilter('voucherStatus')}
            onChange={(e: any) => appStore.setFilter('voucherStatus', e.target.value)}
            >
            <MenuItem value={'current'}>{t('games.current')}</MenuItem>
            <MenuItem value={'future'}>{t('games.future')}</MenuItem>
            <MenuItem value={'latest'}>{t('games.latest')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
});

const VoucherTable: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { queryData, refreshHandler } = useKamandData(dataOptions(appStore));

  if(!queryData) return null;

  return (
    <Paper className={classes.root}>
      <DataFilters/>
      <Button component={AdapterLink} to={`/voucher/edit/new`}><AddIcon/></Button>
      {queryData.loading && <CircularProgress/>}
      {!queryData.loading && <Button onClick={refreshHandler}><RefreshIcon/></Button>}

      {queryData.error && <p>error</p>}

      {!queryData.loading && !queryData.error && <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell padding='none' align="center">{t('data.voucherNo')}</TableCell>
            <TableCell padding='none' align="center">{t('data.voucherDate')}</TableCell>
            <TableCell padding='none' align="center">{t('data.createdAt')}</TableCell>
            <TableCell padding='none' align="center">{t('data.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queryData && queryData.data && queryData.data.map((td, index) => (
            <TableRow key={index}>
              <TableCell padding='none' component="th" scope="row">
                {td.voucherNo}
              </TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(formatDateString(td.voucherDate))}</TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(formatDateTimeString(td.createdAt))}</TableCell>
              <TableCell padding='none' align="center">
                <Button component={AdapterLink} to={`/voucher/edit/${td.id}`}><EditIcon/></Button>
                <Button component={AdapterLink} to={`/voucher/print/${td.id}`}><PrintIcon/></Button>
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

export default VoucherTable;

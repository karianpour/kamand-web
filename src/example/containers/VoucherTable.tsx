import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';

import { makeStyles, Paper, FormControlLabel, Switch, MenuItem } from '@material-ui/core';
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
import { AppStore, appStore } from '../../lib/store/appStore';
import useKamandData, { IDataOptions } from '../../lib/hooks/useKamandData';
import { AdapterLink } from '../../lib/components/misc';
import { formatDateString, formatDateTimeString } from '../../lib/utils/dateUtils';
import { useSetFilter, createQueryString } from '../../lib/hooks/useSetFilters';
import { FilterEditor } from '../../lib/components/FilterEditor';


const useStyles = makeStyles({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    // margin: '5px 3px',
    // overflowX: 'auto',
  },
});

const FilterKeys = [
  'voucherNo',
  'voucherDate',
  'onlyRegistered',
  'voucherStatus',
];

const dataOptions = (appStore: AppStore): IDataOptions => ({
  query: 'voucher_list',
  queryParams: ()=>{
    return FilterKeys.reduce<{[key: string]: any}>( (r, key) => ({...r, [key]: appStore.getFilter(key)}), {});
  },
  publicQuery: false,
});

const DataFilters: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();

  return (
    <Grid 
      container spacing={1}
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
    >
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FilterEditor
          filterKey='voucherNo'
          EditorComponent={({value, handleChange}) => (
            <TextField
              value={value}
              onChange={handleChange}
              label={t('data.voucherNo')}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FilterEditor
            filterKey='voucherDate'
            EditorComponent={({value, handleChange}) => (
              <TextField
                value={value}
                onChange={handleChange}
                label={t('data.voucherDate')}
              />
            )}
          />
        </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FilterEditor
          filterKey='onlyRegistered'
          EditorComponent={({value, handleChange}) => (
            <FormControlLabel
              control={<Switch 
                checked={value || false} 
                onChange={handleChange}
              />}
              label={t('games.onlyRegistered')}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FilterEditor
          filterKey='voucherStatus'
          EditorComponent={({value, handleChange}) => (
            <TextField
              value={value}
              onChange={handleChange}
              label={t('data.voucherStatus')}
              fullWidth
              select
            >
              <MenuItem value={''}>-</MenuItem>
              <MenuItem value={'current'}>{t('games.current')}</MenuItem>
              <MenuItem value={'future'}>{t('games.future')}</MenuItem>
              <MenuItem value={'latest'}>{t('games.latest')}</MenuItem>
            </TextField>
          )}
        />
      </Grid>
    </Grid>
  );
});

const VoucherTable: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  
  useSetFilter(FilterKeys || []);

  const { queryData, refreshHandler } = useKamandData(dataOptions(appStore));


  const handleRefresh = () => {
    const params = FilterKeys.map( key => ({key, value: appStore.getFilter(key)}));
    const queryString = createQueryString(params);
    const location = `${history.location.pathname}${queryString}`;
    history.push(location);

    refreshHandler();
  }

  // if(!queryData) return null;

  return (
    <Paper className={classes.root}>
      <DataFilters/>
      <Button component={AdapterLink} to={`/voucher/edit/new`}><AddIcon/></Button>
      {queryData && <>
        {queryData.loading && <CircularProgress/>}
        {!queryData.loading && <Button onClick={handleRefresh}><RefreshIcon/></Button>}

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
      </>}
    </Paper>
  );

});

interface IProps {
}

export default VoucherTable;

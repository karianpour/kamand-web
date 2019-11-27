import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { AdapterLink } from '../../lib/components/misc';
import Button from '@material-ui/core/Button';
import ReportIcon from '@material-ui/icons/Toc';
// import { AuthStoreContext } from '../../lib/store/authStore';
// import { AppStoreContext } from '../../lib/store/appStore';

import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { format } from "d3-format";
import { AccField, AccView } from '../components/AccSuggest';
import FilteredReport, { ReportClasses, makeReportUrl } from '../../lib/containers/FilteredReport';
import { Typography } from '@material-ui/core';

const decimalFormatter = format("(,.0f");

const FilterKeys = [
  'accId',
];

const VoucherReport: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  // const appStore = useContext(AppStoreContext);
  // const authStore = useContext(AuthStoreContext);
  // const accId = appStore.getFilter('accId');

  const title = t('pages.report');

  return (
    <FilteredReport 
      query='report'
      title={title}
      filterKeys={FilterKeys}
      filters={[
        // {key: 'bookId', label: 'data.book', mandatory: true, source: 'auth'},
        {key: 'accId', label: 'data.acc', mandatory: false, source: 'app',
          editor: {
            EditorComponent: ({value, handleChange, label})=>(
              <Grid item xs={12} sm={6} lg={3} >
                <AccField
                  value={value}
                  onChange={handleChange}
                  label={label}
                  filter={{forReport: true}}
                />
              </Grid>
        )}},
      ]}
      HeaderComponent={({queryParams, classes})=>(
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography component="h1">{t('data.reportTitle')}</Typography>
            <Typography component="h3">
              {/* <BookView span label={t('data.book')} id={queryParams.bookId}/>{' '} */}
              {queryParams.accId && <AccView span label={t('data.acc')} id={queryParams.accId}/>}{' '}
            </Typography>
          </Grid>
        </Grid>
      )}
      TableComponent={({queryParams, data, classes})=>(
        <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell1} rowSpan={2}>{t('data.row')}</TableCell>
            <TableCell className={classes.headerCell1+' '+classes.cellHiddenPrint} rowSpan={2}>
              {t('data.reportRowAction')}
            </TableCell>
            <TableCell className={classes.headerCell1} colSpan={2}>{t('data.acc')}</TableCell>
            <TableCell className={classes.headerCell1} rowSpan={2}>{t('data.amount')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.headerCell2}>{t('data.code')}</TableCell>
            <TableCell className={classes.headerCell2} style={{minWidth: 200}}>{t('data.name')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data.map((td, index) => (
          <ReportRow key={td.accId} queryParams={queryParams} rowNo={index+1} data={td} classes={classes}/>
        ))}
        <ReportFooter data={data} classes={classes}/>
        </TableBody>
      </Table>
    )}
    />
  );

});

interface IProps {
}

export default (VoucherReport);

const ReportRow: React.FunctionComponent<{queryParams: any, rowNo: number, data: any, classes: ReportClasses}> = ((props) => {
  // const { t } = useTranslation();
  const {queryParams, rowNo, data, classes} = props;

  return (
    <TableRow>
      <TableCell component="th" scope="row" className={classes.cellCode}>
        {mapToFarsi(rowNo)}
      </TableCell>
      <TableCell className={classes.cellClickable+' '+classes.cellHiddenPrint}>
        {data.accId && <ReportDrillReport queryParams={queryParams} accId={data.accId}/>}
      </TableCell>
      <TableCell className={classes.cellCode}>{mapToFarsi(data.accCode)}</TableCell>
      <TableCell className={classes.cellClickable} align="left">
        {data.accName}
      </TableCell>
      <TableCell className={classes.cellNumber}>{mapToFarsi(decimalFormatter(+data.amount))}</TableCell>
    </TableRow>
  );
});

const ReportFooter: React.FunctionComponent<{data: any[], classes: ReportClasses}> = ((props) => {
  const { t } = useTranslation();
  const {data, classes} = props;

  const total = data.reduce( (r, d) => {
    r.amount += +d.amount;
    return r;
  }, 
  {
    amount: 0,
  });

  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell className={classes.cellHiddenPrint}></TableCell>
      <TableCell colSpan={2} component="th" scope="row" className={classes.cellCode}>
        {t('data.total')}
      </TableCell>
      <TableCell className={classes.cellNumber}>{mapToFarsi(decimalFormatter(total.amount))}</TableCell>
    </TableRow>
  );
});


export const ReportDrillReport: React.FunctionComponent<{queryParams: any, accId: string}> = ((props) => {
  const { queryParams, accId } = props;

  // const appStore = useContext(AppStoreContext);
  // const authStore = useContext(AuthStoreContext);
  // const bookId = authStore.getOptionData('bookId');

  const argParams: any = {accId};
  const url = makeReportUrl('/report/', FilterKeys, argParams, queryParams);

  return <Button component={AdapterLink} to={url}><ReportIcon/></Button>;
});
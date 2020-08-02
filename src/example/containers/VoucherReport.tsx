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
import { VoucherTypeField } from '../components/VoucherTypeField';
import { DateInput, BooleanInput } from '../../lib/components/inputs';
import clsx from 'clsx';
import { ISelection } from '../../lib/store/interfaces/dataInterfaces';

const decimalFormatter = format("(,.0f");

const FilterKeys = [
  'accId',
  'accIds',
  'voucherType',
  'voucherTypes',
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
                  acceptParent={true}
                  filter={{forReport: true}}
                />
              </Grid>
        )}},
        {key: 'accIds', label: 'data.accs', mandatory: false, source: 'app',
          editor: {
            EditorComponent: ({value, handleChange, label})=>(
              <Grid item xs={12} sm={6} lg={3} >
                <AccField
                  multiple
                  value={value}
                  onChange={handleChange}
                  label={label}
                  acceptParent={true}
                  filter={{forReport: true}}
                />
              </Grid>
        )}},
        {key: 'voucherType', label: 'data.voucherType', mandatory: false, source: 'app',
          editor: {
            EditorComponent: ({value, handleChange, label})=>(
              <Grid item xs={12} sm={6} lg={3} >
                <VoucherTypeField
                  value={value}
                  onChange={handleChange}
                  label={label}
                />
              </Grid>
        )}},
        {key: 'voucherTypes', label: 'data.voucherTypes', mandatory: false, source: 'app',
          editor: {
            EditorComponent: ({value, handleChange, label})=>(
              <Grid item xs={12} sm={6} lg={3} >
                <VoucherTypeField
                  multiple
                  value={value}
                  onChange={handleChange}
                  label={label}
                />
              </Grid>
        )}},
        {key: 'fromDate', label: 'pbl.fromDate', mandatory: false, source: 'app',
          editor: {
            EditorComponent: observer(({value, handleChange, label})=>{
              return (
              <Grid item xs={12} sm={6} lg={3} >
                <DateInput
                  value={value}
                  onChange={handleChange}
                  label={label}
                  fullWidth
                />
              </Grid>
              )}
        )}},
        {key: 'noHistory', label: 'pbl.noHistory', mandatory: false, source: 'app',
          editor: {
            EditorComponent: observer(({value, handleChange, label})=>{
              return (
              <Grid item xs={12} sm={6} lg={3} >
                <BooleanInput
                  value={value}
                  onChange={handleChange}
                  label={label}
                />
              </Grid>
              )}
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
      TableComponent={({queryParams, data, selection, classes})=>(
        <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell1} rowSpan={2}>{t('data.row')}</TableCell>
            <TableCell className={clsx(classes.headerCell1, classes.cellHiddenPrint)} rowSpan={2}>
              {t('data.reportRowAction')}
            </TableCell>
            <TableCell className={classes.headerCell1} colSpan={2}>{t('data.acc')}</TableCell>
            <TableCell className={classes.headerCell1} rowSpan={2}>{t('data.amount')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.headerCell2}>{t('data.code')}</TableCell>
            <TableCell className={classes.headerCell2} style={{minWidth: 200}}>{t('data.name')}</TableCell>
          </TableRow>
          <SelectionSummary data={data} selection={selection} classes={classes}/>
        </TableHead>
        <TableBody>
        {data.map((td, index) => (
          <ReportRow key={td.accId} queryParams={queryParams} rowNo={index+1} data={td} selection={selection} classes={classes}/>
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

const ReportRow: React.FunctionComponent<{queryParams: any, rowNo: number, data: any, selection: ISelection, classes: ReportClasses}> = observer((props) => {
  // const { t } = useTranslation();
  const {queryParams, rowNo, data, selection, classes} = props;

  const selected = selection.isSelected(rowNo);

  const handleClick = () => {
    selection.setSelected(rowNo, !selected);
    console.log('clicked')
  }

  const avoidClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
  }

  return (
    <TableRow className={clsx(selected && classes.selectedRow)} onClick={handleClick}>
      <TableCell component="th" scope="row" className={classes.cellCode}>
        {mapToFarsi(rowNo)}
      </TableCell>
      <TableCell className={clsx(classes.cellClickable, classes.cellHiddenPrint)} onClick={avoidClick}>
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
    <>
      <TableRow>
        <TableCell></TableCell>
        <TableCell className={classes.cellHiddenPrint}></TableCell>
        <TableCell colSpan={2} component="th" scope="row" className={classes.cellCode}>
          {t('data.total')}
        </TableCell>
        <TableCell className={classes.cellNumber}>{mapToFarsi(decimalFormatter(total.amount))}</TableCell>
      </TableRow>
      <TableRow className={clsx(classes.summarySpaceHolder, classes.cellHiddenPrint)}>&nbsp;</TableRow>
    </>
  );
});

const SelectionSummary: React.FunctionComponent<{data: any[], selection: ISelection, classes: ReportClasses}> = observer((props) => {
  const { t } = useTranslation();
  const {data, selection, classes} = props;

  const selected = selection.selected;

  const total = selected && data.reduce( (r, d, i) => {
    if(selection.isSelected(i+1)) r.amount += +d.amount;
    return r;
  }, 
  {
    amount: 0,
  });

  return (
    <TableRow className={clsx(classes.cellHiddenPrint, !selected && classes.invisible)}>
      <TableCell className={classes.summaryCell3}></TableCell>
      <TableCell className={clsx(classes.summaryCell3, classes.cellHiddenPrint)}></TableCell>
      <TableCell colSpan={2} scope="row" className={clsx(classes.summaryCell3, classes.cellCode)}>
        {t('data.total')}
      </TableCell>
      <TableCell className={clsx(classes.summaryCell3, classes.cellNumber)}>{mapToFarsi(decimalFormatter(total.amount))}</TableCell>
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
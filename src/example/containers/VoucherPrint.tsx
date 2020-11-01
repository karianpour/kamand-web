import React, { useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { 
  useHistory,
  useParams,
} from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Grid,
  Button,
  Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowForward';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import VoucherIcon from '@material-ui/icons/LibraryBooks';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../../lib/store/appStore';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { DefaultLoadingIndicator } from '../../lib/components/LazyLoadOnView';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { formatDateString } from '../../lib/utils/dateUtils';
import { format } from "d3-format";
import { useWindowSize } from '../../lib/hooks/useWindowSize';
import { calcTotalOffset } from '../../lib/utils/generalUtils';
import ReactToPrint from 'react-to-print';
import { AdapterLink } from '../../lib/components/misc';
 
const decimalFormatter = format("(,.0f");


const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginBottom: '45px',
  },
  btnContainer: {
    margin: 0,
    marginTop: 40,
  },
  backBtn: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  page: {
    flip: false,
    padding: 20,
    direction: theme.direction
  } as any,
  table: {
  },
  headerTable: {
    border: 'none',
  },
  ['@media screen']: { // eslint-disable-line no-useless-computed-key
    table: {
      minWidth: 1200,
    },
    headerTable: {
      minWidth: 1200,
      border: 'none',
    },
  },
  ['@media print']: { // eslint-disable-line no-useless-computed-key
    table: {
      maxWidth: '100%',
      width: '100%',
    },
    headerTable: {
      maxWidth: 'unset',
    },
    '@global':{
      html: {
        fontSize: '10px',
      },
    },
  },
  rowRoot: {
    marginTop: '5px',
  },
  headerCellRoot: {
    border: 'none',
  },
  cellRoot: {
    border: '1px solid black',
    padding: 6,
  },
  headerCell1: {
    position: 'sticky',
    top: 0,
    // height: '1em',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    // border: '1px solid grey',
  },
  headerCell2: {
    position: 'sticky',
    top: '2.6em',
    // height: '1em',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    // border: '1px solid grey',
  },
  cellClickable: {
    cursor: 'pointer',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5em',
  },
  cellCode: {
    flip: false,
    textAlign: 'left',
  } as any,
  cellNumber: {
    flip: false,
    textAlign: 'right',
  } as any,
}));

const VoucherPrint: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams<{id: string}>();
  const history = useHistory();
  const appStore = useContext(AppStoreContext);

  useEffect(() => {
    appStore.setPageTitle(t('pages.print'));
    appStore.hideAppBar(false);
  }, [appStore, t]);

  const key = `voucher/print/${id}`;

  const data = appStore.getActData(key);

  useEffect(() => {
    if(!data){
      appStore.loadActData(key, `/voucher/print/${id}`, {});
    }
  }, [key, id, data, appStore]);

  const handleGoBack = () => {
    history.goBack();
  }

  const total = data && data.articles && data.articles.reduce((r: any, td: any) => { 
    r.amount+=+td.amount; 
    return r;
  }, {amount: 0});

  const size = useWindowSize();
  const tableDivRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(()=>{
    if(tableDivRef.current){
      const offsetTop = calcTotalOffset(tableDivRef.current);
      const maxHeight = size.h - offsetTop - 20;
      tableDivRef.current.style.maxHeight = `${maxHeight}px`;
    }
  });

  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <Container maxWidth="xl" className={classes.root}>
      {!data && <DefaultLoadingIndicator/>}
      {data && (
        <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="flex-start" spacing={1}>
              <Grid item>
                <IconButton onClick={handleGoBack}>
                  <BackIcon/>
                </IconButton>
              </Grid>
              <Grid item>
                <Grid item><IconButton component={AdapterLink} to={`/voucher/edit/${id}`}><EditIcon/></IconButton></Grid>
              </Grid>
              <Grid item>
                <ReactToPrint
                  trigger={() => <IconButton><PrintIcon/></IconButton>}
                  content={() => componentRef.current as any}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div ref={tableDivRef} style={{overflow: 'auto', maxHeight: 300}}>
          <div ref={componentRef} className={classes.page}>
          <Table className={classes.headerTable} size="small">
            <TableBody>
              <TableRow>
                <TableCell classes={{root: classes.headerCellRoot}} align="left" style={{width: 200}}>{t('data.voucherNo')}: {mapToFarsi(data.voucherNo)}</TableCell>
                <TableCell classes={{root: classes.headerCellRoot}} className={classes.title}>{t('data.voucher')}</TableCell>
                <TableCell classes={{root: classes.headerCellRoot}} align="right" style={{width: 200}}>{data.registered ? t('data.registered') : t('data.unregistered')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell classes={{root: classes.headerCellRoot}} align="left">{t('data.refer')}: {mapToFarsi(data.refer)}</TableCell>
                <TableCell classes={{root: classes.headerCellRoot}} align="center">{'test'}</TableCell>
                <TableCell classes={{root: classes.headerCellRoot}} align="right">{mapToFarsi(formatDateString(data.date))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell classes={{root: classes.cellRoot}} className={classes.headerCell1} >{t('data.row')}</TableCell>
                <TableCell classes={{root: classes.cellRoot}} className={classes.headerCell1} colSpan={2}>{t('data.acc')}</TableCell>
                <TableCell classes={{root: classes.cellRoot}} className={classes.headerCell1} >{t('data.refer')}</TableCell>
                <TableCell classes={{root: classes.cellRoot}} className={classes.headerCell2} >{t('data.remark')}</TableCell>
                <TableCell classes={{root: classes.cellRoot}} className={classes.headerCell2} >{t('data.amount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {data.articles && data.articles.map((td: any, index: number) => 
              <VoucherRow key={td.id} rowNo={index+1} data={td}/>
            )}
            </TableBody>
            {total && 
              <TableFooter>
                <TableRow>
                  <TableCell classes={{root: classes.cellRoot}} align="left" colSpan={5}>{data.remark}</TableCell>
                  <TableCell classes={{root: classes.cellRoot}} className={classes.cellNumber}>{total.amount && mapToFarsi(decimalFormatter(+total.amount))}</TableCell>
                </TableRow>
              </TableFooter>
            }
          </Table>
          </div>
        </div>
        </React.Fragment>
      )}
    </Container>
  );
});

const VoucherRow: React.FunctionComponent<{rowNo: number, data: any}> = ((props) => {
  const {rowNo, data} = props;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell classes={{root: classes.cellRoot}} style={{width: 30 }} className={classes.cellCode}>{mapToFarsi(rowNo)}</TableCell>
      <TableCell classes={{root: classes.cellRoot}} style={{width: 50 }} className={classes.cellCode}>{mapToFarsi(data.accCode)}</TableCell>
      <TableCell classes={{root: classes.cellRoot}} style={{width: 150}} align="left">{data.accName}</TableCell>
      <TableCell classes={{root: classes.cellRoot}} style={{width: 300}} align="left">{data.refer}</TableCell>
      <TableCell classes={{root: classes.cellRoot}} style={{width: 300}} align="left">{data.remark}</TableCell>
      <TableCell classes={{root: classes.cellRoot}} style={{width: 150}} className={classes.cellNumber}>{data.amount && mapToFarsi(decimalFormatter(+data.amount))}</TableCell>
    </TableRow>
  );
});

export default VoucherPrint;

export const VoucherDrillReport: React.FunctionComponent<{id: string}> = ((props) => {
  const { t } = useTranslation();
  const { id } = props;

  const url = `/voucher/print/${id}`;

  const title = t('data.voucher');

  return <Tooltip title={title} placement="left"><Button component={AdapterLink} to={url}><VoucherIcon/></Button></Tooltip>;
});

import React, { useEffect, useContext, useLayoutEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';

import { makeStyles, Theme, createStyles } from '@material-ui/core';
import {
  ClassKeyOfStyles,
  ClassNameMap,
  Styles,
} from '@material-ui/styles/withStyles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowForward';
import { AuthStoreContext, AuthStore } from '../store/authStore';
import { AppStoreContext, AppStore } from '../store/appStore';
import useKamandData, { IDataOptions } from '../hooks/useKamandData';

import { useSetFilter } from '../hooks/useSetFilters';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../hooks/useWindowSize';
import { calcTotalOffset } from '../utils/generalUtils';

type ReportStyles =
  "root" |
  "backBtn" |
  "btnContainer" |
  "table" |
  "rowRoot" |
  "headerCell1" |
  "headerCell2" |
  "cellClickable" |
  "cellCode" |
  "cellNumber";

export type ReportClasses = ClassNameMap<ClassKeyOfStyles<Styles<Theme, {}, ReportStyles>>>;
  
const useStyles = makeStyles((theme: Theme) => createStyles<ReportStyles, {}>({
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
  table: {
    minWidth: 700,
  },
  rowRoot: {
    marginTop: '5px',
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
  cellCode: {
    flip: false,
    textAlign: 'left',
  } as any,
  cellNumber: {
    flip: false,
    textAlign: 'right',
  } as any,
}));

interface FilterEditorProps {
  value: any,
  handleChange:((e:any) => void),
  label: string,
}
interface FilterField {
  key: string,
  label: string,
  mandatory: boolean,
  source: 'auth' | 'app',
  editor?: {
    EditorComponent: React.FunctionComponent<FilterEditorProps>,
  },
}
interface ReportFiltersProps {
  filters: FilterField[],
  classes: ReportClasses,
  showReport: ()=>void,
}
const ReportFilters: React.FunctionComponent<ReportFiltersProps> = observer((props) => {
  const { t } = useTranslation();
  const { filters, classes, showReport } = props;
  const history = useHistory();
  const appStore = useContext(AppStoreContext);

  const handleChange = (key: string) => {
    return (e: any) => {
      appStore.setFilter(key, e.target.value);
      // const params = filters.map( f => ({key: f.key, value: appStore.getFilter(f.key)})).filter( f => !!f.value).map( f => `${f.key}=${f.value}`);
      // const location = `${history.location.pathname}${params.length===0?'':('?' + params.join('&'))}`;
      // history.push(location);
    }
  }

  const handleGoBack = () => {
    if(history.length > 0){
      //TODO we have to check if the back url is in reports
      history.goBack();
    }else{
      history.push('/reports');
    }
  }

  return (
    <Container className={classes.root}>
      <Divider/>
      <Grid 
        container spacing={1}
        direction="row"
        justify="flex-start"
        alignItems="flex-end"
      >
        <Grid item xs={12}>
          <Button onClick={handleGoBack} fullWidth className={classes.backBtn}>
            <ArrowBack/>
          </Button>
        </Grid>
        {filters.map( f => {
          if(!f.editor) return null;
          const { key, label, editor: { EditorComponent } } = f;
          const value = appStore.getFilter(key) || '';
          return <EditorComponent key={key} label={t(label)} value={value} handleChange={handleChange(key)}/>;
        })}
        <Grid item xs={12} container spacing={1} justify="center" className={classes.btnContainer}>
          <Grid item xs={4} sm={3}>
            <Button variant="contained" color="secondary" onClick={showReport} fullWidth>
              {t('pbl.executeReport')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

const dataOptions = (query: string, filters: FilterField[], appStore: AppStore, authStore: AuthStore): IDataOptions => {
  const valueOfFilter = ((f: FilterField): any => {
    if(f.source==='app')
      return appStore.getFilter(f.key);
    if(f.source==='auth')
      return authStore.getOptionData(f.key);
  });

  return {
    query,
    queryParams: () => filters.reduce<{[key: string]: any}>( (r, f) => ({...r, [f.key]: valueOfFilter(f)}), {}),
    publicQuery: false,
    notReady: (queryParams:any):boolean => filters.filter( f => f.mandatory ).reduce<boolean>( (r, f) => (r || !queryParams[f.key]), false),
  }
}

interface TableProps {
  queryParams: any,
  data: any[],
  classes: ReportClasses,
}
interface HeaderProps {
  queryParams: any,
  classes: ReportClasses,
}
interface IProps {
  query: string,
  title: string,
  filterKeys: string[],
  filters: FilterField[],
  TableComponent: React.FunctionComponent<TableProps>,
  HeaderComponent: React.FunctionComponent<HeaderProps>,
}
const FilteredReport: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { query, title, filterKeys, filters, TableComponent, HeaderComponent } = props;
  const classes = useStyles();
  const appStore = useContext(AppStoreContext);
  const authStore = useContext(AuthStoreContext);
  const history = useHistory();

  const tab = history.location.hash ? history.location.hash.substring(1) : 'F';

  useEffect(() => {
    appStore.setPageTitle(title);
    appStore.setOptionData('hideFab', true);
  }, [appStore, title]);

  useSetFilter(filterKeys || []);

  const showReport = ()=>{
    // history.push(`#R`);
    const options = dataOptions(query, filters, appStore, authStore);
    let queryParams: any;
    if(typeof options.queryParams==='function'){
      queryParams = options.queryParams(queryParams);
    }else{
      queryParams = options.queryParams;
    }
    const r = filters.filter( f => f.mandatory ).map( f => {
      const r = !!queryParams[f.key];
      if(!r) appStore.setSnackMessage({message: t('error.completeField', {field: f.label})});
      return r;
    }).reduce<boolean>((r, f)=> (r && f), true);
    if(r){
      const params = filters.map( f => ({key: f.key, value: appStore.getFilter(f.key)})).filter( f => !!f.value).map( f => `${f.key}=${f.value}`);
      const location = `${history.location.pathname}${params.length===0?'':('?' + params.join('&'))}#R`;
      history.push(location);
    }
  }

  const handleGoBack = () => {
    if(history.length > 0){
      //TODO we have to check if the back url is in reports
      history.goBack();
    }else{
      history.push(`#F`);
    }
  }

  return (
    <React.Fragment>
      {tab==='F' && <ReportFilters filters={filters} classes={classes} showReport={showReport}/>}
      {tab==='R' && <ReportTable query={query} filters={filters} HeaderComponent={HeaderComponent} TableComponent={TableComponent} classes={classes} handleGoBack={handleGoBack}/>}
    </React.Fragment>
  );

});

interface ReportTable {
  query: string,
  filters: FilterField[],
  classes: ReportClasses,
  TableComponent: React.FunctionComponent<TableProps>,
  HeaderComponent: React.FunctionComponent<HeaderProps>,
  handleGoBack: ()=>void,
}
const ReportTable: React.FunctionComponent<ReportTable> = observer((props) => {
  const { query, filters, TableComponent, HeaderComponent, classes, handleGoBack } = props;
  const appStore = useContext(AppStoreContext);
  const authStore = useContext(AuthStoreContext);

  const size = useWindowSize();
  const tableDivRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(()=>{
    if(tableDivRef.current){
      const offsetTop = calcTotalOffset(tableDivRef.current);
      const maxHeight = size.h - offsetTop - 20;
      tableDivRef.current.style.maxHeight = `${maxHeight}px`;
    }
  });

  const { queryData, queryParams, refreshHandler } = useKamandData(dataOptions(query, filters, appStore, authStore));

  return (
    <Container className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Button onClick={handleGoBack} fullWidth className={classes.backBtn}>
            <ArrowBack/>
          </Button>
        </Grid>
        {queryData && queryData.loading && 
        <Grid item xs={3}>
          <CircularProgress/>
        </Grid>}
        {(!queryData || !queryData.loading) && 
        <Grid item xs={3}>
          <Button onClick={refreshHandler}><RefreshIcon/></Button>
        </Grid>}
      </Grid>

      {queryData && queryData.error && <p>error</p>}

      <HeaderComponent queryParams={queryParams} classes={classes}/>

      {queryData && !queryData.loading && !queryData.error && queryData.data && (
        <div ref={tableDivRef} style={{overflow: 'auto', maxHeight: 300}}>
          <TableComponent queryParams={queryParams} data={queryData.data} classes={classes}/>
        </div>
      )}
    </Container>
  );

});

export default (FilteredReport);

export const makeReportUrl = (baseUser: string, filterKeys: string[], argParams: any, queryParams: any): string => {
  const params = filterKeys.map( f => ({key: f, value: (argParams[f] || queryParams[f])})).filter( f => !!f.value).map( f => `${f.key}=${f.value}`);
  const url = `${baseUser}${params.length===0?'':('?' + params.join('&'))}#R`;
  return url;
}

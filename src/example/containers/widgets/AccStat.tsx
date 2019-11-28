import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';
import { useTranslation } from 'react-i18next';
import { AppStoreContext } from '../../../lib/store/appStore';
// import { AuthStoreContext } from '../../../lib/store/authStore';
import { mapToFarsi } from '../../../lib/utils/farsiUtils';
import { format } from "d3-format";
import StatWidget, { StatRowDetail } from '../../../lib/containers/StatWidget';

const decimalFormatter = format("(,.0f");

const AccStat: React.FunctionComponent<{}> = observer((props) => {
  const { t } = useTranslation();

  const appStore = useContext(AppStoreContext);
  // const authStore = useContext(AuthStoreContext);
  // const bookId = authStore.getOptionData('bookId')

  const dataOptions = {
    query: 'accStat',
    queryParams: ()=>{
      return {
        level: 1,
        accId: appStore.getFilter('accId'),
      }
    },
    publicQuery: false,
  };

  return (
    <StatWidget title={t('data.accStat')} expandable={isAccExpandable} idKey={'accId'} dataOptions={dataOptions}
      RowComponent={({ data, classes, expanded }) => (
        <React.Fragment>
          <Grid item xs={1} onClick={()=>{appStore.setFilter('accId', data.accId)}}>
            <FilterIcon/>
          </Grid>
          <Grid className={classes.cellStart} item xs={4}>
            {data.accName}
          </Grid>
          <Grid className={classes.cellRight} item xs={7}>
            {mapToFarsi(decimalFormatter(+data.amount))}
          </Grid>
          {expanded && <AccDetail accId={data.accId} level={data.level+1}/>}
      </React.Fragment>
    )}
    />
  )
})

export default AccStat;

const AccDetail: React.FunctionComponent<{accId: string, level: number}> = observer((props) => {
  const appStore = useContext(AppStoreContext);
  // const authStore = useContext(AuthStoreContext);
  // const bookId = authStore.getOptionData('bookId')
  const { accId, level } = props;

  const dataOptions = {
    query: 'accStat',
    queryParams: ()=>{
      return {
        level,
        accId,
      }
    },
    publicQuery: false,
  };

  return (
    <StatRowDetail expandable={isAccExpandable} idKey='accId' dataOptions={dataOptions}
      RowComponent={({ data, classes, expanded }) => (
        <React.Fragment>
          <Grid item xs={1} onClick={()=>{appStore.setFilter('accId', data.accId)}}>
            <FilterIcon/>
          </Grid>
          <Grid className={classes.cellStart} item xs={6}>
            {data.accName}
          </Grid>
          <Grid className={classes.cellRight} item xs={5}>
            {mapToFarsi(decimalFormatter(+data.amount))}
          </Grid>
          {expanded && <AccDetail accId={data.accId} level={data.level+1}/>}
        </React.Fragment>
      )}
    />
  )
})


function isAccExpandable(data: any): boolean{
  return !data.leaf;
}


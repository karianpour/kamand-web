import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Paper,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { AppStoreContext } from '../../../lib/store/appStore';
import { AccView } from '../../components/AccSuggest';

const FilterList: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();

  const appStore = useContext(AppStoreContext);
  const accId = appStore.getFilter('accId');

  return (
    <Paper style={{backgroundColor: 'lightgrey'}}>
      <Grid container spacing={1}>
        {accId && <Grid item xs={6} sm={6} md={3} lg={3} xl={2}>
          <AccView label={t('data.acc')} id={accId} chip handleDelete={()=>{appStore.setFilter('accId')}}/>
        </Grid>}
      </Grid>
    </Paper>
  )
})

interface IProps {
}

export default FilterList;
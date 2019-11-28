import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { AppStoreContext } from '../../../lib/store/appStore';
// import { AuthStoreContext } from '../lib/store/authStore';
// import { makeStyles } from '@material-ui/styles';
import DataView from '../../../lib/components/DataView';
import StatWidget from '../../../lib/containers/StatWidget';

const VoucherStat: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();

  const appStore = useContext(AppStoreContext);
  // const authStore = useContext(AuthStoreContext);
  // const bookId = authStore.getOptionData('bookId')

  const dataOptions = {
    query: 'voucherStat',
    queryParams: ()=>{
      return {
        // bookId,
        accId: appStore.getFilter('accId'),
      }
    },
    publicQuery: false,
  };

  return (
    <StatWidget title={t('data.voucherStat')} dataOptions={dataOptions}
      RowComponent={({ data, classes }) => (
        <React.Fragment>
          <Grid item xs={12} className={classes.dataRow}>
            <Typography component="span" className={classes.data}>{t('data.unregistered')}</Typography><DataView label={t('data.qty')} value={data.unregisteredQty} format="number" inline className={classes.data}/>
          </Grid>
          <Grid item xs={12} className={classes.dataRow}>
            <Typography component="span" className={classes.data}>{t('data.registered')}</Typography><DataView label={t('data.qty')} value={data.registeredQty} format="number" inline className={classes.data}/>
          </Grid>
        </React.Fragment>
      )}
      ActionComponent={({classes})=>(
        <Grid item xs={12}>
          <Link className={classes.actionLink} to="/bkg/voucher/new">
            <Button 
              variant="contained"
              size="small"
              color="secondary"
              className={classes.actionContent}
            >
              {t('data.newVoucher')}
            </Button>
          </Link>
        </Grid>
      )}
    />
  )
})

interface IProps {
}

export default VoucherStat;
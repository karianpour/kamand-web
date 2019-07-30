import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles, WithStyles, Typography } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import VoucherTable from './VoucherTable';
import AccTable from './AccTable';


const styles = {
  root: {
    flexGrow: 1,
    margin: '0 10px',
    height: 440,
    overflow: 'auto',
    '@media (min-width: 920px)':{
      marginRight: 10,
    }
  },
};

const VoucherTab: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { classes, location: { hash } } = props;
  const defaultTab = parseInt(hash ? hash.substring(1) : '0')
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabsChange = (_: React.ChangeEvent<any>, value: number) => {
    setActiveTab(value);
    props.history.push(`#${value}`)
  }

  return (
    <Paper className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={handleTabsChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label={<Typography color="textSecondary" gutterBottom>
          {t('data.voucher')}
        </Typography>} />
        <Tab label={<Typography color="textSecondary" gutterBottom>
          {t('data.acc')}
        </Typography>} />
      </Tabs>
      
      {activeTab === 0 && <VoucherTable />}
      {activeTab === 1 && <AccTable/>}
    </Paper>
  );

});

interface IProps extends WithStyles<typeof styles>, RouteComponentProps<any>{
}

export default withStyles(styles)(VoucherTab);

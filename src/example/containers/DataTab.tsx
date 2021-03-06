import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, Typography } from '@material-ui/core';
import DataTable from './DataTableWithHook';
import DataChart from './DataChart';
import DataChartMultiCol from './DataChartMultiCol';


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '0 10px',
   height: 440,
   overflow: 'auto',
    '@media (min-width: 920px)':{
      marginRight: 10,
    }
  },
});

const DataTab: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={(event: React.ChangeEvent<any>, value) => { setActiveTab(value) }}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label={<Typography color="textSecondary" gutterBottom>
          {t('data.table')}
        </Typography>} />
        <Tab label={<Typography color="textSecondary" gutterBottom>
          {t('data.chart')}
        </Typography>} />
        <Tab label={<Typography color="textSecondary" gutterBottom>
          {t('data.chart_multi')}
        </Typography>} />
      </Tabs>
      
      {activeTab === 0 && <DataTable />}
      {activeTab === 1 && <DataChart />}
      {activeTab === 2 && <DataChartMultiCol />}
    </Paper>
  );

});

interface IProps {
}

export default (DataTab);

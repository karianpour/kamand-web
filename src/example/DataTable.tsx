import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../lib/store/appStore';

import { withStyles, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { mapToFarsi } from '../lib/utils/farsiUtils';


const styles = {
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    // margin: '5px 3px',
    // overflowX: 'auto',
  },
};

const DataTable: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { classes } = props;
  const appStore = useContext(AppStoreContext);
  const key = 'test';
  const query = 'testQuery';
  const queryParam = {testP: true};

  useEffect(()=>{
    appStore.prepareQueryData(key, query, queryParam, false);
  }, [appStore, key, query, queryParam]);

  const queryData: any[] = appStore.getQueryData(key);

  return (
    <Paper className={classes.root}>
      <Table padding='dense'>
        <TableHead>
          <TableRow>
            <TableCell padding='none' align="center">{t('data.type_name')}</TableCell>
            <TableCell padding='none' align="center">{t('data.month')}</TableCell>
            <TableCell padding='none' align="center">{t('data.count')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queryData && queryData.map((td, index) => (
            <TableRow key={index}>
              <TableCell padding='none' component="th" scope="row">
                {td.type_name}
              </TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(td.month)}</TableCell>
              <TableCell padding='none' align="center">{mapToFarsi(td.count)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>      
    </Paper>
  );

});

interface IProps {
  classes: any,
}

export default withStyles(styles)(DataTable);

import React from 'react';
import {
  Route, Link
} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import KamandApp from '../lib/KamandApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VoucherIcon from '@material-ui/icons/DataUsage';
import ReportIcon from '@material-ui/icons/List';
import JobIcon from '@material-ui/icons/CallToAction';
import LongTaskIcon from '@material-ui/icons/AvTimer';
// import DataTable from "./DataTable";
import DataTab from './containers/DataTab';
import VoucherTab from './containers/VoucherTab';
import VoucherForm from './containers/VoucherForm';
import VoucherPrint from './containers/VoucherPrint';
import VoucherReport from './containers/VoucherReport';
import JobPage from './containers/JobPage';
import LongTaskPage from './containers/LongTaskPage';
// import AccForm from './containers/AccForm';
import HomePage from './HomePage';
import Login from './Login';


const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <KamandApp
      direction="rtl"
      menus={(
        <React.Fragment>
          <Link to="/data">
            <ListItem button key='data'>
            <ListItemIcon><FavoriteIcon/></ListItemIcon>
              <ListItemText primary={t('pages.data')} />
            </ListItem>
          </Link>
          <Link to="/voucher">
            <ListItem button key='voucher'>
            <ListItemIcon><VoucherIcon/></ListItemIcon>
              <ListItemText primary={t('pages.voucher')} />
            </ListItem>
          </Link>
          <Link to="/report">
            <ListItem button key='report'>
            <ListItemIcon><ReportIcon/></ListItemIcon>
              <ListItemText primary={t('pages.report')} />
            </ListItem>
          </Link>
          <Link to="/job">
            <ListItem button key='job'>
            <ListItemIcon><JobIcon/></ListItemIcon>
              <ListItemText primary={t('pages.job')} />
            </ListItem>
          </Link>
          <Link to="/longTask">
            <ListItem button key='longTask'>
            <ListItemIcon><LongTaskIcon/></ListItemIcon>
              <ListItemText primary={t('pages.longTask')} />
            </ListItem>
          </Link>
        </React.Fragment>
      )}
      login={<Login />}
      home={HomePage}
    >
      <Route path="/data" component={DataTab} />
      <Route path="/voucher/edit/:id" component={VoucherForm} />
      <Route path="/voucher/print/:id" component={VoucherPrint} />
      {/* <Route path="/acc/edit/:id" component={AccForm} /> */}
      <Route path="/voucher" component={VoucherTab} />
      <Route path="/report" component={VoucherReport} />
      <Route path="/job" component={JobPage} />
      <Route path="/longTask" component={LongTaskPage} />
    </KamandApp>
  );
}


export default App;

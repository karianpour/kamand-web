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
// import DataTable from "./DataTable";
import DataTab from './containers/DataTab';
import VoucherTab from './containers/VoucherTab';
import VoucherForm from './containers/VoucherForm';
// import AccForm from './containers/AccForm';
import HomePage from './HomePage';
import Login from './Login';


const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <KamandApp
      direction="ltr"
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
        </React.Fragment>
      )}
      login={<Login />}
      home={HomePage}
    >
      <Route path="/data" component={DataTab} />
      <Route path="/voucher/edit/:id" component={VoucherForm} />
      {/* <Route path="/acc/edit/:id" component={AccForm} /> */}
      <Route path="/voucher" component={VoucherTab} />
    </KamandApp>
  );
}


export default App;

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
// import DataTable from "./DataTable";
import DataTab from './containers/DataTab';


const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <KamandApp menus={(
      <React.Fragment>
        <Link to="/data">
          <ListItem button key='data'>
          <ListItemIcon><FavoriteIcon /></ListItemIcon>
            <ListItemText primary={t('pages.data')} />
          </ListItem>
        </Link>
      </React.Fragment>
    )}>
      <Route path="/data" component={DataTab} />
    </KamandApp>
  );
}


export default App;

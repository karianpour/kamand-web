import React, { useContext, useState, ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  RouteComponentProps,
} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ExitIcon from '@material-ui/icons/ExitToApp';
// import PublicIcon from '@material-ui/icons/Public';


import { AuthStoreContext } from '../store/authStore';
import { AppStoreContext } from '../store/appStore';
import NotFound from './NotFound';
import LogoutPage from './LogoutPage';
import PageTitle from '../containers/PageTitle';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  root: {
    flexGrow: 1,
  },
  logoBox: {
    height: 60,
    marginTop: 5
  },
  content: {
    padding: 20,
    // '@media(max-width:920px)':{
    //   padding: 5,
    // }
  },
});


const Scaffold: React.FunctionComponent<IProps> = observer((props) => {
  const [sideMenu, setSideMenu] = useState(false);
  const { t } = useTranslation();
  // const authStore = useContext(AuthStoreContext);
  const authStore = useContext(AuthStoreContext);
  const appStore = useContext(AppStoreContext);
  const { appBarHidden } = appStore;
  const classes = useStyles();
  // const { user } = authStore;

  return (
    <Router>
      <div dir="rtl" className="App">
        {appBarHidden ? null : (
          <React.Fragment>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton color="inherit" aria-label="Menu" onClick={() => setSideMenu(true)}>
                  <MenuIcon />
                </IconButton>
                <p></p>
                <PageTitle variant="h6" color="inherit" />
                {/* <Button color="inherit">{t('auth.login')}</Button> */}
                <div className={classes.logoBox}></div>
              </Toolbar>
            </AppBar>
            <div style={{height: 64}}></div>
          </React.Fragment>
        )}
        <Drawer anchor="left" open={sideMenu} onClose={() => setSideMenu(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={() => setSideMenu(false)}
            onKeyDown={() => setSideMenu(false)}
            className={classes.list}
          >
            <List>
              <Link to="/">
                <ListItem button key='home'>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary={t('pages.home')} />
                </ListItem>
              </Link>
              <Divider />
              <Link to="/logout">
                <ListItem button key='logout'>
                  <ListItemIcon><ExitIcon /></ListItemIcon>
                  <ListItemText primary={t('auth.logout')} />
                </ListItem>
              </Link>
              <Divider />
              {props.menus}
            </List>
            <Divider />
          </div>
        </Drawer>
        <div className={classes.content}>
          {authStore.loggedin || !props.login ? null: props.login}
          <Switch>
            {props.home && <Route exact path="/" component={props.home} />}
            <Route path="/logout" component={LogoutPage} />
            {props.children}
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
});

interface IProps {
  menus?: ReactNode,
  login?: ReactNode,
  home?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
  children?: ReactNode,
}

export default (Scaffold);
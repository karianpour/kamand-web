import React, { Suspense, ReactNode } from 'react';
import {
  RouteComponentProps,
} from "react-router-dom";
import './KamandApp.css';
import Scaffold from './pages/Scaffold';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, createGenerateClassName, jssPreset } from '@material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Notifier from './Notifier';
import './translations/i18n';

const theme = createMuiTheme({
  direction: 'rtl',
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Nahid',
    ].join(','),
  },  
});

// @ts-ignore
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const generateClassName = createGenerateClassName();

const KamandApp: React.FC<IProps> = (props) => {
  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <Notifier/>
        <Suspense fallback={<Loader />}>
          <Scaffold menus={props.menus} login={props.login} home={props.home}>
            {props.children}
          </Scaffold>
        </Suspense>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);

interface IProps {
  menus?: ReactNode,
  login?: ReactNode,
  home?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
  children?: ReactNode,
  translation?: any,
}

export default KamandApp;

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
import { DefaultLoadingIndicator } from './components/LazyLoadOnView';

const KamandApp: React.FC<IProps> = (props) => {
  const theme = createMuiTheme({
    direction: props.direction || 'rtl',
    typography: {
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        'Nahid',
      ].join(','),
    },  
  });
  
  // @ts-ignore
  const jss = (props.direction || 'rtl') === 'rtl' ? {jss: create({ plugins: [...jssPreset().plugins, rtl()] })} : undefined;

  const generateClassName = createGenerateClassName();

  return (
    <StylesProvider {...jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <Notifier/>
        <Suspense fallback={<DefaultLoadingIndicator />}>
          <Scaffold direction={props.direction} menus={props.menus} login={props.login} home={props.home}>
            {props.children}
          </Scaffold>
        </Suspense>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

interface IProps {
  direction?: 'rtl' | 'ltr',
  menus?: ReactNode,
  login?: ReactNode,
  home?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
  children?: ReactNode,
  translation?: any,
}

export default KamandApp;

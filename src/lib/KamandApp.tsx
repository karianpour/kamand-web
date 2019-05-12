import React, { Suspense, ReactNode } from 'react';
import './KamandApp.css';
import Scaffold from './pages/Scaffold';
import { create } from 'jss';
import rtl from 'jss-rtl';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Notifier from './Notifier';
import './translations/i18n';

const theme = createMuiTheme({
  direction: 'rtl',
  typography: {
    useNextVariants: true,
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
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <Notifier/>
        <Suspense fallback={<Loader />}>
          <Scaffold menus={props.menus}>
            {props.children}
          </Scaffold>
        </Suspense>
      </MuiThemeProvider>
    </JssProvider>
  );
}

const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);

interface IProps {
  menus?: ReactNode,
  children?: ReactNode,
  translation?: any,
}

export default KamandApp;

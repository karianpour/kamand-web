import React, { useContext } from 'react';
// import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from './store/appStore';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme=>({
  close: {
    padding: theme.spacing(0.5),
  },
}));

const Notifier: React.FunctionComponent<IProps> = observer((props) => {
  const appStore = useContext(AppStoreContext);

  const { snackMessage } = appStore;
// console.log(`render in notifier with `, snackMessage)

  // const { t } = useTranslation();
  const classes = useStyles();

  const hide = () => {
    appStore.setSnackMessage(undefined);
  };

  if(!snackMessage){
    return null;
  }

  return (
    <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={true}
        autoHideDuration={6000}
        onClose={hide}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={snackMessage.message}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={hide}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
  );
});

interface IProps {
}

export default (Notifier);

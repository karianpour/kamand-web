import React, { useContext } from 'react';
// import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from './store/appStore';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme:Theme) => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

const Notifier: React.FunctionComponent<IProps> = observer((props) => {
  const appStore = useContext(AppStoreContext);

  const { snackMessage } = appStore;
// console.log(`render in notifier with `, snackMessage)
  if(!snackMessage){
    return null;
  }

  // const { t } = useTranslation();
  const { classes } = props;

  const hide = () => {
    appStore.setSnackMessage(undefined);
  };

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
  classes: any,
}

export default withStyles(styles)(Notifier);

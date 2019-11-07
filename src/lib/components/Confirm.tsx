import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';
// import Slide from '@material-ui/core/Slide';

// const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

interface IProps {
  title: string,
  content: string,
  closeCallback: ()=>void,
  doCallback: ()=>void,
}

export const ConfirmDialog: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();

  const handleClose = () => {
    props.closeCallback();
  };

  const handleDo = () => {
    props.closeCallback();
    props.doCallback();
  };

  return (
    <React.Fragment>
      <Dialog
        open
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('dialog.delete.disagree')}
          </Button>
          <Button onClick={handleDo} color="primary">
            {t('dialog.delete.agree')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
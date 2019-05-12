import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import Typography from '@material-ui/core/Typography';

const PageTitle :  React.FunctionComponent<any> = observer((props) => {
  const appStore  = useContext(AppStoreContext);

  return(
    <Typography {...props}>
      {appStore.pageTitle}
    </Typography>
  );

});

export default PageTitle;

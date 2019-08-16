import React, { useContext } from 'react';
import { Formik, FormikActions, Form, Field } from 'formik';
import {TextWidget, NumberWidget} from '../lib/components/widgets';

import {
  Grid,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '../lib/store/authStore';


import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  titleBox: {
    padding: '8px 16px',
    marginBottom: 25,
    borderRadius: 3,
  },
  marginBtn: {
    marginTop: 20
  },
  loginInput: {
    width: '100%',
    minHeight: 290,
    margin: '3px 0'
  },
  marginInput: {
    marginTop: 15
  },
  loginBox: {
    padding: '60px 40px',
    margin: '15px auto',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    width: '70%',
    '@media(max-width: 920px)':{
      padding: 20,
      width: 'auto',
    }
  },
  btnBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  forgetBtn: {
    margin: '20px 0 0'
  }
});

interface Values {
  mobileNumber: string;
  password: string;
}

const Login: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const authStore = useContext(AuthStoreContext);

  const onSubmit = async (values: Values, actions: FormikActions<Values>) => {
    // actions.setSubmitting(true);
    try {
      await authStore.login(values.mobileNumber, values.password);
    } catch (err) {
      //TODO if we get connection error we have to show a proper message 
      actions.setErrors(err);
    }finally{
      actions.setSubmitting(false);
    }
  };

  const validate = (values: Values) => {
    const errors: any = {};
    if (!values.mobileNumber) {
      errors.mobileNumber = t('messages.required');
    }
    if (!values.password) {
      errors.password = t('messages.required');
    }
    return errors;
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ mobileNumber: '', password: '' }}
      validate={validate}
      render={({ dirty, isSubmitting, handleReset }) => (
        <Form className={classes.loginBox}>
          <Grid container spacing={1}>
            <div className={classes.loginInput}>
              <Grid item xs={12}>
                <Field name="mobileNumber" label={t('auth.mobileNumber')} fullWidth component={NumberWidget} placeholder={'0912*******'} inputProps={{type:'tel', maxLength: 12}}/>
              </Grid>
              <Grid item xs={12} className={classes.marginInput}>
                <Field name="password" label={t('auth.password')} fullWidth component={TextWidget} type="password"/>
              </Grid>
            </div>
            <Grid container spacing={1} className={classes.btnBox}>
              <Grid sm={8} item>
                <Button
                  style={{ width: '100%' }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {t('buttons.submit')}
                </Button>
              </Grid>
              <Grid sm={4} item>
                <Button
                  style={{ width: '100%' }}
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={handleReset}
                  disabled={isSubmitting || !dirty}
                >
                  {t('buttons.reset')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    />
  );
});

interface IProps {
}

export default (Login);

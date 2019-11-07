import React, { useContext } from 'react';
import {TextKamandField, NumberKamandField} from '../lib/components/Fields';

import {
  Grid,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '../lib/store/authStore';


import { makeStyles } from '@material-ui/styles';
import { useKamandForm, FormSubmitResult } from '../lib/hooks/useKamandForm';

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

  const handleSubmit = async (values: Values): Promise<FormSubmitResult<Values>>  => {
    try {
      await authStore.login(values.mobileNumber, values.password);
      return {}
    } catch (errors) {
      return {
        errors,
      }
    }
  };

  const validate = async (values: Values) => {
    const errors: any = {};
    if (!values.mobileNumber) {
      errors.mobileNumber = t('messages.required');
    }
    if (!values.password) {
      errors.password = t('messages.required');
    }
    return errors;
  };


  const form = useKamandForm<Values>({
    submit: handleSubmit,
    initialValues: { mobileNumber: '', password: '' },
    validate: validate,
  });

  return (
    <div className={classes.loginBox}>
      <Grid container spacing={1}>
        <div className={classes.loginInput}>
          <Grid item xs={12}>
            <NumberKamandField {...form.getFieldProps('mobileNumber')} label={t('auth.mobileNumber')} fullWidth placeholder={'0912*******'} inputProps={{type:'tel', maxLength: 12}}/>
          </Grid>
          <Grid item xs={12} className={classes.marginInput}>
            <TextKamandField {...form.getFieldProps('password')} label={t('auth.password')} fullWidth type="password"/>
          </Grid>
        </div>
        <Grid container spacing={1} className={classes.btnBox}>
          <Grid sm={8} item>
            <Button
              style={{ width: '100%' }}
              type="button"
              variant="contained"
              color="primary"
              onClick={form.submitForm}
              disabled={form.isSubmitting()}
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
              onClick={form.resetForm}
              disabled={form.isSubmitting() || !form.isDirty()}
            >
              {t('buttons.reset')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});

interface IProps {
}

export default (Login);

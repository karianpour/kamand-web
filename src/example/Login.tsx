import React, { useContext, useState } from 'react';
import {TextKamandField, NumberKamandField} from '../lib/components/Fields';

import {
  Grid,
  Button,
  Box,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '../lib/store/authStore';


import { makeStyles } from '@material-ui/styles';
import { useKamandForm, FormSubmitResult } from '../lib/hooks/useKamandForm';

const useStyles = makeStyles({
  loginBox: {
    padding: '60px 40px',
    margin: '15px auto',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    width: '70%',
    '@media(max-width: 920px)':{
      padding: 20,
      width: 'auto',
    },
  },
  btnBox: {
    marginTop: 16,
    marginBottom: 24,
    // display: 'flex',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
  },
});

interface Values {
  mobileNumber: string;
  password: string;
}

const Login: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const authStore = useContext(AuthStoreContext);
  const [ forgot, setForgot ] = useState<boolean>(false);

  const handleSubmit = async (values: Values): Promise<FormSubmitResult<Values>>  => {
    try {
      if(!forgot){
        await authStore.login(values.mobileNumber, values.password);
      }else{
        await authStore.forgot(values.mobileNumber);
        setForgot(false);
      }
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
    if (!forgot && !values.password) {
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
    <Grid container spacing={1} className={classes.loginBox}>
      <Grid item xs={12}>
        <NumberKamandField {...form.getFieldProps('mobileNumber')} label={t('auth.mobileNumber')} fullWidth placeholder={'0912*******'} inputProps={{type:'tel', maxLength: 12, style: {textAlign: 'right' as any}}}/>
      </Grid>
      <Grid item xs={12}>
        {!forgot && <TextKamandField {...form.getFieldProps('password')} label={t('auth.password')} fullWidth type="password"/>}
        {forgot && <Box height={48}/>}
      </Grid>
      <Grid xs={12} item>
        <Box height={24}/>
      </Grid>
      <Grid xs={8} item>
        <Button
          fullWidth
          type="button"
          variant="contained"
          color="primary"
          onClick={form.submitForm}
          disabled={form.isSubmitting()}
        >
          {t('buttons.submit')}
        </Button>
      </Grid>
      <Grid xs={4} item>
        <Button
          fullWidth
          type="button"
          color="primary"
          variant="contained"
          onClick={form.resetForm}
          disabled={form.isSubmitting() || !form.isDirty()}
        >
          {t('buttons.reset')}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid xs={12} item>
          <Button
            type="button"
            fullWidth
            color="primary"
            variant="outlined"
            onClick={() => setForgot(!forgot)}
            disabled={form.isSubmitting()}
          >
            {forgot ? t('auth.remembered') : t('auth.forgot')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
});

interface IProps {
}

export default (Login);

import React, { useContext, useEffect, useState } from 'react';
import {
  RouteComponentProps
} from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
import { TextKamandField, DecimalKamandField, NumberKamandField, SelectKamandField, BooleanKamandField, DateTimeKamandField, DateKamandField } from '../../lib/components/Fields';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBack from '@material-ui/icons/ArrowBack';
import {
  Grid,
  Button,
  Paper,
  FormHelperText,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../../lib/store/appStore';
import { makeStyles } from '@material-ui/styles';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { AccField } from '../components/AccSuggest';
import uuidv4 from 'uuid/v4';
import { useKamandForm, KamandForm, FormSubmitResult } from '../../lib/hooks/useKamandForm';
import { DefaultLoadingIndicator } from '../../lib/components/LazyLoadOnView';
import { VoucherTypeField } from '../components/VoucherTypeField';


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
    padding: 16,
    margin: '15px auto',
    width: '70%',
    '@media (max-width: 920px)': {
      width: 'auto'
    }
  },
  btnBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  forgetBtn: {
    margin: '20px 0 0'
  },
  cells: {
    padding: '0px 10px'
  },
  root: {
    padding: 20,
  },
  input: {
    margin: '10px 0'
  },
  spaceBox: {
    borderTop: '3px solid #3f51b5',
    margin: '30px 0',
    padding: '20px 0',
  },
  backBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  }
});

interface Values {
  id: string,
  voucherNo?: string,
  voucherDate?: string,
  accId?: string,
  registered?: boolean,
  amount?: number,
  remark?: string,
  createdAt?: string,
  voucherType?: '' | 'normal' | 'special',
  articles: {
    id: string,
    articleNo?: string,
    articleDate?: string,
    accId?: string,
    registered?: boolean,
    amount?: number,
    remark?: string,
    createdAt?: string,
    voucherType?: '' | 'normal' | 'special',
  }[],
}

const validationFunction = (t: (k: string) => string) => async (values: Values) => {
  const errors: any = {};
  if (!values.id) {
    errors.id = t('error.required');
  }
  return errors;
}

const VoucherForm: React.FunctionComponent<IProps> = observer((props) => {
  const { t } = useTranslation();
  const { match: { params: { id } }, location: { hash } } = props;
  const defaultTab = parseInt(hash ? hash.substring(1) : '0')
  const [activeTab, setActiveTab] = useState(defaultTab);
  const appStore = useContext(AppStoreContext);
  const classes = useStyles();

  useEffect(() => {
    appStore.setPageTitle(t('pages.voucher'));
  }, [appStore, t]);
  // const id = '837c662f-0f07-4a91-a407-bae9e98639f6';

  const key = `voucher/${id}`;

  const data = appStore.getActData(key);

  // console.log({ key, id, data, props });

  useEffect(() => {
    if (id === 'new') {
      const values: Values = {
        id: uuidv4(),
        voucherNo: undefined,
        voucherDate: undefined,
        accId: undefined,
        registered: false,
        amount: undefined,
        remark: undefined,
        createdAt: undefined,
        voucherType: undefined,
        articles: [],
      };
      appStore.setActData(key, values);
    } else {
      appStore.loadActData(key, `/voucher/${id}`, {});
    }
  }, [key, id, appStore]);

  const handleSubmit = async (values: Values): Promise<FormSubmitResult<Values>> => {
    try {
      await appStore.saveActData(key, `/voucher/${values.id}`, values);
      appStore.setSnackMessage({message: t('info.succeed')});
      // console.log(values)
      return {}
    } catch (errors) {
      console.log({errors})
      if(errors.message){
        appStore.setSnackMessage(errors);
      }
      return {errors};
    }
  };

  const validate = validationFunction(t);

  const handleTabsChange = (_: React.ChangeEvent<any>, value: number) => {
    setActiveTab(value);
    props.history.replace(`#${value}`)
  }

  const form = useKamandForm<Values>({
    submit: handleSubmit,
    initialValues: data,
    validate: validate,
  });

  if (!form.values) {
    return <DefaultLoadingIndicator/>;
  }

  const formHelperText = form.getHelperText('');

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Button onClick={()=>  props.history.goBack()} className={classes.backBtn}>
          <ArrowBack/>
        </Button>
        <Grid item xs={12}>
          <TextKamandField {...form.getFieldProps('id')} className={classes.input} label={t('data.id')} fullWidth inputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextKamandField {...form.getFieldProps('refer')} className={classes.input} label={t('data.refer')} fullWidth />
        </Grid>

        <Grid className={classes.spaceBox} item xs={12}>
          <Tabs
            value={activeTab}
            onChange={handleTabsChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label={<Typography color="textSecondary" gutterBottom>
              {t('data.mainTab')}
            </Typography>} />
            <Tab label={<Typography color="textSecondary" gutterBottom>
              {t('data.articles')}
            </Typography>} />
          </Tabs>

          {activeTab === 0 && <MainTab form={form} />}
          {activeTab === 1 && <ArticleTab form={form} />}
        </Grid>
        {formHelperText && 
          <Grid xs={12} item>
            <FormHelperText error>
              formHelperText
            </FormHelperText>
          </Grid>
        }
        <Grid sm={8} item>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="button"
            onClick={form.submitForm}
            disabled={form.isSubmitting()}
          >
            {t('data.submit')}
          </Button>
        </Grid>
        <Grid sm={4} item>
          <Button
            fullWidth
            type="button"
            color="primary"
            variant="contained"
            onClick={form.resetForm}
            disabled={!form.isDirty() || form.isSubmitting()}
          >
            {t('data.reset')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
});

interface MatchParams {
  id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {
}

export default (VoucherForm);

const MainTab: React.FunctionComponent<{form: KamandForm<Values>}> = (props) => {
  const { t } = useTranslation();
  const { form } = props;

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextKamandField {...form.getFieldProps('voucherNo')} fullWidth label={t('data.voucherNo')} inputProps={{ maxLength: 4 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DateKamandField {...form.getFieldProps('voucherDate')} fullWidth label={t('data.voucherDate')} />
        </Grid>
        <Grid item xs={12}>
          <AccField {...form.getFieldProps('accId')} fullWidth label={t('data.accSuggest')} addNew/>
        </Grid>
        <Grid item xs={12}>
          <VoucherTypeField {...form.getFieldProps('voucherType')} label={t('data.voucherType')} fullWidth/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <DecimalKamandField {...form.getFieldProps('amount')} fullWidth label={t('data.amount')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DateTimeKamandField {...form.getFieldProps('createdAt')} fullWidth label={t('data.createdAt')} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <BooleanKamandField {...form.getFieldProps('registered')} label={t('data.registered')} inputProps={{color:"primary"}} />
      </Grid>
      <Grid item xs={12}>
        <TextKamandField {...form.getFieldProps('remark')} label={t('data.remark')} fullWidth margin="normal" />
      </Grid>
    </React.Fragment>
  )
};


const useArticleTabStyles = makeStyles({
  table:{
    minWidth: 1900,
  },
  tableContainer: {
    overflow: 'auto',
  },
  cells: {
    padding: '0px 10px'
  },
});

interface IArticleTabProps {
  form: KamandForm<Values>,
}

const ArticleTab: React.FunctionComponent<IArticleTabProps> = (props) => {
  const { t } = useTranslation();
  const { form } = props;

  const classes = useArticleTabStyles();

  //articles
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="outlined" color="primary"
            onClick={() => form.setFieldValue(`articles[${form.values.articles.length}]`, {
              id: uuidv4(),
              articleNo: undefined,
              articleDate: undefined,
              accId: undefined,
              registered: false,
              amount: undefined,
              remark: undefined,
              createdAt: undefined,
              voucherType: undefined,
            })}
          >
            <AddIcon />
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.tableContainer}>
          <Table padding='default' className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.row')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.articleNo')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.articleDate')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.acc')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.voucherType')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.registered')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.amount')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.refer')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.remark')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">{t('data.createdAt')}</TableCell>
                <TableCell className={classes.cells} padding='none' align="center">&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.values.articles && form.values.articles.map((td: any, index: number) => (
                <TableRow key={index} selected={false} hover={true}>
                  <TableCell style={{width:20}} className={classes.cells} padding='none' component="th" scope="row">
                    {mapToFarsi(index + 1)}
                  </TableCell>
                  <TableCell style={{width:30}} className={classes.cells} padding='none' align="center">
                    <NumberKamandField {...form.getFieldProps(`articles.${index}.articleNo`)} inputProps={{ maxLength: 1 }} />
                  </TableCell>
                  <TableCell style={{width:60}} className={classes.cells} padding='none' align="center">
                    <DateKamandField {...form.getFieldProps(`articles.${index}.articleDate`)} />
                  </TableCell>
                  <TableCell style={{minWidth:120}} className={classes.cells} padding='none' align="center">
                    <AccField {...form.getFieldProps(`articles.${index}.accId`)} placeholder={t('data.accSuggest')} fullWidth margin="normal" addNew/>
                  </TableCell>
                  <TableCell style={{minWidth:80}} className={classes.cells} padding='none' align="center">
                    <SelectKamandField {...form.getFieldProps(`articles.${index}.voucherType`)} placeholder={t('data.voucherType')} fullWidth>
                      <MenuItem value="">
                        <em>-</em>
                      </MenuItem>
                      <MenuItem value="normal">{t('data.normal')}</MenuItem>
                      <MenuItem value="special">{t('data.special')}</MenuItem>
                    </SelectKamandField>
                  </TableCell>
                  <TableCell style={{width:30}} className={classes.cells} padding='none' align="center">
                    <BooleanKamandField {...form.getFieldProps(`articles.${index}.registered`)} /> 
                    {/* inputProps={{margin:"normal"}}  */}
                  </TableCell>
                  <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                    <DecimalKamandField {...form.getFieldProps(`articles.${index}.amount`)} inputProps={{ maxLength: 1 }} />
                  </TableCell>
                  <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                    <TextKamandField {...form.getFieldProps(`articles.${index}.refer`)} fullWidth margin="normal" />
                  </TableCell>
                  <TableCell style={{minWidth:120}} className={classes.cells} padding='none' align="center">
                    <TextKamandField {...form.getFieldProps(`articles.${index}.remark`)} fullWidth margin="normal" multiline={true} rowsMax={4} />
                  </TableCell>
                  <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                    <DateTimeKamandField {...form.getFieldProps(`articles.${index}.createdAt`)} fullWidth margin="normal" />
                  </TableCell>
                  <TableCell className={classes.cells} padding='none' align="center">
                    <Button
                      variant="outlined" color="secondary"
                      onClick={() => form.removeFromArray(`articles`, index)}
                    >
                      <RemoveIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};


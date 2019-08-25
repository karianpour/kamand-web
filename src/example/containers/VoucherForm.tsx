import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  RouteComponentProps
} from "react-router-dom";
import { Formik, FormikActions, Form, FastField, FieldArray } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import { TextWidget, DecimalWidget, NumberWidget, SelectWidget, BooleanWidget, DateTimeWidget, DateWidget } from '../../lib/components/widgets';

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
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../../lib/store/appStore';
import { makeStyles } from '@material-ui/styles';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { AccSuggestWidget } from '../components/AccSuggest';
import uuidv4 from 'uuid/v4';


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

const validationFunction = (t: (k: string) => string) => (values: Values) => {
  const errors: any = {};
  if (!values.id) {
    errors.id = t('error.required');
  }
  return errors;
}

const GameForm: React.FunctionComponent<IProps> = observer((props) => {
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

  const key = useRef(`game/${id}`);

  const data = appStore.getActData(key.current);

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
      appStore.setActData(key.current, values);
    } else {
      appStore.loadActData(key.current, `/voucher/${id}`, {});
    }
  }, [key, id, appStore]);

  const onSubmit = async (values: Values, actions: FormikActions<Values>) => {
    try {
      await appStore.saveActData(key.current, `/voucher/${values.id}`, values);
      appStore.setSnackMessage({message: t('info.succeed')});
      // console.log(values)
    } catch (err) {
      //TODO if we get connection error we have to show a proper message 
      console.log({err})
      if(err.message){
        appStore.setSnackMessage(err);
      }
      actions.setErrors(err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const validate = validationFunction(t);

  const handleTabsChange = (_: React.ChangeEvent<any>, value: number) => {
    setActiveTab(value);
    props.history.replace(`#${value}`)
  }

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={data}
      validate={validate}
      render={({ dirty, isSubmitting, handleReset, values }) => (
        <Form className={classes.loginBox}>
          {/* Prevent implicit submission of the form */}
          <button type="submit" disabled style={{display: 'none'}} aria-hidden="true"></button>
          <Paper className={classes.root}>
            <Grid container spacing={3}>
              <Button onClick={()=>  props.history.goBack()} className={classes.backBtn}>
                <ArrowBack/>
              </Button>
              <Grid item xs={12}>
                <FastField className={classes.input} name="id" label={t('data.id')} fullWidth readOnly component={TextWidget} inputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12}>
                <FastField className={classes.input} name="refer" label={t('data.refer')} fullWidth component={TextWidget} />
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

                {activeTab === 0 && <MainTab />}
                {activeTab === 1 && <ArticleTab values={values} />}
              </Grid>
              <Grid sm={8} item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
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
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  {t('data.reset')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    />
  );
});

interface MatchParams {
  id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {
}

export default (GameForm);

const MainTab: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FastField fullWidth name="voucherNo" label={t('data.voucherNo')} component={TextWidget} inputProps={{ maxLength: 4 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FastField fullWidth name="voucherDate" label={t('data.voucherDate')} component={DateWidget} />
        </Grid>
        <Grid item xs={12}>
          <FastField fullWidth name="accId" label={t('data.accSuggest')} component={AccSuggestWidget} />
        </Grid>
        <Grid item xs={12}>
          <FastField name="voucherType" label={t('data.voucherType')} fullWidth component={SelectWidget}>
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
            <MenuItem value="normal">{t('data.normal')}</MenuItem>
            <MenuItem value="special">{t('data.special')}</MenuItem>
          </FastField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FastField fullWidth name="amount" label={t('data.amount')} component={DecimalWidget} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FastField fullWidth name="createdAt" label={t('data.createdAt')} component={DateTimeWidget} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FastField name="registered" label={t('data.registered')} color="primary" component={BooleanWidget} />
      </Grid>
      <Grid item xs={12}>
        <FastField name="remark" label={t('data.remark')} fullWidth component={TextWidget} margin="normal" />
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
  values: any,
}

const ArticleTab: React.FunctionComponent<IArticleTabProps> = (props) => {
  const { t } = useTranslation();
  const { values } = props;

  const classes = useArticleTabStyles();


  return (
    <React.Fragment>
      <FieldArray name="articles"
        render={arrayHelpers => (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="outlined" color="primary"
                onClick={() => arrayHelpers.push({ 
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
                  {values.articles && values.articles.map((td: any, index: number) => (
                    <TableRow key={index} selected={false} hover={true}>
                      <TableCell style={{width:20}} className={classes.cells} padding='none' component="th" scope="row">
                        {mapToFarsi(index + 1)}
                      </TableCell>
                      <TableCell style={{width:30}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.articleNo`} component={NumberWidget} inputProps={{ maxLength: 1 }} />
                      </TableCell>
                      <TableCell style={{width:60}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.articleDate`} component={DateWidget} />
                      </TableCell>
                      <TableCell style={{minWidth:120}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.accId`} placeholder={t('data.accSuggest')} fullWidth component={AccSuggestWidget} margin="normal" />
                      </TableCell>
                      <TableCell style={{minWidth:80}} className={classes.cells} padding='none' align="center">
                      <FastField name={`articles.${index}.voucherType`} placeholder={t('data.voucherType')} fullWidth component={SelectWidget}>
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="normal">{t('data.normal')}</MenuItem>
                        <MenuItem value="special">{t('data.special')}</MenuItem>
                      </FastField>
                      </TableCell>
                      <TableCell style={{width:30}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.registered`} component={BooleanWidget} margin="normal" />
                      </TableCell>
                      <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.amount`} component={DecimalWidget} inputProps={{ maxLength: 1 }} />
                      </TableCell>
                      <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.refer`} fullWidth component={TextWidget} margin="normal" />
                      </TableCell>
                      <TableCell style={{minWidth:120}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.remark`} fullWidth component={TextWidget} margin="normal" multiline={true} rowsMax={4} />
                      </TableCell>
                      <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.createdAt`} fullWidth component={DateTimeWidget} margin="normal" />
                      </TableCell>
                      <TableCell className={classes.cells} padding='none' align="center">
                        <Button
                          variant="outlined" color="secondary"
                          onClick={() => arrayHelpers.remove(index)}
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
        )}
      />
    </React.Fragment>
  );
};


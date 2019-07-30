import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  RouteComponentProps
} from "react-router-dom";
import { Formik, FormikActions, Form, FastField, FieldArray } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import { TextWidget, DecimalWidget, SelectWidget, BooleanWidget, DateTimeWidget, DateWidget } from '../../lib/components/widgets';

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
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { mapToFarsi } from '../../lib/utils/farsiUtils';
import { AccSuggestWidget } from '../components/AccSuggest';
import uuidv4 from 'uuid/v4';


const styles = {
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
}

interface Values {
  id: string,
  voucher_no?: string,
  voucher_date?: string,
  acc_id?: string,
  registered?: boolean,
  amount?: number,
  remark?: string,
  created_at?: string,
  voucherType?: '' | 'normal' | 'special',
  articles: {
    id: string,
    article_no?: string,
    article_date?: string,
    acc_id?: string,
    registered?: boolean,
    amount?: number,
    remark?: string,
    created_at?: string,
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
  const [activeTab, setActiveTab] = useState(0);
  const { classes, match: { params: { id } } } = props;
  const appStore = useContext(AppStoreContext);

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
        voucher_no: undefined,
        voucher_date: undefined,
        acc_id: undefined,
        registered: false,
        amount: undefined,
        remark: '',
        created_at: (new Date()).toISOString(),
        voucherType: 'normal',
        articles: [],
      };
      appStore.setActData(key.current, values);
    } else {
      appStore.loadActData(key.current, `/voucher/${id}`, {});
    }
  }, [key, id, appStore]);

  if (!data) {
    return <div>loading...</div>;
  }

  const onSubmit = async (values: Values, actions: FormikActions<Values>) => {
    try {
      await appStore.saveActData(key.current, `/voucher/${values.id}`, values);
      // console.log(values)
    } catch (err) {
      //TODO if we get connection error we have to show a proper message 
      actions.setErrors(err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const validate = validationFunction(t);

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
            <Grid container spacing={24}>
              <Button onClick={()=>  props.history.goBack()} className={classes.backBtn}>
                <ArrowBack/>
              </Button>
              <Grid item xs={12}>
                <FastField className={classes.input} name="id" label={t('voucher.id')} fullWidth readOnly component={TextWidget} inputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12}>
                <FastField className={classes.input} name="refer" label={t('voucher.refer')} fullWidth component={TextWidget} />
              </Grid>

              <Grid className={classes.spaceBox} item xs={12}>
                <Tabs
                  value={activeTab}
                  onChange={(_: React.ChangeEvent<any>, value) => { setActiveTab(value) }}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label={<Typography color="textSecondary" gutterBottom>
                    {t('voucher.mainTab')}
                  </Typography>} />
                  <Tab label={<Typography color="textSecondary" gutterBottom>
                    {t('voucher.articles')}
                  </Typography>} />
                </Tabs>

                {activeTab === 0 && <MainTab />}
                {activeTab === 1 && <ArticleTabStyles values={values} />}
              </Grid>
              <Grid sm={8} item>
                <Button
                  fullWidth
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
                  fullWidth
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  {t('buttons.reset')}
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

interface IProps extends WithStyles<typeof styles>, RouteComponentProps<MatchParams> {
}

export default withStyles(styles)(GameForm);

const MainTab: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <FastField fullWidth name="voucherNo" label={t('voucher.voucherNo')} component={DecimalWidget} inputProps={{ maxLength: 4 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FastField fullWidth name="voucherDate" label={t('voucher.voucherDate')} component={DateWidget} />
        </Grid>
        <Grid item xs={12}>
          <FastField name="voucherType" label={t('voucher.voucherType')} fullWidth component={SelectWidget}>
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
            <MenuItem value="normal">{t('voucher.normal')}</MenuItem>
            <MenuItem value="special">{t('voucher.special')}</MenuItem>
          </FastField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FastField fullWidth name="amount" label={t('voucher.amount')} component={DecimalWidget} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FastField fullWidth name="createdAt" label={t('voucher.createdAt')} component={DateTimeWidget} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FastField name="registered" label={t('voucher.registered')} color="primary" component={BooleanWidget} />
      </Grid>
      <Grid item xs={12}>
        <FastField name="remark" label={t('voucher.remark')} fullWidth component={TextWidget} margin="normal" />
      </Grid>
    </React.Fragment>
  )
};


const articleTabStyles = (theme: Theme) => createStyles({
  cells: {
    padding: '0px 10px'
  },
});

interface IArticleTabProps extends WithStyles<typeof articleTabStyles> {
  values: any,
}

const ArticleTab: React.FunctionComponent<IArticleTabProps> = (props) => {
  const { t } = useTranslation();
  const { values, classes } = props;

  return (
    <React.Fragment>
      <FieldArray name="articles"
        render={arrayHelpers => (
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Button
                variant="outlined" color="primary"
                onClick={() => arrayHelpers.push({ 
                  id: uuidv4(),
                  article_no: undefined,
                  article_date: undefined,
                  acc_id: undefined,
                  registered: false,
                  amount: undefined,
                  remark: '',
                  created_at: '',
                  voucherType: '',
                })}
              >
                <AddIcon />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Table padding='default'>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.row')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.articleNo')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.articleDate')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.acc')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.registered')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.amount')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.refer')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.remark')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">{t('voucher.createdAt')}</TableCell>
                    <TableCell className={classes.cells} padding='none' align="center">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.articles && values.articles.map((td: any, index: number) => (
                    <TableRow key={index} selected={false} hover={true}>
                      <TableCell className={classes.cells} padding='none' component="th" scope="row">
                        {mapToFarsi(index + 1)}
                      </TableCell>
                      <TableCell style={{width:20}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.articleNo`} component={DecimalWidget} inputProps={{ maxLength: 1 }} />
                      </TableCell>
                      <TableCell style={{width:20}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.articleDate`} component={DateWidget} />
                      </TableCell>
                      <TableCell className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.accId`} placeholder={t('voucher.accSuggest')} fullWidth component={AccSuggestWidget} margin="normal" />
                      </TableCell>
                      <TableCell className={classes.cells} padding='none' align="center">
                      <FastField name={`articles.${index}.voucherType`} placeholder={t('voucher.voucherType')} fullWidth component={SelectWidget}>
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="normal">{t('voucher.normal')}</MenuItem>
                        <MenuItem value="special">{t('voucher.special')}</MenuItem>
                      </FastField>
                      </TableCell>
                      <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.registered`} component={BooleanWidget} margin="normal" />
                      </TableCell>
                      <TableCell style={{width:20}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.amount`} component={DecimalWidget} inputProps={{ maxLength: 1 }} />
                      </TableCell>
                      <TableCell style={{width:80}} className={classes.cells} padding='none' align="center">
                        <FastField name={`articles.${index}.refer`} fullWidth component={TextWidget} margin="normal" />
                      </TableCell>
                      <TableCell className={classes.cells} padding='none' align="center">
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

const ArticleTabStyles = withStyles(articleTabStyles)(ArticleTab);

import React, { useState, useContext, useEffect } from 'react';
import Autosuggest, { RenderSuggestionsContainerParams } from 'react-autosuggest';
import { FieldProps, getIn } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
// import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';

const useStyles = makeStyles({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative' as 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute' as 'absolute',
    zIndex: 1,
    // marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  input: {
    border: 'none',
    // backgroundColor: 'red',
    // color: 'green',
    padding: '6px 0px 7px',
    width: '100%',
  },
  divider: {
    // height: theme.spacing.unit * 2,
  },
});

function renderSuggestionsContainer(options: RenderSuggestionsContainerParams) {
  // const refresh = ()=>{
    // refreshHandler();
    // {(options.children!=null || options.query) && <span onClick={refresh}>refresh</span>}
  // }

  return (
    <Paper {...options.containerProps} square>
      {options.children}
    </Paper>
  )
}

function renderInputComponent(inputProps: any) {
  const { refreshHandler, classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      onKeyDownCapture={event=>{
        if(event.key==='F5'){
          event.preventDefault();
          if(refreshHandler) refreshHandler();
        }
      }}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

const KamandSuggest: React.FunctionComponent<IProps> = observer((props) => {
  const [value, setValue] = useState('');
  const [lastSelectedValue, setLastSelectedValue] = useState<any>({});
  const { field:{ name, onChange } } = props;

  const classes = useStyles();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const appStore = useContext(AppStoreContext);

  const {
    field,
    form: { touched, errors },
    label,
    children,
    placeholder,
    queryKey,
    query,
    publicQuery,
    queryParam,
    getSuggestionValue,
    getSuggestionDescription,
    getMatchingSuggestions,
    ...restProps
  } = props;

  useEffect(()=>{
    appStore.prepareQueryData(queryKey, query, queryParam, false, publicQuery);
  }, [appStore, queryKey, query, queryParam, publicQuery]);

  const refreshHandler = () => {
    setSuggestions([]);
    appStore.prepareQueryData(queryKey, query, queryParam, true, publicQuery);
  }

  const suggestionData: IQueryData = appStore.getQueryData(queryKey);

  useEffect(()=>{
    if(suggestionData && suggestionData.data && props.field.value){
      const newValue = suggestionData.data.find(row => getSuggestionValue(row) === props.field.value);
      setValue(getSuggestionDescription(newValue));
      setLastSelectedValue(newValue);
    }
  }, [appStore, getSuggestionDescription, getSuggestionValue, suggestionData, props.field.value]);

  const handleInputChange = (event: any) => {
    if(event.target.value !== undefined) {
      setValue(event.target.value);
      if(!event.target.value){
        if(onChange) onChange({target: {name, value: ''}});
        setLastSelectedValue({});
      }
    }
  };

  const handleBlur = (event: any) => {
    // console.log('blured', event, props.field.value, value, lastSelectedValue);
    if((lastSelectedValue && value !== getSuggestionDescription(lastSelectedValue))){
      setValue(getSuggestionDescription(lastSelectedValue));
    }
  };

  const handleSelected = (event: any, selected: any)=> {
    if(selected.suggestion){
      if(onChange) onChange({target: {name, value: getSuggestionValue(selected.suggestion)}});
      setValue(getSuggestionDescription(selected.suggestion));
      setLastSelectedValue(selected.suggestion);
    }
  }
  
  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getMatchingSuggestions(value, suggestionData));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderSuggestion = (suggestion: any, { query, isHighlighted }: any) => {
    return (
      <MenuItem selected={isHighlighted} component="div">
        <span>{getSuggestionDescription(suggestion)}</span>
      </MenuItem>
    );
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);

  const inputProps = {
    classes,
    placeholder,
    value,
    name,
    label,
    field,
    onChange: handleInputChange,
    onBlur: handleBlur,
    helperText: (error && touch) && error,
    error: (!!error && !!touch),
    refreshHandler,
    ...restProps,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      onSuggestionSelected={handleSelected}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      renderInputComponent={renderInputComponent}
      shouldRenderSuggestions={()=>true}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
        // input: classes.input,
      }}
      renderSuggestionsContainer={renderSuggestionsContainer}
    />
  );
});

interface IProps extends FieldProps<any> {
  onChange: any,
  label?: string,
  placeholder?: string,
  children: React.ReactNode,
  queryKey: string,
  query: string,
  publicQuery: boolean,
  queryParam: any,
  getSuggestionValue: (suggection: any)=>string,
  getSuggestionDescription: (suggection: any)=>string,
  getMatchingSuggestions: (value: string, suggestionData: IQueryData)=>any[],
}

export const KamandSuggestWidget = (KamandSuggest);

const KamandSuggestBase: React.FunctionComponent<IPropsInput> = observer((props) => {
  const [value, setValue] = useState('');
  const [lastSelectedValue, setLastSelectedValue] = useState<any>({});
  const {
    name,
    value: selectedValue,
    onChange,
    label,
    children,
    placeholder,
    queryKey,
    query,
    publicQuery,
    queryParam,
    getSuggestionValue,
    getSuggestionDescription,
    getMatchingSuggestions,
    ...restProps
  } = props;
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  useEffect(()=>{
    appStore.prepareQueryData(queryKey, query, queryParam, false, publicQuery);
  }, [appStore, queryKey, query, queryParam, publicQuery]);

  const refreshHandler = () => {
    setSuggestions([]);
    appStore.prepareQueryData(queryKey, query, queryParam, true, publicQuery);
  }

  const suggestionData: IQueryData = appStore.getQueryData(queryKey);

  useEffect(()=>{
    if(suggestionData && suggestionData.data && selectedValue && selectedValue!==getSuggestionValue(lastSelectedValue)){
      const newValue = suggestionData.data.find(row => getSuggestionValue(row) === selectedValue);
      setValue(getSuggestionDescription(newValue));
      setLastSelectedValue(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore, suggestionData, selectedValue]);

  const handleInputChange = (event: any) => {
    if(event.target.value !== undefined) {
      setValue(event.target.value);
      if(!event.target.value){
        if(onChange) onChange({target: {name, value: ''}});
        setLastSelectedValue({});
      }
    }
  };

  const handleBlur = (event: any) => {
    if((lastSelectedValue && value !== getSuggestionDescription(lastSelectedValue))){
      setValue(getSuggestionDescription(lastSelectedValue));
    }
  };

  const handleSelected = (event: any, selected: any)=> {
    if(selected.suggestion){
      if(onChange) onChange({target: {name, value: getSuggestionValue(selected.suggestion)}});
      setValue(getSuggestionDescription(selected.suggestion));
      setLastSelectedValue(selected.suggestion);
    }
  }
  
  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getMatchingSuggestions(value, suggestionData));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    classes,
    placeholder,
    value,
    name,
    label,
    onChange: handleInputChange,
    onBlur: handleBlur,
    refreshHandler,
    ...restProps,
  };

  const renderSuggestion = (suggestion: any, { query, isHighlighted }: any) => {
    return (
      <MenuItem selected={isHighlighted} component="div">
        <span>{getSuggestionDescription(suggestion)}</span>
      </MenuItem>
    );
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      onSuggestionSelected={handleSelected}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      renderInputComponent={renderInputComponent}
      shouldRenderSuggestions={()=>true}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
        // input: classes.input,
      }}
      renderSuggestionsContainer={renderSuggestionsContainer}
    />
  );
});

interface IPropsInput {
  value?: any,
  name?: string,
  onChange: any,
  label?: string,
  placeholder?: string,
  queryKey: string,
  query: string,
  publicQuery: boolean,
  queryParam: any,
  getSuggestionValue: (suggection: any)=>string,
  getSuggestionDescription: (suggection: any)=>string,
  getMatchingSuggestions: (value: string, suggestionData: IQueryData)=>any[],
}

export const KamandSuggestInput = (KamandSuggestBase);

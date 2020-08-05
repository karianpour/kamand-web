import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';
// import { useTranslation } from 'react-i18next';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '&:hover $indicatorContainer, &$focused $indicatorContainer': {
      // visibility: 'visible',
      display: 'block',
      backgroundColor: theme.palette.background.default,
    },
    focused: {},
    //TODO K1: I have to put focued class name in root class so when the component get focused
    //         it shows the refresh icon button, search for "focused" in the link bellow to 
    //         see how it works.
    //  https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Autocomplete/Autocomplete.js
  },
  /* Styles applied to the refresh indictator. */
  refreshIndicator: {
    marginRight: -2,
    padding: 4,
    color: theme.palette.action.active,
  },
  indicatorContainer: {
    // visibility: 'hidden',
    display: 'none',
    // display: 'block',
    position: 'absolute',
    right: 56,
  },
  inputRoot: { // if material design add the `important` tag we can remove this class
    '& $input': {
      width: '0 !important',
    },
  },
}));

const KamandAutoComplete: React.FunctionComponent<IPropsInput> = observer((props) => {
  const {
    name,
    value: selectedValue,
    defaultValue,
    error,
    helperText,
    onChange,
    label,
    placeholder,
    queryKey,
    query,
    publicQuery,
    queryParam,
    makeupData,
    getSuggestionValue,
    getSuggestionDescription,
    getSuggestionRow,
    translation,
    filterValueOptions,
    isOptionParent,
    filterParentOptions,
    acceptParent,
    addNew,
    multiple,
  } = props;

  const [value, setValue] = useState<any>(multiple ? [] : null);
  const [insideValue, setInsideValue] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [parent, setParent] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const keepOpenRef = useRef<boolean>(false);
  const defaultValueIsSet = useRef<boolean>(false);

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  const hashKey = queryKey + '/'+ hash(JSON.stringify(queryParam));

  useEffect(()=>{
    appStore.prepareQueryData(hashKey, query, queryParam, false, publicQuery, makeupData);
  }, [appStore, hashKey, query, queryParam, makeupData, publicQuery]);

  const refreshHandler = () => {
    appStore.prepareQueryData(hashKey, query, queryParam, true, publicQuery, makeupData);
  }

  const suggestionData: IQueryData = appStore.getQueryData(hashKey);

  useEffect(()=>{
    let settingValue = selectedValue;
    if(defaultValue !== undefined){
      if(defaultValueIsSet.current){
        return;
      }
      settingValue = defaultValue;
    }
    if((!multiple && settingValue !== insideValue) || (multiple && (settingValue || []).join(',') !== insideValue)){
      if(suggestionData?.data && !suggestionData?.loading){
        if(!multiple){
          const newValue = !settingValue ? null : suggestionData.data.find(row => getSuggestionValue(row) === settingValue);
          setInsideValue(newValue ? getSuggestionValue(newValue) : null);
          setValue(newValue || null);
          defaultValueIsSet.current = true;
          setInputValue(getSuggestionDescription(newValue));
        }else if(multiple && settingValue){
          const values = settingValue || [];
          const newValue = values.map( (v: string) => suggestionData.data.find(row => getSuggestionValue(row) === v));
          setInsideValue(newValue.filter( (v: any) => !!v ).map( (v: any)=>getSuggestionValue(v)).join(','));
          setValue(newValue);
          defaultValueIsSet.current = true;
          setInputValue('');
        }else if(multiple && !settingValue){
          setValue([]);
          defaultValueIsSet.current = true;
          setInputValue('');
        }
      }
    }
  }, [defaultValueIsSet, appStore, suggestionData, selectedValue, defaultValue, insideValue, setInsideValue, getSuggestionValue, getSuggestionDescription, multiple]);

  const handleChange = useCallback((event: any, newValue: any)=> {
    if(!multiple && newValue){
      if(newValue.isParent){
        setParent(newValue.parent ? {isParent: true, ...newValue.parent} : null);
        if(!acceptParent){
          setValue(multiple ? [] : null);
          setInputValue('');
        }
        keepOpenRef.current = true;
        // setTimeout(()=>setOpen(true), 200);
      }else{
        if(isOptionParent && isOptionParent(newValue)){
          setParent({isParent: true, parent, ...newValue});
          if(acceptParent){
            const eventValue = getSuggestionValue(newValue);
            setInsideValue(eventValue);
            if(onChange) onChange({target: {name, value: eventValue}});
            setValue(newValue || null);
            setInputValue(getSuggestionDescription(newValue));
          }else{
            setValue(null);
            setInputValue('');
          }
          keepOpenRef.current = true;
          // setTimeout(()=>setOpen(true), 200);
        }else{
          const eventValue = getSuggestionValue(newValue);
          setInsideValue(eventValue);
          if(onChange) onChange({target: {name, value: eventValue}});
          setValue(newValue);
          setInputValue(getSuggestionDescription(newValue));
        }
      }
    }else if(multiple && Array.isArray(newValue)){
      const isItemTarget = isAttributeOf(event.target, 'data-for', 'item');
      if(newValue.length < value.length && !isItemTarget){//user removed an item
        const eventValue = newValue.map( v=>getSuggestionValue(v));
        setInsideValue(eventValue.join(','));

        if(onChange) onChange({target: {name, value: eventValue}});
        setValue(newValue);
        setInputValue('');
        keepOpenRef.current = true;
      }else{
        let lastlySelected;
        if(newValue.length > value.length){
          lastlySelected = newValue[newValue.length - 1];
        }else{
          lastlySelected = value.find( (v: any) => newValue.findIndex( nv => getSuggestionValue(v) === getSuggestionValue(nv) ) === -1 );
        }
        if(lastlySelected.isParent){
          setParent(lastlySelected.parent ? {isParent: true, ...lastlySelected.parent} : null);
          keepOpenRef.current = true;
        }else{
          const isDrill = isAttributeOf(event.target, 'data-for', 'drill');
          if(isOptionParent && isOptionParent(lastlySelected)){
            if(isDrill || !acceptParent) setParent({isParent: true, parent, ...lastlySelected});
            if(acceptParent){
              if(!isDrill){
                const eventValue = newValue.map( v=>getSuggestionValue(v));
                setInsideValue(eventValue.join(','));
                if(onChange) onChange({target: {name, value: eventValue}});
                setValue(newValue);
                setInputValue('');
              }
              // setInputValue(getSuggestionDescription(value));
            }else{
              newValue.splice(newValue.length - 1);
              setValue(newValue);
              setInputValue('');
            }
            keepOpenRef.current = true;
            // setTimeout(()=>setOpen(true), 200);
          }else{
            const eventValue = newValue.map( v=>getSuggestionValue(v));
            setInsideValue(eventValue.join(','));
            if(onChange) onChange({target: {name, value: eventValue}});
            setValue(newValue);
            setInputValue('');
            // setInputValue(getSuggestionDescription(newValue));
          }
        }
      }
    }else{
      setInsideValue(null);
      if(onChange) onChange({target: {name, value: null}});
      setValue(multiple ? [] : null);
      setInputValue('');
      if(event.type!=='change'){
        setParent(null);
      }
    }
  }, [value, parent, name, setValue, setInputValue, setParent, onChange, getSuggestionDescription, getSuggestionValue, keepOpenRef, isOptionParent, acceptParent, multiple])

  const onInputChange = useCallback((event: React.ChangeEvent<{}>, value: any) => {
    if(!event || event.type==='change'){
      setInputValue(value);
    }
  }, [setInputValue]);

  const filterOptions = useCallback((options: any[], state: FilterOptionsState<any>): any[] => {
    let filtered = options;

    if(state.inputValue){
      filtered = filterValueOptions(filtered, state.inputValue);
    }
    if(filterParentOptions){
      filtered = filterParentOptions(filtered, parent);
    }
    return filtered;
  }, [parent, filterValueOptions, filterParentOptions]);

  const handleAddNew = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!addNew) return;
    const selected = await addNew(value, parent);
    if(selected){
      const eventValue = getSuggestionValue(selected);
      setInsideValue(eventValue);
      if(onChange) onChange({target: {name, value: eventValue}});
      refreshHandler();
    }
  }

  const handleOpen = useCallback(()=>{
    setOpen(true);
    keepOpenRef.current = false;
  }, [setOpen]);

  const handleClose = useCallback(()=>{
    if(!keepOpenRef.current){
      setOpen(false);
    }
    keepOpenRef.current = false;
  }, [setOpen, keepOpenRef])

  const handleOptionSelected = (option: any, value: any):boolean => {
    if(option && value && getSuggestionValue(option)===getSuggestionValue(value)){
      return true;
    }
    return false;
  }

  return (
    <Autocomplete
      className={classes.root}
      onChange={handleChange}
      value={value}
      inputValue={inputValue}
      onInputChange={onInputChange}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      openText={translation.openText}
      closeText={translation.closeText}
      clearText={translation.clearText}
      noOptionsText={translation.noOptionsText}
      debug={false}
      multiple={multiple}
      filterOptions={filterOptions}
      options={suggestionData?.data || []}
      getOptionLabel={(option) => getSuggestionDescription(option)}
      getOptionSelected={handleOptionSelected}
      renderOption={(option, state) => (
        <MenuItem selected={state.selected} component="div">
          {getSuggestionRow && getSuggestionRow(option)}
          {!getSuggestionRow && <span>{getSuggestionDescription(option)}</span>}
        </MenuItem>
      )}
      renderInput={params => {
        // debugger
        return (
        <TextField
          {...params}
          label={label}
          name={name}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          fullWidth
          variant="standard"
          InputProps={{
            ...params.InputProps,
            className: `${params.InputProps.className} ${classes.inputRoot}`,
            endAdornment: (
              <>
                {suggestionData && suggestionData.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <div className={classes.indicatorContainer}>
                  {!suggestionData || !suggestionData.loading ? (
                    <IconButton className={classes.refreshIndicator} size="small" onClick={refreshHandler}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>) : null}
                  {addNew ? (
                    <IconButton className={classes.refreshIndicator} size="small" onClick={handleAddNew}>
                      {value ? <EditIcon fontSize="small" /> : <AddIcon />}
                    </IconButton>) : null}
                </div>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}}
    />
  );
});

interface IPropsInput {
  value?: any,
  defaultValue?: any,
  name?: string,
  onChange: any,
  label?: string,
  error?: boolean,
  helperText?: string,
  placeholder?: string,
  queryKey: string,
  query: string,
  publicQuery: boolean,
  queryParam: any,
  makeupData: (data: any)=>any,
  translation: {
    openText: string,
    closeText: string,
    clearText: string,
    noOptionsText: Node,
  },
  getSuggestionValue: (suggection: any)=>string,
  getSuggestionDescription: (suggection: any)=>string,
  getSuggestionRow?: (suggection: any)=>Node,
  filterValueOptions: (options: any[], inputValue: string)=>any[],
  isOptionParent?: (option: any) => boolean,
  filterParentOptions?: (options: any[], parent: any) => any[],
  acceptParent?: boolean,
  addNew?: (value: any, parent: any) => Promise<any>,
  multiple?: boolean,
}


export default KamandAutoComplete;

export const AutoCompleteWithAdd = (props: any)=>{
  const { AutoCompleteFiled, EntryDialog, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState(null);
  const [value, setValue] = useState(null);

  const handleClose = () => {
    setOpen(false);
    if(resolveRef.current){
      resolveRef.current(null);
    }
  };
  
  const handleSaved = (value: any) => {
    setOpen(false);
    if(resolveRef.current){
      resolveRef.current(value);
    }
  };

  const resolveRef = useRef<any>(null);

  const handleAddNew = async (value: any, parent: any) => {
    setValue(value || null);
    setParent(parent);
    setOpen(true);
    return new Promise((resolve)=>{
      resolveRef.current = resolve;
    });
  }

  return (
    <React.Fragment>
      <AutoCompleteFiled addNew={handleAddNew} {...rest}/>
      <EntryDialog open={open} onSaved={handleSaved} onClose={handleClose} filter={{...props.filter, parent, value}}/>
    </React.Fragment>
  )
}

function isAttributeOf(element: any, attr: string, value: string, asHighAs?: number): boolean{
  const matched = element?.attributes[attr]?.value === value;
  if(matched) return true;
  if(asHighAs===0) return false;
  if(!asHighAs) asHighAs = 4;
  if(element?.parentElement){
    return isAttributeOf(element?.parentElement, attr, value, asHighAs - 1);
  }
  return false;
}
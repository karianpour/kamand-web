import React, { useState, useRef, useCallback, useEffect } from 'react';
import {hasNonEmptyValue, setNestedObjectValues, setIn, getIn} from '../utils/generalUtils';

export interface FormValues {
  [field: string]: any;
}

export type FormErrors<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormErrors<Values[K][number]>[] | string | string[]
      : string | string[]
    : Values[K] extends object
    ? FormErrors<Values[K]>
    : string;
};

export type FormTouched<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormTouched<Values[K][number]>[]
      : boolean
    : Values[K] extends object
    ? FormTouched<Values[K]>
    : boolean;
};

export interface FormState<Values> {
  values?: Values;
  errors: FormErrors<Values>;
  touched: FormTouched<Values>;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
}

export interface FormSubmitResult<Values> {
  errors?: FormErrors<Values>,
  valuesFromServer?: Values,
}

export interface FormConfig<Values>{
  initialValues?: Values;
  validate?: (values: Values) => Promise<FormErrors<Values>>;
  submit: (values: Values, form: KamandForm<Values>) => Promise<FormSubmitResult<Values>>;
  onChange?: (path: string, previousValue: any, value: any) => void | Promise<void>;
}

export interface FormFieldProps {
  onChange: (e: React.ChangeEvent<any>)=>void,
  name: string,
  id: string,
  value: any,
  error: boolean,
  helperText: Node,
}

export interface KamandForm<Values> {
  getFieldProps: (path: string) => FormFieldProps,
  values: Values,
  isDirty: () => boolean,
  isSubmitting: () => boolean,
  isValidating: () => boolean,
  submitForm: () => Promise<boolean>,
  resetForm: () => void,
  setFieldValue: (path: string, value: any) => void,
  removeFromArray: (pathToArray: string, index: number) => void,
  getHelperText(path: string): Node,
}

export function useKamandForm<Values extends FormValues = FormValues> (props: FormConfig<Values>): KamandForm<Values> {
  const [ renderCount, setRenderCount ] = useState<number>(1);
  const rerender = () => {
    setRenderCount(renderCount + 1);
  }
  // console.log(`rerender kamand form hook`)
  const state = useRef<FormState<Values>>({
    values: props.initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
  });

  useEffect(() =>{
    if(!state.current.values && props.initialValues){
      state.current.values = props.initialValues;
      rerender();
    }
  });

  const isDirty = useCallback((): boolean => {
    const dirty = hasNonEmptyValue(state.current.touched);
    return dirty;
  }, [state]);

  const isSubmitting = useCallback((): boolean => {
    return state.current.isSubmitting;
  }, [state]);

  const isValidating = useCallback((): boolean => {
    return state.current.isValidating;
  }, [state]);

  const resetForm = (): void => {
    state.current.values = props.initialValues;
    state.current.touched = {};
    state.current.errors = {};
    rerender();
  }

  const submitForm = async (): Promise<boolean> => {
    if(!state.current.values) return false;
    if(state.current.isSubmitting || state.current.isValidating) return false;

    state.current.touched = setNestedObjectValues<FormTouched<Values>>(state.current.values, true);
    state.current.errors = {};
    state.current.isValidating = true;
    state.current.isSubmitting = true;
    state.current.submitCount = state.current.submitCount + 1;
    // if I rerender here, the next rerender will not work
    // rerender();
    
    if(props.validate){
      const errors = await props.validate(state.current.values);
      let hasError = hasNonEmptyValue(errors);
      if(hasError){
        state.current.isSubmitting = false;
        state.current.isValidating = false;
        state.current.errors = errors;
        rerender();
        return false;
      }
    }

    const result = await props.submit(state.current.values, kamandForm);
    if(result.errors){
      let hasError = hasNonEmptyValue(result.errors);
      if(hasError){
        state.current.isValidating = false;
        state.current.isSubmitting = false;
        state.current.errors = result.errors;
        rerender();
        return false;
      }
    }
    if(result.valuesFromServer){
      state.current.values = result.valuesFromServer;
    }
    state.current.touched = {};
    state.current.isValidating = false;
    state.current.isSubmitting = false;
    rerender();
    return true;
  };

  let rerenderDepth  = 0;
  const setFieldValue = async (path: string, value: any): Promise<void> => {
    const newValues = setIn(state.current.values, path, value);
    if(newValues === state.current.values){
      return;
    }
    const previousValues = state.current.values;
    state.current.values = newValues;
    state.current.touched = setIn(state.current.touched, path, value !== getIn(props.initialValues, path));
    if(props.onChange) {
      const previousValue = getIn(previousValues, path);
      rerenderDepth++;
      try{
        await props.onChange(path, previousValue, value);
      }catch(err){

      }finally{
        rerenderDepth--;
      }
    }
    if(rerenderDepth===0) {
      rerender();
    }
  };

  const removeFromArray = (pathToArray: string, index: number): void => {
    const array = getIn(state.current.values, pathToArray);
    if(Array.isArray(array)){
      if(index < array.length){
        array.splice(index, 1);
        const newValues = setIn(state.current.values, pathToArray, array);
        state.current.values = newValues;
        state.current.touched = setIn(state.current.touched, `${pathToArray}[${index}]`, true);
        rerender();
      }
    }
  };

  const changeHandler = (e: React.ChangeEvent<any>): void=> {
    const { name, value, type, checked } = e.target;
    if(type==='checkbox'){
      setFieldValue(name, checked);
    }else{
      setFieldValue(name, value);
    }
  };

  const getFieldProps = (path: string): FormFieldProps => {

    const value = getIn(state.current.values, path);

    const errorNode = getIn(state.current.errors, path);
    const touched = getIn(state.current.touched, path);
    const error = (!!errorNode && !!touched);
    const helperText = error && errorNode;

    return {
      onChange: changeHandler,
      name: path,
      id: path,
      value,
      error,
      helperText,
    }
  };

  const getHelperText = (path: string): Node => {
    return getIn(state.current.errors, path);
  }

  const kamandForm = {
    getFieldProps,
    get values():any { return state.current.values },
    isDirty,
    isSubmitting,
    isValidating,
    submitForm,
    resetForm,
    setFieldValue,
    removeFromArray,
    getHelperText,
  }

  return kamandForm;
}




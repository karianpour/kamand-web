import React from 'react';
import KamandStaticAutoComplete from '../../lib/components/KamandStaticAutoComplete';
import { useTranslation } from 'react-i18next';
import DataView from '../../lib/components/DataView';

function getSuggestionValue(suggestion: any) {
  return suggestion.id;
}

function getSuggestionDescription(suggestion: any) {
  return !suggestion || !suggestion.name ? '' : suggestion.name;
}

function filterValueOptions(options: any[], inputValue: string){
  if(!options) return [];
  const suggestions = options.filter(row => getSuggestionDescription(row).indexOf(inputValue) > -1);
  return suggestions;
}

function createListSuggestions(t: (s:string)=>string): ()=>any[]{
  return ()=>([
    {id: 'normal', name: t('data.normal')},
    {id: 'special', name: t('data.special')},
  ]);
}

export const VoucherTypeField = (props: any)=>{
  const { t } = useTranslation();

  const translation = {
    openText: t('autoComplete.openText'),
    closeText: t('autoComplete.closeText'),
    clearText: t('autoComplete.clearText'),
    noOptionsText: t('autoComplete.noOptionsText'),
  }

  const { filter, ...restProps } = props;
  const getListSuggestions = createListSuggestions(t);
  return <KamandStaticAutoComplete
            getSuggestionValue={getSuggestionValue}
            getSuggestionDescription={getSuggestionDescription}
            filterValueOptions={filterValueOptions}
            getListSuggestions={getListSuggestions}
            translation={translation}
            {...restProps}
          />
}

interface IDataIDViewProps {
  label?: string,
  id: any,
  span?: boolean,
}

export const VoucherCatView: React.FunctionComponent<IDataIDViewProps> = (props) => {
  const { t } = useTranslation();
  const {id, label, span} = props;

  const list = createListSuggestions(t)();
  const cat = !id || !list ? null : list.find( l => getSuggestionValue(l) === id);

  const value = cat ? cat.name : '';

  if(span || !label){
    return <span>{`${label ? label + ': ' : ''}${value}`}</span>
  }else{
    return (
      <DataView value={value} label={label} format="text"/>
    );
  }
}

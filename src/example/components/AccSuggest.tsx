import React from 'react';
import { KamandSuggestWidget, KamandSuggestInput } from '../../lib/components/KamandSuggest';
import { IQueryData } from '../../lib/store/interfaces/dataInterfaces';

function getSuggestionValue(suggestion: any) {
  return suggestion.id;
}

function getSuggestionDescription(suggestion: any) {
  return !suggestion || !suggestion.name ? '' : suggestion.name;
}

function getMatchingSuggestions(value: any, suggestionData: IQueryData){
  if(!suggestionData || !suggestionData.data) return [];
  const suggestions = suggestionData.data.filter(row => getSuggestionDescription(row).indexOf(value) > -1).map(row => row);
  return suggestions;
}

export const AccSuggestWidget = (props: any)=>{
  return <KamandSuggestWidget 
            queryKey={'acc_suggest'}
            query={'acc_list'}
            publicQuery={false}
            queryParam={{}}
            getSuggestionValue={getSuggestionValue}
            getSuggestionDescription={getSuggestionDescription}
            getMatchingSuggestions={getMatchingSuggestions}
             {...props}
          />
}

export const AccSuggestInput = (props: any)=>{
  return <KamandSuggestInput
            queryKey={'acc_suggest'}
            query={'acc_list'}
            publicQuery={false}
            queryParam={{}}
            getSuggestionValue={getSuggestionValue}
            getSuggestionDescription={getSuggestionDescription}
            getMatchingSuggestions={getMatchingSuggestions}
             {...props}
          />
}

import React from 'react';
import MaterialAutcomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Autocomplete = ({ options, children }) => {
  return (
    <MaterialAutcomplete
      id="combo-box-demo"
      options={options}
      freeSolo
      getOptionLabel={option => option.title}
      style={{ width: 300 }}
      renderInput={children}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.title, inputValue);
        const parts = parse(option.title, matches);

        return (
          <div>
            {parts.map((part, index) => (
              <span
                key={index}
                style={{ fontWeight: part.highlight ? 700 : 400 }}
              >
                {part.text}
              </span>
            ))}
          </div>
        );
      }}
    />
  );
};

export default Autocomplete;

import React from 'react';
import MaterialAutcomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Autocomplete = ({
  options,
  children,
  onOptionClick,
  defaultValue,
  ...otherProps
}) => {
  return (
    <MaterialAutcomplete
      id="combo-box-demo"
      options={options}
      freeSolo
      getOptionLabel={option => option.title}
      defaultValue={defaultValue}
      style={{ width: 300 }}
      renderInput={children}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.title, inputValue);
        const parts = parse(option.title, matches);

        return (
          <div
            onClick={() => onOptionClick(option)}
            style={{
              width: '100%',
              height: '100%',
              marginInline: '-15px',
              marginBlock: '-10px',
              paddingBlock: '10px',
              paddingInline: '15px',
            }}
          >
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
      {...otherProps}
    />
  );
};

export default Autocomplete;

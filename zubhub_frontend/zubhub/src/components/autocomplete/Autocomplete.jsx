import React from 'react';
import MaterialAutcomplete from '@mui/material/Autocomplete';

const Autocomplete = ({
  options,
  children,
  defaultValue,
  renderOption,
  ...otherProps
}) => {
  return (
    <MaterialAutcomplete
      id="combo-box-demo"
      options={options}
      freeSolo
      getOptionLabel={option => option.title || ''}
      defaultValue={defaultValue}
      sx={{ width: 300 }}
      renderInput={children}
      renderOption={renderOption}
      {...otherProps}
    />
  );
};

export default Autocomplete;

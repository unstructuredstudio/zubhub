import { InputBase, Select, withStyles } from '@material-ui/core';
import React from 'react';

const BootstrapInput = withStyles(theme => ({
  input: {
    borderRadius: 0,
    borderTopLeftRadius: 250,
    borderBottomLeftRadius: 250,
    position: 'relative',
    fontSize: 16,
    padding: '10px 26px 10px 18px',
    backgroundColor: '#00B8C4',
    color: 'white',
    transition: 'background-color 250ms ease',
    textAlign: 'center',
    '& ~ svg': {
      color: 'white',
    },
    '&:focus': {
      borderTopLeftRadius: 250,
      borderBottomLeftRadius: 250,
      backgroundColor: '#00B8C4',
    },
    '&[aria-expanded]': {
      borderRadius: 0,
      borderTopLeftRadius: 250,
      borderBottomLeftRadius: 250,
      backgroundColor: 'white',
      color: '#00B8C4',
      '& ~ svg': {
        color: '#00B8C4',
      },
    },
  },
}))(InputBase);

const InputSelect = ({
  searchType,
  onSearchTypeChange,
  children,
  ...selectProps
}) => {
  return (
    <Select
      labelId="demo-customized-select-label"
      id="demo-customized-select"
      value={searchType}
      onChange={({ target: { value } }) => onSearchTypeChange(value)}
      input={<BootstrapInput />}
      style={{ minWidth: '115px' }}
      MenuProps={{
        getContentAnchorEl: null,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        transformOrigin: { vertical: 'top', horizontal: 'center' },
      }}
      {...selectProps}
    >
      {children}
    </Select>
  );
};

export default InputSelect;

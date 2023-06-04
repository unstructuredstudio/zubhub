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
    backgroundColor: 'var(--primary-color3)',
    color: 'white',
    transition: 'background-color 250ms ease',
    textAlign: 'center',
    minHeight: '20px',
    '& ~ svg': {
      color: 'white',
    },
    '&:focus': {
      borderTopLeftRadius: 250,
      borderBottomLeftRadius: 250,
      backgroundColor: 'var(--primary-color3)',
    },
    '&[aria-expanded]': {
      borderRadius: 0,
      borderTopLeftRadius: 250,
      borderBottomLeftRadius: 250,
      backgroundColor: 'white',
      color: 'var(--primary-color3)',
      '& ~ svg': {
        color: 'var(--primary-color3)',
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
      value={searchType}
      onChange={({ target: { value } }) => onSearchTypeChange(value)}
      input={<BootstrapInput />}
      style={{ minWidth: '115px' }}
      MenuProps={{
        getContentAnchorEl: null,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        transformOrigin: { vertical: 'top', horizontal: 'center' },
        disableScrollLock: true,
      }}
      {...selectProps}
    >
      {children}
    </Select>
  );
};

export default InputSelect;

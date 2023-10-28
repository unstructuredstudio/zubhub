import { Box, Checkbox, FormControl, TextField, Typography, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { colors } from '../../../assets/js/colors';
import styles from '../../../assets/js/styles';
import { dropdownStyle } from './dropdown.style';

export default function Dropdown({
  label,
  data = [],
  value,
  multiple,
  placeholder,
  required,
  handleChange,
  onBlur = () => {},
  error,
  helperText,
  name,
  description,
  onInput = () => {},
  maxSelection,
  withCheckbox = true,
}) {
  const classes = makeStyles(dropdownStyle)();
  const commonClasses = makeStyles(styles)();
  const memoizedValue = useMemo(() => value, [value]);

  if (multiple && value) {
    let valueTemp = [];
    (Array.isArray(value) ? value : [{ name: value }]).forEach(
      item => Object.keys(item).length > 0 && valueTemp.push(item),
    );
    value = valueTemp;
  }

  const labelView = (props, ...rest) => {
    const color = rest[0].selected ? colors.primary : colors.light;
    const checked = rest[0].selected;
    return (
      <Box component="li" sx={{ '& > *': { mr: 2 }, display: 'flex', gap: 15, alignItems: 'center' }} {...props}>
        {multiple && withCheckbox ? <Checkbox checked={checked} style={{ color }} /> : null}
        {!multiple ? (
          <div className={clsx(classes.radio, checked && classes.activeRadio)}>
            <div></div>
          </div>
        ) : null}
        <Typography style={{ fontWeight: '500' }}>{props.name}</Typography>
      </Box>
    );
  };

  const inputView = params => (
    <TextField
      {...params}
      variant="outlined"
      onBlur={() => onBlur({ name, target: { value } })}
      error={error}
      helperText={error}
      placeholder={placeholder}
      inputProps={{
        ...params.inputProps,
        autoComplete: 'new-password', // disable autocomplete and autofill
      }}
    />
  );

  const getOptionSelected = option => {
    if (typeof maxSelection === 'number' && value?.length == maxSelection) {
      return value.findIndex(item => item.id === option.id) == -1;
    }
  };

  return (
    <FormControl fullWidth>
      <label htmlFor="" className={commonClasses.title2}>
        {label} {required && <span className={commonClasses.colorRed}>*</span>}
      </label>

      {helperText && (
        <Typography color={error ? 'error' : ''} className={commonClasses.textSmall} style={{ marginBottom: 10 }}>
          {helperText}
        </Typography>
      )}
      <Autocomplete
        sx={{ width: 300 }}
        options={data}
        autoHighlight
        multiple={multiple}
        value={memoizedValue}
        onInput={e => onInput(e.target.value)}
        onChange={(e, value) => handleChange(value)}
        getOptionLabel={option => option?.name || ''}
        renderOption={labelView}
        renderInput={inputView}
        getOptionSelected={(option, value) => option.id === value.id} // Customize the equality test
        {...(maxSelection && { getOptionDisabled: getOptionSelected })}
      />
    </FormControl>
  );
}

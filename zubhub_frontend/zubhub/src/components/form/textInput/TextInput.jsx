import { Box, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@material-ui/core';
import React from 'react';
import FormLabel from '../../form_labels/formLabel';

export default function Input({ label, required, placeholder, id, name, error, value, helperText }) {
  return (
    <Box>
      <FormControl fullWidth error={error}>
        <FormLabel required={required} htmlFor={name}>
          {label}
        </FormLabel>
        <FormHelperText>{helperText}</FormHelperText>
        <OutlinedInput required={required} name={name} placeholder={placeholder} value={value} />
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
}

import { Box, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@material-ui/core';
import React from 'react';

export default function TextInput({ label, required, placeholder, id, name, error, value }) {
  return (
    <Box>
      <FormControl error={error}>
        <label htmlFor={id}>{label}</label>
        <OutlinedInput id={id} value={value} />
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
}

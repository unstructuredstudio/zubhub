import React, { useState } from 'react';
import { colors } from '../../../assets/js/colors';
import FormLabel from '../../form_labels/formLabel';
import { Checkbox, FormControl, FormHelperText, Grid, Typography, makeStyles } from '@material-ui/core';
import styles from '../../../assets/js/styles';
import { selectFromPillsStyles } from './selectFromPills.styles';
import _ from 'lodash';

export default function SelectFromPills({
  label,
  helperText,
  name,
  data,
  error,
  selectedItems = [],
  limit,
  onChange = () => {},
  onBlur = () => {},
}) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(selectFromPillsStyles)();

  const [selected, setSelected] = useState(selectedItems);

  const handleChange = (data, checked) => {
    let newCategories = [...selected];
    if (checked) {
      newCategories = newCategories.filter(cat => cat.name !== data.name);
    } else newCategories.push(data);

    setSelected(newCategories);
    // _.debounce(() => {
    onChange(newCategories);
    // onBlur({ name, target: { value: newCategories } });
    // }, 500);
  };

  const isLimit = limit ? selected?.filter(selectedItem => selectedItem.name).length == limit : false;

  return (
    <FormControl error={error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Typography className={commonClasses.textSmall} style={{ marginBottom: 10 }}>
        {helperText}
      </Typography>

      <Grid container spacing={3} className={classes.pillContainer}>
        {data.map(item => {
          let isSelected = selected?.filter(selectedItem => selectedItem.name === item.name).length > 0;
          const color = isSelected ? colors.primary : isLimit ? '#D9DEE2' : colors.light;
          return (
            <Grid item xs={6} md={4} key={item.name}>
              <div
                onClick={() => (isLimit && !isSelected ? null : handleChange(item, isSelected))}
                className={classes.pill}
                style={{ border: `solid 1px ${color}` }}
              >
                <Checkbox className={commonClasses.checkbox} checked={isSelected} style={{ color, borderWidth: 1 }} />
                <Typography style={{ ...(isLimit && !isSelected && { color }) }}>{item.name}</Typography>
              </div>
            </Grid>
          );
        })}
      </Grid>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

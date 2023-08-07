import React from 'react';
import { colors } from '../../../assets/js/colors';
import FormLabel from '../../form_labels/formLabel';
import { Checkbox, Grid, Typography, makeStyles } from '@material-ui/core';
import styles from '../../../assets/js/styles';
import { selectFromPillsStyles } from './selectFromPills.styles';

export default function SelectFromPills({ label, helperText, name, data, selectedItems, limit, onChange = () => {} }) {
  const isLimit = limit ? selectedItems?.filter(selectedItem => selectedItem.name).length == limit : false;
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(selectFromPillsStyles)();

  return (
    <div>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <helperText>
        <Typography className={commonClasses.textSmall} style={{ marginBottom: 10 }}>
          {helperText}
        </Typography>
      </helperText>

      <Grid container spacing={3} className={classes.pillContainer}>
        {data.map(item => {
          let selected = selectedItems?.filter(selectedItem => selectedItem.name === item.name).length > 0;
          const color = selected ? colors.primary : isLimit ? '#D9DEE2' : colors.light;
          return (
            <Grid item xs={6} md={4} key={item.name}>
              <div
                onClick={() => (isLimit && !selected ? null : onChange(item, selected))}
                className={classes.pill}
                style={{ border: `solid 1px ${color}` }}
              >
                <Checkbox className={commonClasses.checkbox} checked={selected} style={{ color, borderWidth: 1 }} />
                <Typography style={{ ...(isLimit && !selected && { color }) }}>{item.name}</Typography>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

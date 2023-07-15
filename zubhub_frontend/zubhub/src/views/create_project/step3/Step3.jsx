import React, { useEffect, useState } from 'react';
import { Dropdown } from '../../../components';
import { getCategories } from '../script';
import { TEAM_ENABLED, getUrlQueryObject } from '../../../utils.js';
import { Checkbox, Grid, Typography, makeStyles } from '@material-ui/core';
import { colors } from '../../../assets/js/colors';
import styles from '../../../assets/js/styles';
import { step3Style } from './step3.styles';

export default function Step3({ formik, handleBlur, ...props }) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(step3Style)();
  const handleChange = data => {
    formik.setFieldValue('category', data);
  };
  const [mode, setMode] = useState('');
  const [creatorValue, setCreatorValue] = useState({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getCategories(props).then(cats => setCategories(cats.categories));
    if (TEAM_ENABLED) {
      let params = getUrlQueryObject();
      if ('mode' in params) setMode(params.mode);
    }
  }, []);

  const [categories, setCategories] = useState([]);

  const creatorsData = [
    { name: 'Team', id: '1' },
    { name: 'Co-creator', id: '2' },
  ];

  return (
    <>
      <Dropdown
        label="What category does your project belong too?"
        placeholder="Select Categories"
        handleChange={handleChange}
        handleBlur={() => handleBlur('category')}
        data={categories}
        value={formik.values.category}
        error={formik.touched.category && formik.errors.category}
        multiple={true}
        withCheckbox={true}
        maxSelection={3}
        description="Select any of the categories that best describe your project. Select none of you are unsure about your category."
      />

      {/* <label htmlFor="" className={commonClasses.title2}>
        What category does your project belong too? <span className={commonClasses.colorRed}>*</span>
      </label>
      <Typography style={{ marginBottom: 10 }}>
        Select any of the categories that best describe your project. Select none of you are unsure about your category.
      </Typography>

      <div className={classes.pillContainer}>
        {categories.map(cat => {
          let selected =
            formik.values.category.filter(selectedCategory => selectedCategory.name === cat.name).length > 0;
          const color = selected ? colors.primary : colors.light;
          return (
            <div item key={cat.name} style={{ border: `solid 1px ${color}` }} className={classes.pill}>
              <Checkbox className={commonClasses.checkbox} checked={selected} style={{ color, borderWidth: 1 }} />
              <Typography>{cat.name}</Typography>
            </div>
          );
        })}
      </div> */}

      {mode === 'team' && (
        <div style={{ marginTop: 40 }}>
          <Dropdown
            label="Add Team or Co-creator"
            placeholder="Select Team or Co-creation"
            handleChange={data => setCreatorValue(data)}
            data={creatorsData}
            value={creatorValue}
            description="What team or creator did you work with for this project?"
          />

          {creatorValue?.name == 'Team' && (
            <Dropdown placeholder="Select Team name" handleChange={data => setCreatorValue(data)} data={creatorsData} />
          )}

          {creatorValue?.name == 'Co-creator' && (
            <>
              <Dropdown
                placeholder="Select Co-creators"
                handleChange={data => setCreatorValue(data)}
                data={creatorsData}
                // value={creatorValue}
                multiple={true}
              />
              <Typography>
                Would you like to make this a team? <Checkbox style={{ ...(checked && { color: colors.primary }) }} />
              </Typography>
            </>
          )}
        </div>
      )}
    </>
  );
}

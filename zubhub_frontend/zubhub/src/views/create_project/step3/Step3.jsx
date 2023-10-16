import React, { useEffect, useState } from 'react';
import { Dropdown } from '../../../components';
import { getCategories, searchCreators } from '../script';
import { TEAM_ENABLED, getUrlQueryObject } from '../../../utils.js';
import { Checkbox, Grid, Typography, makeStyles } from '@material-ui/core';
import { colors } from '../../../assets/js/colors';
import styles from '../../../assets/js/styles';
import { step3Style } from './step3.styles';
import _ from 'lodash';

export default function Step3({ formik, handleBlur, ...props }) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(step3Style)();

  const handleChange = (data, checked) => {
    let newCategories = [...formik.values.category];
    if (checked) {
      newCategories = newCategories.filter(cat => cat.name !== data.name);
    } else newCategories.push(data);

    formik.setFieldValue('category', newCategories);
  };

  const [categories, setCategories] = useState([]);
  const [creators, setCreators] = useState([]);
  const [mode, setMode] = useState('');
  const [creatorValue, setCreatorValue] = useState({});
  const [checked, setChecked] = useState(false);
  const [disableCategorySelection, setDisableCategorySelection] = useState(false);

  useEffect(() => {
    getCategories(props).then(cats => setCategories(cats.categories));
      let params = getUrlQueryObject();
      if ('mode' in params) setMode(params.mode);
      if (TEAM_ENABLED) {
        let params = getUrlQueryObject();
        if ('mode' in params) setMode(params.mode);
      }
  }, []);

  const creatorsData = [
    { name: 'Team', id: '1' },
    { name: 'Co-creator', id: '2' },
  ];

  const getCreators = query => {
    searchCreators({ token: props.auth?.token, query_string: query }, data => {
      const selectedCreators = formik.values.creators.map(creator => creator?.id);
      const unselectedCreators = data.filter(creator => !selectedCreators.includes(creator.id));
      setCreators(unselectedCreators);
    });
  };

  const handleCreatorsChange = data => {
    formik.setFieldValue('creators', data);
    setCreators([]);
  };

  const isLimit = formik.values.category.filter(cat => cat.name).length == 3;

  return (
    <>
      <label htmlFor="" className={commonClasses.title2}>
        What category does your project belong to? <span className={commonClasses.colorRed}>*</span>
      </label>
      <Typography style={{ marginBottom: 10 }}>
        Select any of the categories that best describe your project.
      </Typography>

      <Grid container spacing={3} className={classes.pillContainer}>
        {categories.map(cat => {
          let selected =
            formik.values.category.filter(selectedCategory => selectedCategory.name === cat.name).length > 0;
          const color = selected ? colors.primary : (isLimit || disableCategorySelection) ? '#D9DEE2' : colors.light;
          return (
            <Grid item xs={6} md={4} key={cat.name}>
              <div
                onClick={() =>
                  (isLimit && !selected) || disableCategorySelection ? null : handleChange(cat, selected)
                }
                className={classes.pill}
                style={{ border: `solid 1px ${color}` }}
              >
                <Checkbox className={commonClasses.checkbox} checked={selected} style={{ color, borderWidth: 1 }} />
                <Typography
                  className={commonClasses.inputText}
                  style={{ ...((isLimit && !selected) || disableCategorySelection && { color }) }}
                >
                  {cat.name}
                </Typography>
              </div>
            </Grid>
          );
        })}
        <Grid item xs={6} md={4}>
          <div  className={classes.pill} 
              style={{ border: `solid 1px ${disableCategorySelection || isLimit ? '#D9DEE2' : colors.light}` }}
          >
            <Checkbox
              id="disableCategorySelection"
              className={commonClasses.checkbox}
              checked={disableCategorySelection}
              style={{ color: disableCategorySelection ? '#D9DEE2' : colors.light, borderWidth: 1 }}
              onChange={() => setDisableCategorySelection(!disableCategorySelection)}
            />
            <Typography
              className={commonClasses.inputText}
              style={{ color: (disableCategorySelection || isLimit) ? '#D9DEE2' : colors.light}}

            >
              None
            </Typography>
          </div>
        </Grid>
      </Grid>

      {mode === 'team' && (
        <div style={{ marginTop: 40 }}>
          <Dropdown
            label="Add Team or Co-creator"
            placeholder="Select Team or Co-creation"
            handleChange={data => {
              setCreatorValue(data);
              formik.setFieldValue('creators', []);
            }}
            data={creatorsData}
            value={creatorValue}
            description="What team or creator did you work with for this project?"
          />

          {creatorValue?.name == 'Team' && (
            <Dropdown placeholder="Select Team name" handleChange={data => {}} data={creatorsData} />
          )}

          {creatorValue?.name == 'Co-creator' && (
            <>
              <Dropdown
                error={formik.touched.creators && formik.errors.creators}
                onBlur={formik.handleBlur}
                name="creators"
                placeholder="Select Co-creators"
                handleChange={handleCreatorsChange}
                data={creators}
                value={formik.values.creators}
                onInput={_.debounce(getCreators, 50)}
                multiple={true}
                withCheckbox={false}
              />
              <Typography>
                Would you like to make this a team?{' '}
                <Checkbox
                  onChange={() => setChecked(prev => !prev)}
                  checked={checked}
                  style={{ ...(checked && { color: colors.primary }) }}
                />
              </Typography>
            </>
          )}
        </div>
      )}
    </>
  );
}

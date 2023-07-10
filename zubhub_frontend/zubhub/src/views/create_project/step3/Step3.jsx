import React, { useEffect, useState } from 'react';
import { Dropdown } from '../../../components';
import { getCategories } from '../script';
import { getUrlQueryObject } from '../../../utils.js';
import { Checkbox, Typography } from '@material-ui/core';
import { colors } from '../../../assets/js/colors';

export default function Step3({ formik, ...props }) {
  const handleChange = data => {
    formik.setFieldValue('category', data);
  };
  const [mode, setMode] = useState('');
  const [creatorValue, setCreatorValue] = useState({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getCategories(props).then(cats => setCategories(cats.categories));
    let params = getUrlQueryObject();
    if ('mode' in params) setMode(params.mode);
  }, []);

  const [categories, setCategories] = useState([]);

  const creatorsData = [
    { name: 'Team', id: '1' },
    { name: 'Co-creator', id: '2' },
  ];

  console.log(creatorValue);
  return (
    <>
      <Dropdown
        label="What category does your project belong too?"
        placeholder="Select Categories"
        handleChange={handleChange}
        data={categories}
        value={formik.values.category}
        multiple={true}
        withCheckbox={true}
        maxSelection={3}
        description="Select any of the categories that best describe your project. Select none of you are unsure about your category."
      />
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
            <Dropdown
              placeholder="Select Team name"
              handleChange={data => setCreatorValue(data)}
              data={creatorsData}
              // value={creatorValue}
            />
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

import React, { useEffect, useState } from 'react';
import { step3Style } from './step3.styles';
import { Box, makeStyles } from '@material-ui/core';
import styles from '../../../assets/js/styles';
import { searchTags } from '../script';
import { Dropdown, TagsInput } from '../../../components';
import { getCategories } from '../script';

export default function Step3({ formik, ...props }) {
  const handleChange = data => {
    formik.setFieldValue('category', data);
  };

  useEffect(() => {
    getCategories(props).then(cats => setCategories(cats.categories));
  }, []);

  const commonClasses = makeStyles(styles)();

  const [categories, setCategories] = useState([]);

  // let valuecategory = formik.values.category?.name ? formik.values.category?.name : { name: formik.values.catogory };

  return (
    <>
      <Dropdown
        label="What category does your project belong too?"
        placeholder="Select Categories"
        handleChange={handleChange}
        data={categories}
        value={formik.values.category}
        description="Select any of the categories that best describe your project. Select none of you are unsure about your category."
      />
    </>
  );
}

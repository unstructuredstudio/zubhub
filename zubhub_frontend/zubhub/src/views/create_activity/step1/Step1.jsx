import { makeStyles } from '@material-ui/core';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, SelectFromPills } from '../../../components';
import TextInput from '../../../components/form/textInput/TextInput';
import { getCategories } from '../../../store/actions/projectActions';
import { class_grades, step1Schema } from '../script';
import { step1Styles } from './Step1.styles';
import _ from 'lodash';

export default function Step1({ formik, ...props }) {
  const classes = makeStyles(step1Styles)();
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getCategories({ t })().then(data => setCategories(data.categories));
    return () => {
      setCategories([]);
    };
  }, []);

  return (
    <div className={classes.container}>
      <TextInput
        defaultValue={formik.values.title}
        onChange={_.debounce(formik.handleChange, 500)}
        onBlur={formik.handleBlur}
        error={formik.touched.title && formik.errors.title}
        name={'title'}
        label="Activity Title"
        placeholder="What did you make?"
        required
      />

      <SelectFromPills
        name="category"
        label="What category does your activity belong too? "
        helperText="Select three categories that best describe your project. Select none if you are unsure about your category."
        data={categories}
        onChange={_.debounce(data => formik.setFieldValue('category', data), 200)}
        selectedItems={formik.values.category}
        // error={formik.touched.category && formik.errors.category}
        // onBlur={formik.handleBlur}
        limit={3}
      />

      <Dropdown
        label="Select Class Grade for this activity"
        helperText="What class grade best suites this activity"
        placeholder="Select Class grade"
        name="class_grade"
        handleChange={value => formik.setFieldValue('class_grade', value)}
        // onBlur={data => {
        //   formik.setTouched({ class_grade: true });
        //   formik.handleBlur(data);
        // }}
        value={formik.values.class_grade}
        data={class_grades}
        // error={formik.touched.class_grade && formik.errors.class_grade}
      />
    </div>
  );
}

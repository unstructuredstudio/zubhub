import { FormControl, TextField, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styles from '../../../assets/js/styles';
import FormLabel from '../../../components/form_labels/formLabel';
import TextInput from '../../../components/form/textInput/TextInput';
import { Dropdown, SelectFromPills } from '../../../components';
import { step1Styles } from './Step1.styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../../store/actions/projectActions';

export default function Step1({ formik, ...props }) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(step1Styles)();
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getCategories({ t })().then(data => setCategories(data.categories));
    return () => {};
  }, []);

  const handleClassGradeChange = data => {
    console.log(data);
  };

  const handleCategories = data => {};

  return (
    <div className={classes.container}>
      <TextInput label="Activity Title" placeholder="What did you make?" required />
      <SelectFromPills
        onChange={handleCategories}
        label="What category does your activity belong too? "
        helperText="Select three categories that best describe your project. Select none if you are unsure about your category."
        data={categories}
      />
      <Dropdown
        label="Select Class Grade for this activity"
        helperText="What class grade best suites this activity"
        placeholder="Select Class grade"
        handleChange={handleClassGradeChange}
        // handleBlur={() => handleBlur('category')}
        data={grades}
        // value={formik.values.category}
        // error={formik.touched.category && formik.errors.category}
        // multiple={true}
        // withCheckbox={true}
        // maxSelection={3}
      />
    </div>
  );
}

const grades = [
  { name: 'Grade 1-3', value: '1-3' },
  { name: 'Grade 4-6', value: '4-6' },
  { name: 'Grade 7-9', value: '7-9' },
  { name: 'Grade 10-12', value: '10-12' },
];

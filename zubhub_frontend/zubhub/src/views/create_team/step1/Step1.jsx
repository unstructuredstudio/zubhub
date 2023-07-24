import { Box, FormControl, TextField, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import styles from '../../../assets/js/styles';
// import { Editor, TagsInput } from '../../../components';
import { searchTags } from '../script';

export default function Step1({ formik, handleBlur }) {
  const commonClasses = makeStyles(styles)();
  const [value, setValue] = useState('');
  const [remoteTags, setRemoteTags] = useState([]);
  const [popularTags, setPopularTags] = useState(['Glue', 'Water', 'Battery', 'Masuring tape']);
  const clearSuggestions = () => setRemoteTags([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async value => {
    setValue(value);
    searchTags(value, (error, data) => {
      if (!error) setRemoteTags(data);
    });
  };

  const addTag = value => {
    const values = [...(formik.values?.materials_used || []), value];
    formik.setFieldValue('materials_used', values);
    clearSuggestions();
    setValue('');
  };

  const removeTag = tagIndex => {
    const tags = [...formik.values.materials_used].filter((_, index) => index !== tagIndex);
    formik.setFieldValue('materials_used', tags);
  };

  const handleDescriptionChange = value => {
    formik.setFieldValue('description', value);
  };

  let quillRef = null;

  return (
    <div>
      {/* <Editor /> */}
      <Box marginY={6}>
        <FormControl fullWidth>
          <label className={commonClasses.title2}>
           Team Name <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="title"
            placeholder="Choose a name that best suites your team"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? true : false}
            helperText={formik.touched.title && formik.errors.title}
          />
          <label className={commonClasses.title2}>
           About Team <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="title"
            multiline
            rows={4}
            placeholder="Tell us a little about your team"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? true : false}
            helperText={formik.touched.title && formik.errors.title}
          />
        </FormControl>
      </Box>

      

      
    </div>
  );
}

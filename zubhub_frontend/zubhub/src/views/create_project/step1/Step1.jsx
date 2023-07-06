import { Box, FormControl, TextField, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import styles from '../../../assets/js/styles';
import { Editor, TagsInput } from '../../../components';
import { searchTags } from '../script';

export default function Step1({ formik }) {
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

  let quillRef = null;

  return (
    <div>
      {/* <Editor /> */}
      <Box marginY={6}>
        <FormControl fullWidth>
          <label className={commonClasses.title2}>
            Name your project <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="title"
            placeholder="Choose a name that best suites your project i.e Fun with Science"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? true : false}
            helperText={formik.touched.title && formik.errors.title}
          />
        </FormControl>
      </Box>

      <Box marginTop={3} marginBottom={3}>
        <FormControl fullWidth>
          <label className={commonClasses.title2}>
            Share a few things about your Project <span className={commonClasses.colorRed}>*</span>
          </label>
          {/* <Editor variant="outlined" name="description" multiline minRows={4} placeholder="Describe your project" /> */}
          <TextField
            variant="outlined"
            name="description"
            multiline
            minRows={4}
            placeholder="Choose a name that best suites your project i.e Fun with Science"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description ? true : false}
            helperText={formik.touched.description && formik.errors.description}
          />
        </FormControl>
      </Box>

      <Box marginTop={6} marginBottom={1}>
        <TagsInput
          required
          name="materials_used"
          label="What materials did you use?"
          description="Include the materials you used for your project, this could be measuring tapes, pencils, etc"
          selectedTags={formik.values.materials_used}
          error={formik.touched.materials_used && formik.errors.materials_used}
          popularTags={popularTags}
          onChange={handleChange}
          addTag={addTag}
          value={value}
          remoteData={remoteTags}
          clearSuggestions={clearSuggestions}
          removeTag={removeTag}
          placeholder="Start typing to materials used"
        />
      </Box>
    </div>
  );
}

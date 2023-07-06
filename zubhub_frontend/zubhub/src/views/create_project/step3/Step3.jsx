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
  const [value, setValue] = useState('');
  const [remoteTags, setRemoteTags] = useState([]);
  const [popularTags, setPopularTags] = useState(testTags);
  const [categories, setCategories] = useState([]);

  const clearSuggestions = () => setRemoteTags([]);

  const handleChangeTag = async value => {
    setValue(value);
    searchTags(value, (error, data) => {
      if (!error) setRemoteTags(data);
    });
  };

  const addTag = value => {
    console.log(value);
    const values = [...formik.values.tags, value];
    formik.setFieldValue('tags', values);
    clearSuggestions();
    setValue('');
  };

  const removeTag = tagIndex => {
    const tags = [...formik.values.tags].filter((_, index) => index !== tagIndex);
    formik.setFieldValue('tags', tags);
  };

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

      <Box marginTop={6} marginBottom={1}>
        <TagsInput
          name="tags"
          label="What hashtag best describes your project?"
          description="For example, if you made flower from cardboard, you can write: cardboard, flowers, colours or leave it blank if you’re unsure."
          selectedTags={formik.values.tags}
          popularTags={popularTags}
          onChange={handleChangeTag}
          addTag={addTag}
          value={value}
          remoteData={remoteTags}
          clearSuggestions={clearSuggestions}
          removeTag={removeTag}
          placeholder="Start typing to materials used"
        />
      </Box>
    </>
  );
}

const testTags = ['Clothing', 'Animation', 'Painting', 'Science', 'Technology', 'Mechanics', 'Music', 'General'];

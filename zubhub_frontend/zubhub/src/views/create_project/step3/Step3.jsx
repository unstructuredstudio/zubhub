import React, { useEffect, useState } from 'react';
import { Dropdown } from '../../../components';
import { getCategories } from '../script';

export default function Step3({ formik, ...props }) {
  const handleChange = data => {
    formik.setFieldValue('category', data);
  };

  useEffect(() => {
    getCategories(props).then(cats => setCategories(cats.categories));
  }, []);

  const [categories, setCategories] = useState([]);

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
    </>
  );
}

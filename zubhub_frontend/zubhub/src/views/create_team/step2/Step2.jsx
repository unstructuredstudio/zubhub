import React from 'react';
// import { step2Style } from './step2.styles';
// import { ImageInput, VideoInput } from '../../../components';

export default function Step2({ formik }) {
  const handleImageChange = imgs => {
    formik.setFieldValue('images', imgs);
  };

  const handleVideoChange = (vids, link) => {
    if (!link) {
      formik.setFieldValue('video', vids);
      return;
    }
    formik.setFieldValue('video_link', vids);
  };

  return (
    <>
      
    </>
  );
}
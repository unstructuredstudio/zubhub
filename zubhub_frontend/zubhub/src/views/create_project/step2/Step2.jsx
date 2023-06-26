import React from 'react';
import { step2Style } from './step2.styles';
import { ImageInput, VideoInput } from '../../../components';

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
      <ImageInput name="images" value={formik.values.images} handleChange={handleImageChange} label="Add some photos" />
      <VideoInput
        name="videos"
        value={formik.values.video}
        linkValue={formik.values.video_link}
        handleChange={handleVideoChange}
        label="Add some videos"
        acceptLink
      />
    </>
  );
}

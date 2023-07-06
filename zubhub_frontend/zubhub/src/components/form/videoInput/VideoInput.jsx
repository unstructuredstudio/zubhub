import { Box, CardMedia, FormControl, TextField, Typography, makeStyles } from '@material-ui/core';
import { ClearRounded, CloudUploadOutlined } from '@material-ui/icons';
import React, { useRef } from 'react';
import styles from '../../../assets/js/styles';
import OrDivider from '../orDivider/OrDivider';
import { videoInputStyles } from './videoInput.styles';

export default function VideoInput({ name, label, required, value = [], handleChange, linkValue = '' }) {
  const commomClasses = makeStyles(styles)();
  const classes = makeStyles(videoInputStyles)();
  const input = useRef(null);

  const handleFileChange = files => {
    const maxAssets = 1;
    if (files?.length > maxAssets || value?.length > maxAssets) {
      alert(`You can only select up to ${maxAssets} files.`);
      return;
    }
    handleChange(Array.from([...files, ...value]));
  };

  const getPath = file => {
    if (!file) return;
    return (window.URL || window.webkitURL).createObjectURL(file);
  };

  const removeImage = file => {
    const files = value.filter(img => `${img.name}${img.size}` !== `${file.name}${file.size}`);
    handleChange(files);
  };

  const showDivider = () => {
    if (value.length === 0 && linkValue.length === 0) {
      return (
        <Box marginY={3}>
          <OrDivider />
        </Box>
      );
    }
    return null;
  };

  const uploadedVideo = value?.map((asset, index) => (
    <Box key={index} className={classes.previewBox}>
      <video controls>
        <source src={getPath(asset)} type={asset.type} />
        Your browser does not support the video tag.
      </video>
      <Box onClick={() => removeImage(asset)} className={classes.clearIcon}>
        <ClearRounded style={{ fontSize: 12 }} />
      </Box>
    </Box>
  ));

  return (
    <FormControl fullWidth>
      <label className={commomClasses.title2} htmlFor={name}>
        {label} {required && <span className={commomClasses.colorRed}>*</span>}
      </label>

      {linkValue.length === 0 && (
        <>
          <Box onClick={() => input.current.click()} className={classes.container}>
            <CloudUploadOutlined />
            <Typography>MP4 or GIFS can be added (Maximum of 1 video and 20MB each)</Typography>
          </Box>
          <Box className={classes.previewContainer}>{uploadedVideo}</Box>
        </>
      )}

      {showDivider()}

      {value.length == 0 && (
        <TextField
          placeholder="Paste your video link here"
          variant="outlined"
          value={linkValue}
          onChange={e => handleChange(e.target.value, 'link')}
        />
      )}

      <input
        ref={input}
        multiple
        accept="video/*"
        className={classes.input}
        id="input"
        type="file"
        onChange={e => handleFileChange(e.target.files)}
      />
    </FormControl>
  );
}
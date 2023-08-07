import { Box, FormControl, Typography, makeStyles } from '@material-ui/core';
import { ClearRounded, CloudUploadOutlined } from '@material-ui/icons';
import React, { useRef } from 'react';
import styles from '../../../assets/js/styles';
import { imageInputStyles } from './imageInput.styles';

const defaultMessage = 'JPG and PNG Images can be added (Maximum of 5 photos 2MB each)';

export default function ImageInput({
  name,
  label,
  required,
  value,
  handleChange,
  message = defaultMessage,
  sizeLimit,
  max = 5,
}) {
  const commomClasses = makeStyles(styles)();
  const classes = makeStyles(imageInputStyles)();
  const input = useRef(null);

  const handleFileChange = files => {
    if (files?.length > max || value?.length > max) {
      alert(`You can only select up to ${max} files.`);
      return;
    }
    handleChange(Array.from([...files, ...value]));
  };

  const getPath = file => {
    if (file.link) return file.name;
    return (window.URL || window.webkitURL).createObjectURL(file);
  };

  const removeImage = file => {
    const files = value.filter(img => `${img.name}${img.size}` !== `${file.name}${file.size}`);
    handleChange(files);
  };

  return (
    <FormControl fullWidth>
      <label className={commomClasses.title2} htmlFor={name}>
        {label} {required && <span className={commomClasses.colorRed}>*</span>}
      </label>
      <Box onClick={() => input.current.click()} className={classes.container}>
        <CloudUploadOutlined />
        <Typography>{message}</Typography>
      </Box>
      <Box className={classes.previewContainer}>
        {value?.map((img, index) => (
          <Box key={index} className={classes.previewBox}>
            <img className={classes.img} src={getPath(img)} alt="Preview" />
            <Box onClick={() => removeImage(img)} className={classes.clearIcon}>
              <ClearRounded style={{ fontSize: 12 }} />
            </Box>
          </Box>
        ))}
      </Box>
      <input
        ref={input}
        multiple
        accept="image/*"
        className={classes.input}
        id="input"
        type="file"
        onChange={e => handleFileChange(e.target.files)}
      />
    </FormControl>
  );
}

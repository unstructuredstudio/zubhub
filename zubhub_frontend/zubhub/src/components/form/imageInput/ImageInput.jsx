import { Box, FormControl, IconButton, Typography, makeStyles } from '@material-ui/core';
import { ArrowBackOutlined, ArrowForwardOutlined, ClearRounded, CloudUploadOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import styles from '../../../assets/js/styles';
import { imageInputStyles } from './imageInput.styles';
import { useEffect } from 'react';
import _ from 'lodash';
const uniqueId = 'imgContainer';

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
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    isImageContainerScroll();
    if (window) {
      window.addEventListener('resize', isImageContainerScroll);
    }
  }, []);

  useEffect(() => {
    debounce();
  }, [value]);

  const isImageContainerScroll = () => {
    const scrollableDiv = document.getElementById(uniqueId);
    if (scrollableDiv?.scrollWidth > scrollableDiv?.clientWidth) {
      if (!isScrollable) {
        setIsScrollable(true);
      }
    } else {
      if (isScrollable) {
        setIsScrollable(false);
      }
    }
  };

  const debounce = _.debounce(isImageContainerScroll, 10);

  const scrollImages = to => {
    const scrollableDiv = document.getElementById(uniqueId);
    const scrollAmount = 100;

    if (to == '>') {
      scrollableDiv.scrollLeft += scrollAmount;
    }
    if (to == '<') {
      scrollableDiv.scrollLeft -= scrollAmount;
    }
  };

  const handleFileChange = files => {
    if (files?.length + value?.length > max) {
      alert(`You can only select up to ${max} files.`);
      return;
    }

    const images = Array.from([...files, ...value]);

    handleChange(images);
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
      <Box id={uniqueId} className={classes.previewContainer}>
        {value?.map((img, index) => (
          <Box key={index} className={classes.previewBox}>
            <img className={classes.img} src={getPath(img)} alt="Preview" />
            <Box onClick={() => removeImage(img)} className={classes.clearIcon}>
              <ClearRounded style={{ fontSize: 12 }} />
            </Box>
          </Box>
        ))}
      </Box>

      {isScrollable && (
        <Box className={clsx(commomClasses.displayFlex, commomClasses.justifyCenter)} style={{ marginTop: 10 }}>
          <IconButton onClick={() => scrollImages('<')}>
            <ArrowBackOutlined />
          </IconButton>
          <IconButton onClick={() => scrollImages('>')}>
            <ArrowForwardOutlined />
          </IconButton>
        </Box>
      )}

      <input
        ref={input}
        multiple
        accept="image/*"
        className={clsx(classes.input, commomClasses.inputText)}
        id="input"
        type="file"
        onChange={e => handleFileChange(e.target.files)}
      />
    </FormControl>
  );
}

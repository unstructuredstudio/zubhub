import { Box, ClickAwayListener, FormControl, FormHelperText, Typography, makeStyles } from '@material-ui/core';
import { Add, ClearRounded } from '@material-ui/icons';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import styles from '../../../assets/js/styles';
import CustomButton from '../../button/Button';
import { tagsInputStyles } from './tagsInput.styles';

export default function TagsInput({
  label,
  required,
  name,
  onChange,
  value,
  description,
  error,
  popularTags,
  selectedTags = [],
  placeholder,
  addTag,
  remoteData,
  clearSuggestions,
  removeTag,
  handleBlur,
}) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(tagsInputStyles)();
  const [isSearching, setIsSearching] = useState(false);
  selectedTags = [...(selectedTags ?? [])];
  const ref = useRef(null);

  const handleChange = e => {
    setIsSearching(true);
    onChange(e.target.value);
  };

  console.log(selectedTags, name);

  const handleClickAway = () => setIsSearching(false);
  const handleFocus = () => {
    clearSuggestions();
  };

  const handleTagAddition = value => {
    addTag(value);
    setIsSearching(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      addTag(e.target.value);
      setIsSearching(false);
    }
  };

  const onSelectedTagClick = index => removeTag(index);

  popularTags = popularTags?.map((tag, index) => (
    <CustomButton
      onClick={() => handleTagAddition(tag)}
      disabled={selectedTags.includes(tag)}
      className={clsx(classes.button, selectedTags.includes(tag) && classes.disabledButton)}
      primaryButtonOutlinedStyle
      key={index}
      startIcon={<Add />}
    >
      {tag}
    </CustomButton>
  ));

  selectedTags = selectedTags?.map((tag, index) => (
    <CustomButton
      onClick={() => onSelectedTagClick(index)}
      className={classes.button}
      primaryButtonStyle
      key={index}
      endIcon={<ClearRounded />}
    >
      {tag}
    </CustomButton>
  ));

  remoteData = remoteData?.map((tag, index) => (
    <Box key={index} onClick={() => handleTagAddition(tag.name)} className={classes.suggestion}>
      <Typography>{tag.name}</Typography>
    </Box>
  ));

  return (
    <FormControl fullWidth>
      <label className={commonClasses.title2}>
        {label} {required && <span className={commonClasses.colorRed}>*</span>}
      </label>
      <Typography style={{ marginBottom: 10 }}>{description}</Typography>
      <Box className={classes.tagsContainer}>
        {selectedTags}
        <input
          ref={ref}
          onFocus={handleFocus}
          className={classes.input}
          id={name}
          value={value}
          onBlur={handleBlur}
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </Box>

      {isSearching ? (
        <Box style={{ position: 'relative' }}>
          <Box className={classes.suggestionBox}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box>{remoteData.length > 0 ? remoteData : <p>Item not found: Hit Enter to Save your Input</p>}</Box>
            </ClickAwayListener>
          </Box>
        </Box>
      ) : null}

      {error && <FormHelperText className={commonClasses.colorRed}>{error}</FormHelperText>}
      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>{popularTags}</Box>
    </FormControl>
  );
}

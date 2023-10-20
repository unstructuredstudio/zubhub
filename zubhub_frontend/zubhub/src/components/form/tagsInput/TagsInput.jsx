import { Box, ClickAwayListener, FormControl, FormHelperText, Typography, makeStyles } from '@material-ui/core';
import { Add, ClearRounded } from '@material-ui/icons';
import clsx from 'clsx';
import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../assets/js/styles';
import CustomButton from '../../button/Button';
import { tagsInputStyles } from './tagsInput.styles';
import _ from 'lodash';

export default function TagsInput({
  label,
  required,
  name,
  onChange,
  value,
  description,
  error,
  popularTags,
  selectedTags: initialSelectedTags = [],
  placeholder,
  addTag,
  remoteData,
  clearSuggestions,
  removeTag,
  handleBlur,
  prefix,
}) {
  const { t } = useTranslation();
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(tagsInputStyles)();
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const selectedTags = [...(initialSelectedTags ?? [])];
  const ref = useRef(null);

  const validateTag = useCallback((tag, selectedTags) => {
    const trimmedTag = tag.trim();
    if (trimmedTag === '') {
      return [t('pageWrapper.errors.tagCannotBeEmpty'), false];
    } else if (selectedTags.includes(trimmedTag)) {
      return [t('pageWrapper.errors.tagAlreadyInSearch', { tagName: trimmedTag }), false];
    } else {
      return ['', true];
    }
  }, [t]);

  const handleTagAddition = useCallback((value) => {
    const [errMsg, isValid] = validateTag(value, selectedTags);
    setErrorMessage(errMsg);
    if (isValid) {
      addTag(value);
      setIsSearching(false);
      setErrorMessage('');
    }
  }, [addTag, selectedTags, validateTag]);

  const handleChange = useCallback((e) => {
    const inputValue = e.target.value.trim();
    const [errMsg, isValid] = validateTag(inputValue, selectedTags);
    setIsSearching(isValid);
    setErrorMessage(errMsg);
    if (isValid) {
      onChange(inputValue);
    }
  }, [onChange, selectedTags, validateTag]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const inputValue = ref.current.value.trim();
      const [errMsg, isValid] = validateTag(inputValue, selectedTags);
      setErrorMessage(errMsg);
      if (isValid) {
        addTag(inputValue);
        setIsSearching(false);
        setErrorMessage('');
        ref.current.value = '';
      }
    }
  }, [addTag, selectedTags, validateTag]);

  const handleClickAway = useCallback(() => {
    const inputValue = ref.current.value.trim();
    if (!inputValue || selectedTags.includes(inputValue)) {
      setIsSearching(false);
      setErrorMessage('');
    } else {
      const isFound = remoteData.some(tag => tag.name === inputValue);
      if (isFound || !remoteData.length) {
        addTag(inputValue);
        setIsSearching(false);
        setErrorMessage('');
        ref.current.value = '';
      } else {
        setErrorMessage(t('pageWrapper.errors.tagNotFound', { tagName: inputValue }));
      }
    }
  }, [t, addTag, remoteData, selectedTags]);
  
  const onSelectedTagClick = useCallback((index) => removeTag(index), [removeTag]);

  return (
    <FormControl fullWidth>
      <label className={commonClasses.title2}>
        {label} {required && <span className={commonClasses.colorRed}>*</span>}
      </label>
      <Typography style={{ marginBottom: 10 }}>{description}</Typography>
      <Box className={clsx(classes.tagsContainer, error && commonClasses.borderRed)}>
        {selectedTags?.map((tag, index) => (
          <CustomButton
            onClick={() => onSelectedTagClick(index)}
            className={classes.button}
            primaryButtonStyle
            key={index}
            endIcon={<ClearRounded />}
          >
            {prefix && `${prefix} `}
            {tag}
          </CustomButton>
        ))}
        <input
          ref={ref}
          onFocus={clearSuggestions}
          className={clsx(classes.input, commonClasses.inputText)}
          id={name}
          defaultValue={value}
          onBlur={() => handleBlur({ target: { name, value: selectedTags } })}
          name={name}
          placeholder={placeholder}
          onChange={_.debounce(handleChange, 500)}
          onKeyDown={handleKeyDown}
        />
      </Box>

      {isSearching ? (
        <Box style={{ position: 'relative' }}>
          <Box className={classes.suggestionBox}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box>
                {remoteData.length > 0
                  ? remoteData.map((tag, index) => (
                      <Box key={index} onClick={() => handleTagAddition(tag.name)} className={classes.suggestion}>
                        <Typography>{tag.name}</Typography>
                      </Box>
                    ))
                  : <p>Item not found: Hit Enter to Save your Input</p>}
              </Box>
            </ClickAwayListener>
          </Box>
        </Box>
      ) : null}

      <FormHelperText className={commonClasses.colorRed}>{errorMessage || error}</FormHelperText>
      <Box className={classes.tagsContainer}>
        {popularTags?.map((tag, index) => (
          <CustomButton
            onClick={() => handleTagAddition(tag)}
            disabled={selectedTags.includes(tag)}
            className={clsx(classes.button, selectedTags.includes(tag) && classes.disabledButton, tag === 'General' && classes.generalTag)}
            key={index}
            startIcon={<Add />}
          >
            {prefix && `${prefix} `}
            {tag}
          </CustomButton>
        ))}
      </Box>
    </FormControl>
  );
}

import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import styles from '../../assets/js/styles/components/autocomplete/optionStyles.js';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(styles);

const Option = ({ option, inputValue, onOptionClick }) => {
  const classes = useStyles();

  const matches = match(option.title, inputValue);
  const parts = parse(option.title, matches);

  const title = parts.map((part, index) => (
    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
      {part.text}
    </span>
  ));

  const OptionWrap = option.link ? 'a' : 'div';

  return (
    <OptionWrap
      onClick={onOptionClick}
      className={classes.option}
      href={option.link}
    >
      <div>
        {title}
        {option.shortInfo && (
          <span className={classes.shortInfo}>{option.shortInfo}</span>
        )}
      </div>
      {option.image && (
        <div className={classes.optionImageWrapper}>
          <img
            src={option.image}
            alt={option.title}
            className={classes.optionImage}
          />
        </div>
      )}
    </OptionWrap>
  );
};

export default Option;

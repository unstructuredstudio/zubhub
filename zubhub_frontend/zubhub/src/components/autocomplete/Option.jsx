import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import styles from '../../assets/js/styles/components/autocomplete/optionStyles.js';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(styles);

const Option = ({ option, inputValue, onOptionClick }) => {
  const classes = useStyles();

  const matches = match(option.title, inputValue, { insideWords: true });
  const parts = parse(option.title, matches);

  const title = parts.map((part, index) => (
    <pre key={index} className={classes.optionTitle} style={{ fontWeight: part.highlight ? 700 : 400 }}>
      {part.text}
    </pre>
  ));

  const OptionWrap = option.link ? 'a' : 'div';

  return (
    <OptionWrap onClick={e => onOptionClick(e, option)} className={classes.option} href={option.link}>
      <div className={classes.infoWrapper}>
        <span className={classes.optionTitleWrapper}>{title}</span>
        {option.shortInfo && <span className={classes.shortInfo}>{option.shortInfo}</span>}
      </div>
      {option.image && (
        <div className={classes.optionImageWrapper}>
          <img src={option.image} alt={option.title} className={classes.optionImage} />
        </div>
      )}
    </OptionWrap>
  );
};

export default Option;

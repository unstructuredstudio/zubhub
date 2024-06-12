import { makeStyles, useTheme } from '@mui/styles';
import Chip from '@mui/material/Chip';
import { styles } from './categories.styles';

const Categories = ({ categories }) => {
  const classes = makeStyles(styles)();
  const theme = useTheme();
  return (
    <div className={classes.container}>
      {categories?.map(category => (
        <Chip
          key={category}
          label={category}
          variant="outlined"
          className={classes.chip}
          size="small"
          style={{ background: theme.categoryColors[category] }}
        />
      ))}
    </div>
  );
};

export default Categories;

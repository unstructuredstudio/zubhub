import { makeStyles, useTheme } from "@material-ui/core";
import { styles } from "./categories.styles";
import Chip from '@material-ui/core/Chip';

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
          style={{ background: theme.categoryColors[category]}}
        />
      ))}
    </div>
  );
};

export default Categories;
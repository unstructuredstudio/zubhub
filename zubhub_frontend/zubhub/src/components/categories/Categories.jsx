import { makeStyles } from "@material-ui/core";
import { styles } from "./categories.styles";
import Chip from '@material-ui/core/Chip';
import { categoryColors } from "../../assets/js/colors"

const Categories = ({ categories }) => {
  const classes = makeStyles(styles)();
  return (
    <div className={classes.container}>
      {categories?.map(category => (
        <Chip
          key={category}
          label={category}
          variant="outlined"
          className={classes.chip}
          size="small"
          style={{ background: categoryColors[category]}}
        />
      ))}
    </div>
  );
};

export default Categories;
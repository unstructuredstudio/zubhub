import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { orDividerStyle } from './orDivider.style';

export default function OrDivider() {
  const classes = makeStyles(orDividerStyle)();

  return (
    <div className={classes.container}>
      <hr />
      <Typography>OR</Typography>
    </div>
  );
}

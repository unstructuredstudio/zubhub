import React from 'react';
import Popper from '@material-ui/core/Popper';
import { useEffect } from 'react';

const NotificationPanel = ({ open, anchorEl }) => {
  console.log(open);
  useEffect(() => {
    console.log(anchorEl);
  }, [anchorEl]);
  return (
    <Popper id={'yo'} open={open} anchorEl={anchorEl.current} disablePortal>
      <div>The content of the Popper.</div>
    </Popper>
  );
};

export default NotificationPanel;

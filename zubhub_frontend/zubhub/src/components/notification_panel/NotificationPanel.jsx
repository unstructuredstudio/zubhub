import React from 'react';
import Popper from '@material-ui/core/Popper';

const NotificationPanel = ({ open, anchorEl }) => {
  return (
    <Popper id={'yo'} open={open} anchorEl={anchorEl}>
      <div>The content of the Popper.</div>
    </Popper>
  );
};

export default NotificationPanel;

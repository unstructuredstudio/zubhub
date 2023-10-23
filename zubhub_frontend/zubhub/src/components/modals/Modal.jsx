import { Dialog, makeStyles } from '@material-ui/core';
import React from 'react';
import styles from '../../assets/js/styles';
import { modalStyles } from './modal.styles';

function Modal({ open, onClose = () => {}, children }) {
  const classes = makeStyles(modalStyles)();

  return (
    <Dialog className={classes.dialogContainer} maxWidth="xs" open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
}

Modal.WithIcon = ({ open, onClose = () => {}, children, icon }) => {
  const classes = makeStyles(modalStyles)();

  return (
    <Dialog
      className={classes.dialogContainer}
      maxWidth="xs"
      open={open}
      onClose={onClose}
      PaperProps={{className: classes.dialogPaper}}
    >
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <div className={classes.successDialogHeaderIcon}>{icon}</div>
      </div>
      {children}
    </Dialog>
  );
};

export default Modal;

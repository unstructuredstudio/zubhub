import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom'; // Make sure to import Link along with useHistory
import { sessionExpiredStyle } from './sessionExpired.Style';
import Modal from '../modals/Modal';
import CustomButton from '../button/Button';
import ExpiredSessionIcon from '../../assets/images/session_expired.svg';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(sessionExpiredStyle);

const SessionExpiredCard = () => {
    const classes = useStyles();
    const [modalOpen, setModalOpen] = useState(true);
    const history = useHistory();

    const handleClose = () => {
        setModalOpen(false);
        history.push('/login');
    };

    return (
        <Modal open={modalOpen} className={classes.modal}>
            <Card className={classes.card}>
                <div className={classes.cardHeader}>
                    <Typography variant="h6">Session Expired</Typography>
                    <Typography variant="button" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </Typography>
                </div>
                <CardContent className={classes.cardContent}>
                    <div className={classes.iconWrapper}>
                        <img src={ExpiredSessionIcon} alt="expired session icon" className={classes.icon} />
                    </div>
                    <Typography variant="body1" className={classes.centerText}>Your session has expired</Typography>
                    <Typography variant="body2" className={classes.centerText}>You will be redirected to the login page</Typography>
                    <div className={classes.buttonContainer}>
                        <Link to="/login" className={classes.textDecorationNone}>
                            <CustomButton
                                variant="outlined"
                                size="small"
                                primaryButtonStyle
                                customButtonStyle
                            >
                                Login
                            </CustomButton>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Modal>
    );
};

export default SessionExpiredCard;

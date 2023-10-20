import React from 'react';
import { Button, Card, CardContent, Typography, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sessionExpiredStyle } from './sessionExpired.Style';

const useStyles = makeStyles(sessionExpiredStyle);

const SessionExpiredCard = () => {
    const classes = useStyles();
    const open = true;

    return (
        <Modal open={open} className={classes.modal}>
            <Card className={classes.card}>
                <div className={classes.cardHeader}>
                    <Typography variant="h6">Session Expired</Typography>
                    <Typography variant="button" className={classes.closeButton}>X</Typography>
                </div>
                <CardContent className={classes.cardContent}>
                    <Typography variant="body1" className={classes.alertIcon}>⚠️</Typography>
                    <Typography variant="body1">Your session has expired</Typography>
                    <Typography variant="body2">You will be redirected to the login page</Typography>
                    <Button variant="contained" color="primary" style={{ marginTop: 16 }}>Ok</Button>
                </CardContent>
            </Card>
        </Modal>
    );
};

export default SessionExpiredCard;

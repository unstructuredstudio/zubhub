import React, { useState } from 'react';
import styles from '../../assets/js/styles/components/notification/NotificationStyles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

const NOTIFICATION_TYPE = {
    ALL: 'ALL',
    CLAP: 'CLAP',
    COMMENT: 'COMMENT',
    SAVE: 'SAVE',
    FOLLOW: 'FOLLOW',
};

// viewed = 1, !viewed = 0
const Notification = ( notification ) => {
    const classes = useStyles();
    return (
        // notification.source links to new follower's profile
        { notification.type == NOTIFICATION_TYPE.FOLLOW && (
            <div 
                display='flex' 
                href={ notification.source.user }
            >
                <img src={ notification.source.user.picture } alt="user-profile"/>

                <p>{ notification.message }</p>

                {!notification.viewed && (
                    <div className='viewDot'></div>
                )}
            </div>
        )}

        // notification.source links to project liked, saved, commented on, etc.
        { notification.type != NOTIFICATION_TYPE.FOLLOW && (
            <div 
                display='flex' 
                href={ notification.source.project }
            >
                <img src={ notification.source.user.picture } alt="user-profile"/>

                <p>{ notification.message }</p>

                {!notification.viewed && (
                    <div className='viewDot'></div>
                )}
            </div>
        )}
    );
};

export default Notification;
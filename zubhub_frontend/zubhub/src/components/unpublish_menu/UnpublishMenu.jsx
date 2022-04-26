import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal,
    Typography,
    Button,
    Menu,
    MenuItem,
  } from '@material-ui/core';

import styles from '../../assets/js/styles/components/unpublish_menu/unpublishMenuStyles';
import commonStyles from '../../assets/js/styles'

import CustomButton from '../../components/button/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import UnpublishForm from '../../components/unpublish_form/UnpublishForm.jsx';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UnpublishMenu() {
    const classes = useStyles();
    const common_classes = useCommonStyles();

    const [open, setOpen] = useState(false);

    return (
        <>
            <CustomButton
                onClick={() => setOpen(true)}
                className={clsx(
                    classes.unpublishMenuButtonStyle,
                )}
            >
              <MoreVertIcon />
            </CustomButton>
            <Menu
                open={open}
                onClose={()=>setOpen(false)}
            >
                <UnpublishForm/>
            </Menu>
        </>
    );
}

export default UnpublishMenu;
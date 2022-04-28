import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
	Modal,
	Box,
	Button,
	MenuItem,
	Typography,
	FormGroup,
	FormControlLabel,
	Checkbox,
  } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/components/unpublish_form/unpublishFormStyles';
import commonStyles from '../../assets/js/styles'
import API from '../../api';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function UnpublishForm() {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [reasons, setReasons] = useState(['Promotes bigotry, discrimination, hatred, or violence against any individual or group', 'Threatens, harasses, or intimidates any other person, whether that person is a ZubHub user or not', 'Contains foul language or personal attacks', 'Contains sexually explicit or graphically violent material']);

	const token = useSelector((state) => state.auth.token);

	// useEffect(() => {
	// 	const api = new API();
	// 	setReasons(api.getReasons(token));
	// }, []);

	return (
		<>
		<MenuItem
			onClick={() => setOpen(true)}
		>
			Unpublish
		</MenuItem>
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			aria-lebelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
		  <Box className={classes.unpublishModalStyle}>
		  <CloseIcon
			onClick={() => setOpen(false)}
			className={classes.closeIconStyle}
		  ></CloseIcon>
			<Typography
				className={classes.descriptionHeadingStyle}
			>
				Why are you unpublishing this?
			</Typography>
			<Typography
				className={classes.descriptionBodyStyle}
			>
				Please select the terms of use that have been breached.
			</Typography>

			<FormGroup className={classes.descriptionBodyStyle}>
				{
					reasons.map(reason => (
						<FormControlLabel className={classes.checkboxStyle} control={<Checkbox className={classes.checkboxStyle}/>} label={reason}/>
					))
				}
			</FormGroup>

			<CustomButton 
				dangerButtonStyle className={classes.hideProjectButtonStyle}
				onClick={() => setOpen(false)}
			>
				Hide Project
			</CustomButton>
		  </Box>
		</Modal>
		</>
	);
};

export default UnpublishForm;
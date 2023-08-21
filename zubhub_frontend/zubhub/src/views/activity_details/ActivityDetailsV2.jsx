import React, { useState } from 'react';
import { activityDefailsStyles } from './ActivityDetails.styles';
import { Avatar, Divider, IconButton, Menu, MenuItem, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import styles from '../../assets/js/styles/index';
import { colors } from '../../assets/js/colors';
import { ExpandMore, MoreVert } from '@material-ui/icons';
import { CustomButton, ImageInput, VideoInput } from '../../components';
import SocialButtons from '../../components/social_share_buttons/socialShareButtons';
import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import VisibilityIcon from '@material-ui/icons/Visibility';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { useTranslation } from 'react-i18next';

export default function ActivityDetailsV2() {
  const classes = makeStyles(activityDefailsStyles)();
  const commonClasses = makeStyles(styles)();
  const { t } = useTranslation();

  return (
    <div style={{ margin: '0 24px' }}>
      <div className={clsx(classes.header, classes.card)}>
        <Typography align="center" className={clsx(commonClasses.title1)}>
          Making a Led Light
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 }}>
          <div style={{ gap: 8 }} className={clsx(commonClasses.alignCenter, commonClasses.displayFlex)}>
            <Avatar className={classes.creatorAvatarStyle} src={''} alt={'Faridah_ux'} />
            <div>
              <Typography style={{ fontWeight: '500', fontSize: 16 }} color={colors.black} component="span">
                Faridah_ux
              </Typography>
              <br />
              <Typography color="textSecondary" component="span">
                Educator
              </Typography>
            </div>
          </div>
          <AnchorElemt />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, gap: 10 }}>
          <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
            Create this Project
          </CustomButton>
          <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
            Download PDF
          </CustomButton>
        </div>
      </div>
      <div
        style={{
          backgroundColor: colors.primary,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '16px 0',
          borderRadius: 8,
        }}
      >
        <IconButton
          className={classes.actionBoxButtonStyle}
          aria-label={t('projectDetails.ariaLabels.likeButton.label')}
          //   onClick={e => handleSetState(toggleLike(e, props, project.id))}
        >
          {/* {project.likes.includes(props.auth.id) ? (
            <ClapIcon color={colors.white} arial-label={t('projectDetails.ariaLabels.likeButton.unlilke')} />
          ) : ( */}
          <ClapBorderIcon color={colors.white} arial-label={t('projectDetails.ariaLabels.likeButton.like')} />
          {/* )} */}
        </IconButton>
        <IconButton
          className={classes.actionBoxButtonStyle}
          aria-label={t('projectDetails.ariaLabels.saveButton.label')}
          //   onClick={e => handleSetState(toggleSave(e, props, project.id))}
        >
          {/* {project.saved_by.includes(props.auth.id) ? (
            <BookmarkIcon aria-label={t('projectDetails.ariaLabels.saveButton.unsave')} />
          ) : ( */}
          <BookmarkBorderIcon aria-label={t('projectDetails.ariaLabels.saveButton.save')} />
          {/* )} */}
        </IconButton>

        <IconButton className={classes.actionBoxButtonStyle}>
          <VisibilityIcon />
        </IconButton>

        <SocialButtons />
      </div>
      <Collapsible title={'Introduction'}>
        <div
          style={{
            backgroundColor: '#eee',
            backgroundImage: 'url()',
            height: 150,
            backgroundSize: 'fit',
            borderRadius: 8,
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <img
            style={{ width: '100%' }}
            src="https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
            alt="activity image"
          />
        </div>
        <Typography>
          Lorem ipsum dolor sit amet consectetur. Nulla ullamcorper adipiscing urna non enim ullamcorper a. Non
          dignissim sit cras pellentesque vestibulum cursus tincidunt porttitor. Ut nulla urna in egestas arcu quis
          ornare. Sum dolor sit amet consectetur. Nulla ullamcorper adipiscing urna non enim.
        </Typography>
      </Collapsible>

      <Collapsible title={'Category'}>
        <div className={clsx(commonClasses.displayFlex, commonClasses.gap)}>
          <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
            Mechanical
          </CustomButton>
          <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
            Science
          </CustomButton>
        </div>
      </Collapsible>

      <Collapsible title={'Class Grade'}>
        <div className={clsx(commonClasses.displayFlex, commonClasses.gap)}>
          <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
            Grade 4-6
          </CustomButton>
        </div>
      </Collapsible>

      <Collapsible title={'Materials Used'}>
        <ImageInput value={materials_used_images} />
      </Collapsible>
    </div>
  );
}

const AnchorElemt = ({ moveDown, moveUp, deleteStep }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMoveUp = () => {
    moveUp();
    handleClose();
  };

  const handleMoveDown = () => {
    moveDown();
    handleClose();
  };

  return (
    <>
      <IconButton
        id={`basic-button`}
        aria-controls={open ? `menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={`menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `basic-button`,
        }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const Collapsible = ({ title, children }) => {
  const classes = makeStyles(activityDefailsStyles)();
  const commonClasses = makeStyles(styles)();
  const [open, setOpen] = useState(true);

  return (
    <div className={clsx(classes.card, classes.expandableMargin, commonClasses.boxShadow)}>
      <div className={clsx(commonClasses.displayFlex, commonClasses.justifySpaceBetween, commonClasses.alignCenter)}>
        <Typography className={commonClasses.title2}>{title}</Typography>
        <IconButton onClick={() => setOpen(prev => !prev)}>
          <ExpandMore />
        </IconButton>
      </div>
      <div className={clsx(classes.closed, open && classes.expanded)}>{children}</div>
    </div>
  );
};

const materials_used_images = [
  {
    link: true,
    name: 'https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    link: true,
    name: 'https://images.unsplash.com/photo-1523247297454-ef69fd04e051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    link: true,
    name: 'https://images.unsplash.com/photo-1448697138198-9aa6d0d84bf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
];

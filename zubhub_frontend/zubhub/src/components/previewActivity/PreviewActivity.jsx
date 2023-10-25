import { Avatar, Box, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Collapsible, Gallery } from '..';
import ZubHubAPI from '../../api';

import { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import ErrorPage from '../../views/error/ErrorPage';
import LoadingPage from '../../views/loading/LoadingPage';
import CustomButton from '../button/Button';
import SocialButtons from '../social_share_buttons/socialShareButtons.jsx';

import { DescriptionOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { images } from '../../assets/images';
import { colors } from '../../assets/js/colors.js';
import commonStyles from '../../assets/js/styles';
import { getUrlQueryObject } from '../../utils.js/index.js';
import activityDefailsStyles from './previewActivity.styles';

const API = new ZubHubAPI();

function PreviewActivity({ onClose, ...props }) {
  const classes = makeStyles(activityDefailsStyles)();
  const commonClasses = makeStyles(commonStyles)();

  const { t } = useTranslation();
  const [activity, setActivity] = useState({});
  const [open, setOpen] = useState(false);
  const creator = activity.creators?.[0];
  const auth = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    setIsLoading(true);
    API.getActivity({ token: auth?.token, id: props.match.params.id })
      .then(data => {
        setActivity(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleDialog = () => {
    setOpen(!open);
    props.history.replace(window.location.pathname);
  };

  if (isLoading) {
    return <LoadingPage />;
  } else if (Object.keys(activity).length > 0) {
    return (
      <div className={classes.previewRoot}>
        <div className={classes.previewheader}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <DescriptionOutlined />
            <Typography>Preview Draft</Typography>
          </div>

          <CustomButton onClick={onClose} primaryButtonOutlinedStyle style={{ padding: '2px 10px' }}>
            Close
          </CustomButton>
        </div>
        <div className={classes.body}>
          <div className={classes.navbar}>
            <img src={images.logo} height={25} />
          </div>
          {/* <div className={classes.breadcrum}></div> */}
          <Box className={classes.root}>
            <div style={{ margin: '24px 24px' }}>
              <div className={clsx(classes.header, classes.card)}>
                <Typography align="center" className={clsx(commonClasses.title1)}>
                  {activity?.title}
                </Typography>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 }}>
                  <div style={{ gap: 8 }} className={clsx(commonClasses.alignCenter, commonClasses.displayFlex)}>
                    <Avatar className={classes.creatorAvatarStyle} src={creator?.avatar} alt={'Faridah_ux'} />
                    <div>
                      <Typography
                        style={{ fontWeight: '500', fontSize: 16, textTransform: 'capitalize' }}
                        color={colors.black}
                        component="span"
                      >
                        {creator?.username}
                      </Typography>
                      <br />
                      <Typography color="textSecondary" component="span">
                        Educator
                      </Typography>
                    </div>
                  </div>
                  {/* <AnchorElemt isLoading={isLoading.delete} onDelete={handleDelete} onEdit={handleEdit} /> */}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 32,
                    gap: 10,
                  }}
                >
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
                >
                  <ClapBorderIcon color={colors.white} arial-label={t('projectDetails.ariaLabels.likeButton.like')} />
                  {/* )} */}
                </IconButton>
                <IconButton
                  className={classes.actionBoxButtonStyle}
                  aria-label={t('projectDetails.ariaLabels.saveButton.label')}
                >
                  <BookmarkBorderIcon aria-label={t('projectDetails.ariaLabels.saveButton.save')} />
                </IconButton>

                <IconButton className={classes.actionBoxButtonStyle}>
                  <VisibilityIcon />
                </IconButton>

                <SocialButtons />
              </div>

              <Collapsible title={'Introduction'}>
                {activity.images?.length > 0 && <Gallery images={activity.images?.map(img => img.image?.file_url)} />}
                <ReactQuill
                  className={classes.descriptionBodyStyle}
                  theme={'bubble'}
                  readOnly={true}
                  value={activity.introduction || ''}
                />
              </Collapsible>

              {activity.category?.length > 0 && (
                <Collapsible title={'Categories'}>
                  <div className={clsx(commonClasses.displayFlex, commonClasses.gap)}>
                    {activity.category?.map((cat, index) => (
                      <CustomButton key={index} primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
                        {cat}
                      </CustomButton>
                    ))}
                  </div>
                </Collapsible>
              )}

              {activity.class_grade && (
                <Collapsible title={'Class Grade'}>
                  <div className={clsx(commonClasses.displayFlex, commonClasses.gap)}>
                    <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
                      {activity.class_grade}
                    </CustomButton>
                  </div>
                </Collapsible>
              )}

              {activity.materials_used && (
                <Collapsible title={'Materials Used'}>
                  {activity.materials_used_image && <Gallery images={[activity.materials_used_image?.file_url]} />}
                  <ReactQuill
                    className={classes.descriptionBodyStyle}
                    theme={'bubble'}
                    readOnly={true}
                    value={activity.materials_used || ''}
                  />
                </Collapsible>
              )}

              {activity.making_steps?.map((step, index) => (
                <Collapsible key={index} title={`Step ${step?.step_order}: ${step.title}`}>
                  {step.image?.length > 0 && <Gallery images={step.image?.map(img => img?.file_url)} />}
                  {step.description && (
                    <ReactQuill
                      className={classes.descriptionBodyStyle}
                      theme={'bubble'}
                      readOnly={true}
                      value={step.description || ''}
                    />
                  )}
                </Collapsible>
              ))}
            </div>
          </Box>
        </div>
      </div>
    );
  } else {
    return <ErrorPage error={t('projectDetails.errors.unexpected')} />;
  }
}

PreviewActivity.propTypes = {
  auth: PropTypes.object.isRequired,
  getProject: PropTypes.func.isRequired,
  getUserProjects: PropTypes.func.isRequired,
  suggestCreators: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  unpublishComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
};

export default PreviewActivity;

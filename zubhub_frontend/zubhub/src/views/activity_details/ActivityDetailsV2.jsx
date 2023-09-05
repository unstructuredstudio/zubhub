import {
  Avatar,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { CloseOutlined, ExpandMore, MoreVert } from '@material-ui/icons';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { FiShare } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import ZubHubAPI from '../../api';
import { colors } from '../../assets/js/colors';
import { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import styles from '../../assets/js/styles/index';
import { CustomButton, Gallery, Modal } from '../../components';
import Activity from '../../components/activity/activity';
import SocialButtons from '../../components/social_share_buttons/socialShareButtons';
import { getUrlQueryObject } from '../../utils.js';
import { activityDefailsStyles } from './ActivityDetails.styles';
import { useReactToPrint } from 'react-to-print';
import Html2Pdf from 'html2pdf.js';

const API = new ZubHubAPI();
const authenticatedUserActivitiesGrid = { xs: 12, sm: 6, md: 6 };
const unauthenticatedUserActivitiesGrid = { xs: 12, sm: 6, md: 3 };

export default function ActivityDetailsV2(props) {
  const classes = makeStyles(activityDefailsStyles)();
  const commonClasses = makeStyles(styles)();

  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  let ref = useRef(null);

  const [activity, setActivity] = useState({});
  const [{ height, width }, setDimensions] = useState({});
  const [open, setOpen] = useState(false);
  const [moreActivities, setMoreActivities] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [isDownloading, setIsDownloading] = useState(undefined);

  const creator = activity.creators?.[0];

  useEffect(() => {
    API.getActivity({ token: auth?.token, id: props.match.params.id }).then(data => {
      setActivity(data);
    });

    const query = getUrlQueryObject();
    if (query.success) {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      toggleDialog();
    }

    API.getActivities({ limit: 4 })
      .then(res => res.json())
      .then(data => setMoreActivities(data));
  }, []);

  const handleDelete = () => {
    setIsLoading({ ...isLoading, delete: true });
    API.deleteActivity({ token: auth.token, id: activity.id })
      .then(() => props.history.push(`/activities`))
      .finally(() => setIsLoading({ ...isLoading, delete: false }));
  };

  const handleEdit = () => {
    props.history.push(`${props.location.pathname}/edit`);
  };

  const toggleDialog = () => {
    setOpen(!open);
    props.history.replace(window.location.pathname);
  };

  const handleDownload = useReactToPrint({
    onBeforePrint: () => setIsDownloading(true),
    onPrintError: error => setIsDownloading(false),
    onAfterPrint: () => setIsDownloading(false),
    content: () => ref.current,
    removeAfterPrint: true,
    print: async printIframe => {
      const document = printIframe.contentDocument;
      if (document) {
        const html = document.getElementsByTagName('html')[0];
        const pdfOptions = {
          padding: 10,
          filename: `${activity.title}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        const exporter = new Html2Pdf(html, pdfOptions);
        await exporter.getPdf(true);
      }
    },
  });

  return (
    <div ref={ref} style={{ margin: '0 24px' }}>
      {open ? <ReactConfetti width={width} height={height} /> : null}
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
          <AnchorElemt isLoading={isLoading.delete} onDelete={handleDelete} onEdit={handleEdit} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, gap: 10 }}>
          <CustomButton primaryButtonOutlinedStyle style={{ borderRadius: 4 }}>
            Create this Project
          </CustomButton>
          <CustomButton
            onClick={handleDownload}
            loading={isDownloading}
            primaryButtonOutlinedStyle
            style={{ borderRadius: 4 }}
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
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

      <div style={{ marginTop: 40 }} className={clsx(classes.card, commonClasses.boxShadow)}>
        <div
          className={clsx(
            commonClasses.displayFlex,
            commonClasses.flexColumn,
            commonClasses.justifyCenter,
            commonClasses.gap,
          )}
        >
          <Typography align="center" className={commonClasses.title1}>
            Did you like this activity?
          </Typography>
          <Typography align="center">Be the first to create it</Typography>
          <CustomButton style={{ alignSelf: 'center' }} primaryButtonStyle>
            Create It!
          </CustomButton>
        </div>

        <Typography
          style={{
            marginTop: 50,
            marginBottom: 30,
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.black,
          }}
          align="center"
        >
          More Activities
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {moreActivities.map((activity, index) => (
            <Grid
              key={index}
              item
              {...(auth.token ? authenticatedUserActivitiesGrid : unauthenticatedUserActivitiesGrid)}
              align="center"
            >
              <Activity
                activity={activity}
                key={activity.id}
                t={t}
                // updateProjects={res => handleSetState(updateProjects(res, state, props, toast))}
                {...props}
              />
            </Grid>
          ))}
        </Grid>

        {/* <Comments context={{ name: 'activity', body: { ...activity, comments: [] } }} {...{ ...props, auth }} /> */}
      </div>

      <Modal.WithIcon icon={<FiShare size={30} />} maxWidth="xs" open={open} onClose={toggleDialog}>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton onClick={toggleDialog}>
            <CloseOutlined />
          </IconButton>
        </div>

        <DialogTitle>
          <Typography align="center" className={clsx(commonClasses.title2, classes.dialogTitle)}>
            Congratulations your Activity has been successfully created!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Share your activity with the world. Post it on the following platforms:
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <SocialButtons containerStyle={{ gap: 50 }} withColor link facebook whatsapp />
          </div>
        </DialogContent>
      </Modal.WithIcon>
    </div>
  );
}

const AnchorElemt = ({ onEdit, onDelete, isLoading = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handledelete = () => {
    onDelete();
    handleClose();
  };

  const handleEdit = () => {
    onEdit();
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
        {isLoading ? <CircularProgress size={20} color="inherit" /> : <MoreVert />}
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
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <Divider />
        <MenuItem onClick={handledelete}>Delete</MenuItem>
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

const videos = ['https://www.youtube.com/watch?v=ssjJ3N7LV1c'];

const materials_used_images = [
  'https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1523247297454-ef69fd04e051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1448697138198-9aa6d0d84bf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  'https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1523247297454-ef69fd04e051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1448697138198-9aa6d0d84bf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
];

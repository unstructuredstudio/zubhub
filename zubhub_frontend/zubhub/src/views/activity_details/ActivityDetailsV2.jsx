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
  Chip
} from '@material-ui/core';
import { CloseOutlined, ExpandMore, MoreVert } from '@material-ui/icons';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { FiShare, FiDownload } from 'react-icons/fi';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import ZubHubAPI from '../../api';
import { colors } from '../../assets/js/colors';
import { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import styles from '../../assets/js/styles/index';
import { Collapsible, CustomButton, Gallery, Modal, Pill } from '../../components';
import Activity from '../../components/activity/activity';
import SocialButtons from '../../components/social_share_buttons/socialShareButtons';
import { getUrlQueryObject } from '../../utils.js';
import { dFormatter } from '../../assets/js/utils/scripts';
import { activityDefailsStyles } from './ActivityDetails.styles';
import { useReactToPrint } from 'react-to-print';
import Html2Pdf from 'html2pdf.js';
import Categories from '../../components/categories/Categories.jsx';

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
  // const [isLoading, setIsLoading] = useState({});
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

  // const handleDelete = () => {
  //   setIsLoading({ ...isLoading, delete: true });
  //   API.deleteActivity({ token: auth.token, id: activity.id })
  //     .then(() => props.history.push(`/activities`))
  //     .finally(() => setIsLoading({ ...isLoading, delete: false }));
  // };

  // const handleEdit = () => {
  //   props.history.push(`${props.location.pathname}/edit`);
  // };

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
    <div ref={ref} className={classes.mainContainer}>
      {open ? <ReactConfetti width={width} height={height} /> : null}
      <div className={classes.card}>
        <div className={classes.headerFlex}>
          <div className={classes.creatorBox}>
            <Avatar src={creator?.avatar} alt={creator?.username} />
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
                {creator?.tags[0]}
              </Typography>
            </div>
          </div>
          <CustomButton primaryButtonStyle className={classes.headerButton}>
            Create Activity
          </CustomButton>
        </div>
        <Divider />
        <Typography variant="h5" component="h1" className={classes.headerTitle}>
          {activity?.title}
        </Typography>
        <div className={classes.headerIconBox}>
          <Typography
            className={classes.headerIconText}
            color="textSecondary"
            variant="caption"
            component="span"
          >
            <VisibilityIcon fontSize="small" />
            {activity.views_count}
          </Typography>
          <Divider orientation='vertical' flexItem />
          <Typography
            className={classes.headerIconText}
            color="textSecondary"
            variant="caption"
            component="span"
          >
            <EmojiObjectsIcon  fontSize="small" />
            Re-created
            <strong>{activity.views_count}</strong>
            times
          </Typography>
          <Divider orientation='vertical' flexItem />
          <Typography color="textSecondary" variant="caption" component="span" className={classes.headerIconText}>
            {`
              ${dFormatter(activity.created_on).value} 
              ${t(`date.${dFormatter(activity.created_on).key}`)} 
              ${t('date.ago',)}
            `}
          </Typography>
        </div>
        {activity.images?.length > 0 && <Gallery images={[activity.images[0].image.file_url]} />}
        <div className={classes.headerFlex}>
          <CustomButton
            onClick={handleDownload}
            loading={isDownloading}
            primaryButtonOutlinedStyle
            className={classes.headerButton}
          >
            <FiDownload fontSize="medium" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </CustomButton>
        </div>
      </div>
      <div className={classes.card}>
        <Typography
          variant="h6"
          className={classes.cardTitle}
        >
          Introduction
        </Typography>
        <ReactQuill
          className={classes.descriptionBodyStyle}
          theme={'bubble'}
          readOnly={true}
          value={activity.introduction || ''}
        />
        {activity.images?.length > 0 && <Gallery images={activity.images?.map(img => img.image?.file_url)} />}
        <Divider />
        <Typography
          variant="h6"
          className={classes.cardTitle}
        >
          Categories
        </Typography>
        {activity.category?.length > 0 && <Categories categories={activity.category} />}
        <Divider />
        <Typography
          variant="h6"
          className={classes.cardTitle}
        >
          Class Grade
        </Typography>
        {activity.class_grade &&
          <Chip
            className={classes.classGrade}
            label={activity.class_grade}
            size='small'
          />
        }
        <Divider />
        <Typography
          variant="h6"
          className={classes.cardTitle}
        >
          Materials Used
        </Typography>
        {activity.materials_used && (
          <ReactQuill
            className={classes.descriptionBodyStyle}
            theme={'bubble'}
            readOnly={true}
            value={activity.materials_used || ''}
          />
        )}
        {activity.materials_used_image && <Gallery images={[activity.materials_used_image?.file_url]} />}
        {activity.making_steps?.map(step => (
          <>
            <Divider />
            <Typography
              variant="h6"
              className={classes.cardTitle}
            >
              {`Step ${step?.step_order}: ${step.title}`}
            </Typography>
            <ReactQuill
              className={classes.descriptionBodyStyle}
              theme={'bubble'}
              readOnly={true}
              value={step.description || ''}
            />
            {step.image?.length > 0 && <Gallery images={step.image?.map(img => img?.file_url)} />}
          </>
        ))}
      </div>
      <div className={clsx(classes.card, classes.footer)}>
        <Typography variant="h6" className={classes.footerTitle}>
          Did you like this activity?
        </Typography>
        <CustomButton primaryButtonStyle className={classes.footerButton}>
          Create It!
        </CustomButton>
        <Divider />
        <Typography variant="h6" className={classes.footerTitle}>
          More Activities
        </Typography>
        <Grid container spacing={4}>
          {moreActivities.slice(0, 2).map((activity, index) => (
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
                {...props}
              />
            </Grid>
          ))}
        </Grid>
      </div>

      <Modal.WithIcon icon={<FiShare size={30} />} maxWidth="xs" open={open} onClose={toggleDialog}>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton onClick={toggleDialog}>
            <CloseOutlined />
          </IconButton>
        </div>

        <DialogTitle>
          <Typography align="center" className={commonClasses.title2}>
            Congratulations your Activity has been successfully created!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Share your activity with the world. Post it on the following platforms:
          </Typography>
          <div className={clsx(commonClasses.displayFlex, commonClasses.justifyCenter)} style={{ margin: '20px 0' }}>
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

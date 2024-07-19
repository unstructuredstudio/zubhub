import { makeStyles } from '@mui/styles';
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
  Chip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloseOutlined,
  MoreVert,
  Visibility as VisibilityIcon,
  EmojiObjects as EmojiObjectsIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { FiShare, FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdPublish, MdFileDownloadOff } from 'react-icons/md';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Html2Pdf from 'html2pdf.js';
import ZubHubAPI from '../../api';
import { colors } from '../../assets/js/colors';
import styles from '../../assets/js/styles/index';
import { CustomButton, Gallery, Modal } from '../../components';
import Activity from '../../components/activity/activity';
import SocialButtons from '../../components/social_share_buttons/socialShareButtons';
import { getUrlQueryObject } from '../../utils.js';
import { dFormatter } from '../../assets/js/utils/scripts';
import { activityDetailsStyles, socialButtonsStyleOverrides } from './ActivityDetails.styles';
import Categories from '../../components/categories/Categories.jsx';
import { USER_TAGS } from '../../assets/js/utils/constants';

const API = new ZubHubAPI(); // TODO: move api request to redux action
const authenticatedUserActivitiesGrid = { xs: 12, sm: 6, md: 6 };
const unauthenticatedUserActivitiesGrid = { xs: 12, sm: 6, md: 3 };

export default function ActivityDetailsV2(props) {
  const classes = makeStyles(activityDetailsStyles)();
  const commonClasses = makeStyles(styles)();

  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  const ref = useRef(null);

  const [activity, setActivity] = useState({});
  const [{ height, width }, setDimensions] = useState({});
  const [open, setOpen] = useState(false);
  const [moreActivities, setMoreActivities] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [isDownloading, setIsDownloading] = useState(undefined);

  const creator = activity.creators?.[0];

  const toggleDialog = () => {
    setOpen(!open);
    props.navigate(window.location.pathname, { replace: true });
  };

  useEffect(() => {
    API.getActivity({ token: auth?.token, id: props.params.id }).then(data => {
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
      .then(() => props.navigate(`/activities`))
      .finally(() => setIsLoading({ ...isLoading, delete: false }));
  };

  const handleEdit = () => {
    props.history.push(`${props.location.pathname}/edit`);
  };

  const handlePublish = () => {
    API.activityTogglePublish({ token: auth.token, id: activity.id }).then(() => window.location.reload());
  };

  const handleDownload = useReactToPrint({
    onBeforePrint: () => setIsDownloading(true),
    onPrintError: () => setIsDownloading(false),
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
    <div ref={ref} className={clsx(classes.mainContainer, !auth?.token && classes.signedOutMainContainer)}>
      {open ? <ReactConfetti width={width} height={height} /> : null}
      <div className={classes.card}>
        <div className={classes.headerFlex}>
          <Link
            className={commonClasses.textDecorationNone}
            to={{ pathname: `/creators/${creator?.username}`, state: { prevPath: window.location.pathname } }}
          >
            <div className={classes.creatorBox}>
              <Avatar src={creator?.avatar} alt={creator?.username} className={classes.avatar} />
              <div>
                <Typography color={colors.black} component="span" className={classes.creatorUsername}>
                  {creator?.username}
                </Typography>
                <br />
                {creator?.tags.includes(USER_TAGS.educator) && (
                  <Typography color="textSecondary" component="span" className={commonClasses.textCapitalize}>
                    {USER_TAGS.educator}
                  </Typography>
                )}
              </div>
            </div>
          </Link>
          <CustomButton primaryButtonStyle className={classes.headerButton}>
            {t('activityDetails.activity.create.dialog.primary')}
          </CustomButton>
        </div>
        <Divider />
        <div className={classes.headerFlex}>
          <Typography variant="h5" component="h1" className={classes.headerTitle}>
            {activity?.title}
          </Typography>
          {(activity.creators?.some(creator => creator.id === auth.id) || auth.tags.includes(USER_TAGS.staff)) && (
            <AnchorElemt
              isLoading={isLoading.delete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onPublish={handlePublish}
              activity={activity}
              auth={auth}
            />
          )}
        </div>
        <div className={classes.headerIconBox}>
          <Typography className={classes.headerIconText} color="textSecondary" variant="caption" component="span">
            <VisibilityIcon fontSize="small" />
            {activity.views_count}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography className={classes.headerIconText} color="textSecondary" variant="caption" component="span">
            <EmojiObjectsIcon fontSize="small" />
            {t('activityDetails.inspired.recreated')}
            <strong>{activity.views_count}</strong>
            {t('activityDetails.inspired.times')}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography color="textSecondary" variant="caption" component="span" className={classes.headerIconText}>
            {`
              ${dFormatter(activity.created_on).value}
              ${t(`date.${dFormatter(activity.created_on).key}`)}
              ${t('date.ago')}
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
            {isDownloading ? t('activityDetails.activity.pdf.downloading') : t('activityDetails.activity.pdf.download')}
          </CustomButton>
          <ShareButton />
        </div>
      </div>
      <div className={classes.card}>
        <Typography variant="h6" className={classes.cardTitle}>
          {t('activityDetails.activity.introduction')}
        </Typography>
        <ReactQuill
          className={classes.descriptionBodyStyle}
          theme={'bubble'}
          readOnly={true}
          value={activity.introduction || ''}
        />
        {activity.images?.length > 0 && <Gallery images={activity.images?.map(img => img.image?.file_url)} />}
        <Divider />
        <Typography variant="h6" className={classes.cardTitle}>
          {t('activityDetails.activity.categories')}
        </Typography>
        {activity.category?.length > 0 && <Categories categories={activity.category} />}
        <Divider />
        <Typography variant="h6" className={classes.cardTitle}>
          {t('activityDetails.activity.classGrade')}
        </Typography>
        {activity.class_grade && <Chip className={classes.classGrade} label={activity.class_grade} size="small" />}
        <Divider />
        <Typography variant="h6" className={classes.cardTitle}>
          {t('activityDetails.activity.materials')}
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
            <Typography variant="h6" className={classes.cardTitle}>
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
        <Divider />
        <Typography variant="h6" className={classes.footerTitle}>
          {t('activityDetails.footer.moreActivitiesTitle')}
        </Typography>
        <Grid container spacing={4}>
          {moreActivities.slice(0, 2).map((activity, index) => (
            <Grid
              key={index}
              item
              {...(auth.token ? authenticatedUserActivitiesGrid : unauthenticatedUserActivitiesGrid)}
              align="center"
            >
              <Activity activity={activity} key={activity.id} t={t} {...props} />
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
            {t('activityDetails.activity.create.modal.success')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">{t('activityDetails.activity.create.modal.share')}</Typography>
          <div className={clsx(commonClasses.displayFlex, commonClasses.justifyCenter)} style={{ margin: '20px 0' }}>
            <SocialButtons containerStyle={{ gap: 50 }} withColor link facebook whatsapp />
          </div>
        </DialogContent>
      </Modal.WithIcon>
    </div>
  );
}

const AnchorElemt = ({ onEdit, onDelete, onPublish, isLoading = false, activity, auth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = makeStyles(activityDetailsStyles)();
  const { t } = useTranslation();

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

  const handlePublish = () => {
    onPublish();
    handleClose();
  };

  const ActionButtons = () => {
    if (activity.creators?.some(creator => creator.id === auth.id)) {
      return (
        <MenuItem onClick={handleEdit} className={classes.menuItem}>
          <ListItemIcon className={classes.menuItemIcon}>
            <FiEdit fontSize="medium" />
          </ListItemIcon>
          <ListItemText className={classes.menuItemText}>{t('activityDetails.activity.edit.label')}</ListItemText>
        </MenuItem>
      );
    } else if (auth.tags.includes(USER_TAGS.staff)) {
      return (
        <MenuItem onClick={handlePublish} className={classes.menuItem}>
          <ListItemIcon className={classes.menuItemIcon}>
            {activity?.publish ? <MdFileDownloadOff fontSize="large" /> : <MdPublish fontSize="large" />}
          </ListItemIcon>
          <ListItemText className={classes.menuItemText}>
            {activity?.publish
              ? t('activityDetails.activity.unpublish.label')
              : t('activityDetails.activity.publish.label')}
          </ListItemText>
        </MenuItem>
      );
    }
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
        <ActionButtons />
        <MenuItem onClick={handledelete} className={clsx(classes.menuItem, classes.dangerButton)}>
          <ListItemIcon className={classes.menuItemIcon}>
            <FiTrash2 fontSize="medium" className={classes.dangerButton} />
          </ListItemIcon>
          <ListItemText className={classes.menuItemText}>{t('activityDetails.activity.delete.label')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const ShareButton = () => {
  const socialClasses = makeStyles(socialButtonsStyleOverrides)();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id={`basic-button`}
        aria-controls={open ? `social-buttons-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ShareIcon />
      </IconButton>
      <Menu
        id={`social-buttons-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `basic-button`,
        }}
      >
        <SocialButtons
          withColor
          styleOverrides={{
            containerStyle: socialClasses.containerStyle,
            outlined: socialClasses.outlined,
          }}
        />
      </Menu>
    </>
  );
};

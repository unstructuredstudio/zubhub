import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import QRCode from 'qrcode.react';
import { images } from '../../assets/images';
import { Collapsible, CustomButton, Gallery, Modal, Pill } from '../../components';
import { Container, Typography, Box, makeStyles, Avatar } from '@material-ui/core';
import styles from '../../assets/js/styles/index';
import { activityDefailsStyles } from './ActivityDetails.styles';
// import activity from '../../components/activity/activity';
import SocialButtons from '../../components/social_share_buttons/socialShareButtons';
export const MakeActivity = ({ activity, creator }) => {
  const classes = makeStyles(activityDefailsStyles)();
  const commonClasses = makeStyles(styles)();
  const { t } = useTranslation();
  return (
    <>
      <Container style={{ backgroundColor: 'white', border: 'solid 1.5rem white'}} className={classes.pdfStyle}>
        <Container className={classes.pdfMainLogo}>
          <Avatar className={classes.pdfLogoStyle} src={images.logo} alt={'Faridah_ux'} />
        </Container>
        <Box className={classes.verticalSpace}></Box>
        <Container className={classes.justifyPdf}>
          <Typography className={classes.pdfTitle}>{activity?.title}</Typography>
          <Container className={`${classes.creatorProfilePdfStyle}`}>
            <Avatar className={classes.creatorAvatarStyle} src={creator?.avatar} alt={'Faridah_ux'} />
            <Typography>{activity?.creators[0].username}</Typography>
          </Container>
        </Container>
        <Box className={classes.verticalSpace}></Box>
        <Typography className={`${classes.pdfSubtitle}`}>{t('activityDetails.pdfDetails.introduction')}</Typography>
        <Typography className={classes.textStyle}>
          {activity.introduction ? <div dangerouslySetInnerHTML={{ __html: activity.introduction }} /> : ''}
        </Typography>
        {activity.images?.length > 0 && (
          <div className={classes.imageStyle}>
            {activity.images.map((img, index) => (
              <img
                key={index}
                src={img.image?.file_url}
                alt={`Image ${index}`}
                className={classes.imageIndividualStyle}
              />
            ))}
          </div>
        )}
        <Box className={classes.verticalSpace}></Box>

        <Typography className={`${classes.pdfSubtitle}`}>{t('activityDetails.pdfDetails.category')}</Typography>
        <div className={clsx(commonClasses.displayFlex, commonClasses.gap, commonClasses.flexWrap)}>
          {activity.category?.map((cat, index) => (
            <Pill key={index} text={cat} />
          ))}
        </div>
        <Box className={classes.verticalSpace}></Box>

        <Typography className={`${classes.pdfSubtitle}`}>{t('activityDetails.pdfDetails.classHeading')}</Typography>
        <div className={clsx(commonClasses.displayFlex, commonClasses.gap, commonClasses.flexWrap)}>
          <Pill text={activity.class_grade} />
        </div>
        <Box className={classes.verticalSpace}></Box>

        <Typography className={`${classes.pdfSubtitle}`}>{t('activityDetails.pdfDetails.materials')}</Typography>
        <Typography
          className={`${classes.textStyle} ${classes.customTypographyStyle}`}
          theme={'bubble'}
          readOnly={true}
          value={activity.materials_used || ''}
        >
          {activity.materials_used ? <div dangerouslySetInnerHTML={{ __html: activity.materials_used }} /> : ''}
        </Typography>
        {console.log(activity.materials_used_image)}
        <div className={classes.imageStyle}>
          <img
            src={activity.materials_used_image?.file_url}
            // alt={`Image ${index}`}
            className={classes.imageIndividualStyle}
          />
        </div>

        {/* {activity.materials_used_image && <Gallery images={[activity.materials_used_image?.file_url]} />} */}

        <br></br>

        {activity.making_steps?.map((step, index) => (
          <Collapsible key={index} title={`Step ${step?.step_order}: ${step.title}`}>
            {step.image?.length > 0 && <Gallery images={step.image?.map(img => img?.file_url)} />}
            {step.description && (
              <ReactQuill
                className={classes.textStyle}
                theme={'bubble'}
                readOnly={true}
                value={step.description || ''}
              />
            )}
          </Collapsible>
        ))}
        <Box className={classes.verticalSpace}></Box>
      </Container>
      <Container className={classes.footerStyle}>
        <Container>
          <img className={classes.pdfFooterLogoStyle} src={images.unstructured} alt={'Faridah_ux'} />
        </Container>
        <Container>
          <Container className={classes.flexStyle}>
            <Typography
              style={{ margin: 'auto', width: '12rem' }}
              className={`${classes.pdfSubtitle}`}
            >
              {t('activityDetails.pdfDetails.introduction')}
            </Typography>
            <SocialButtons link facebook whatsapp className={classes.linkStyle} />
          </Container>
        </Container>
        <Container>
          <Container>
            <QRCode value={`https://example.com/activity/${activity.id}`} />
          </Container>

          <Typography style={{ color: 'white' }} className={`${classes.pdfSubtitle} ${classes.customTypographyStyle}`}>
          {t('activityDetails.pdfDetails.qrHeading')}
          </Typography>
        </Container>
      </Container>
    </>
  );
};

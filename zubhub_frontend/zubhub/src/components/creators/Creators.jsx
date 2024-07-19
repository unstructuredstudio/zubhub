import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { Typography, Box, Avatar, Tooltip } from '@mui/material';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import commonStyles from '../../assets/js/styles';
import { creatorsStyles } from './creators.styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(creatorsStyles);

const Creators = ({ creators }) => {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const { t } = useTranslation();

  return (
    <>
      {creators.length === 1 ? (
        creators.map((creator, index) => (
          <Link
            key={`${creator.username}-${index}`}
            to={`/creators/${creator.username}`}
            className={common_classes.textDecorationNone}
          >
            <Box className={classes.creatorBox}>
              <Avatar className={classes.creatorAvatar} src={creator.avatar} alt={creator.username} />
              <Tooltip title={creator.username} placement="bottom" arrow className={classes.creatorUsernameTooltip}>
                <Box>
                  <Typography color="textSecondary" variant="caption" component="p" className={classes.creatorUsername}>
                    {creator.username}
                  </Typography>
                  {creator.tags.map((tag, index) => (
                    <Typography
                      key={`${tag}-${index}`}
                      color="textPrimary"
                      className={classes.creatorTag}
                      component="p"
                    >
                      {tag}
                    </Typography>
                  ))}
                </Box>
              </Tooltip>
            </Box>
          </Link>
        ))
      ) : (
        <Box className={classes.creatorBox}>
          <Box className={clsx(creators?.length === 2 ? classes.twoCreatorBox : classes.multipleCreatorBox)}>
            {creators.slice(0, 3).map((creator, index) => (
              <Tooltip
                key={`${creator.username}-${index}`}
                title={
                  index === 2 && creators.length > 3
                    ? `${creators.length - 2} ${t('activities.tooltipMore')}`
                    : creator.username
                }
                placement="bottom"
                arrow
                className={classes.creatorUsernameTooltip}
                style={{ zIndex: index }}
              >
                {index === 2 && creators.length > 3 ? (
                  <Avatar className={classes.creatorAvatar}>{`+${creators.length - 2}`}</Avatar>
                ) : (
                  <Avatar className={classes.creatorAvatar} src={creator.avatar} alt={creator.username} />
                )}
              </Tooltip>
            ))}
          </Box>
          <Box>
            <Typography color="textSecondary" variant="caption" component="p" className={classes.creatorUsername}>
              {creators[creators.length - 1].username}
            </Typography>
            {creators[creators.length - 1].tags.map((tag, index) => (
              <Typography key={`${tag}-${index}`} color="textPrimary" className={classes.creatorTag} component="p">
                {tag}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Creators;

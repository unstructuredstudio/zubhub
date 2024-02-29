import { GiNotebook } from 'react-icons/gi';
import { RiLogoutBoxRFill, RiTeamFill } from 'react-icons/ri';
import {
  Bookmark,
  Dashboard,
  EmojiObjects,
  FeaturedPlayList,
  Person,
  PostAddOutlined,
  Publish,
} from '@mui/icons-material';
import { TEAM_ENABLED } from '../../utils.js';

export const links = ({ auth, t }) => [
  { label: t('pageWrapper.sidebar.projects'), link: '/', icon: Dashboard },
  { label: t('pageWrapper.sidebar.profile'), link: '/profile', icon: Person, reactIcon: true, requireAuth: true },
  { label: t('pageWrapper.sidebar.createProject'), link: '/projects/create', icon: EmojiObjects },
  ...(auth?.tags.includes('staff') || auth?.tags.includes('educator')
    ? [{ label: t('pageWrapper.sidebar.createActivity'), link: '/activities/create', icon: PostAddOutlined }]
    : []),
  {
    label: `${t('pageWrapper.sidebar.myDrafts')}`,
    link: `/creators/${auth?.username}/drafts`,
    icon: GiNotebook,
    requireAuth: true,
    customButton: true,
  },
  {
    label: `${t('pageWrapper.sidebar.myProjects')}`,
    link: `/creators/${auth?.username}/projects`,
    icon: Publish,
    requireAuth: true,
    customButton: true,
  },
  { label: t('pageWrapper.sidebar.bookmarks'), link: '/projects/saved', icon: Bookmark, requireAuth: true },
  ...(TEAM_ENABLED ? [{ label: t('pageWrapper.sidebar.teams'), link: '/teams/all', icon: RiTeamFill }] : []),
  { label: t('pageWrapper.sidebar.expoloreActivities'), link: '/activities', icon: FeaturedPlayList },
];

export const bottomLinks = ({ t }) => [
  // { label: t('pageWrapper.sidebar.settings'), link: '/settings', icon: Settings, requireAuth: true },
  { label: t('pageWrapper.sidebar.logout'), action: 'logout', icon: RiLogoutBoxRFill, red: true, requireAuth: true },
];

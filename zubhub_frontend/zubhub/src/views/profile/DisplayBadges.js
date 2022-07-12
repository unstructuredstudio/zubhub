export function allBadgesTitle(projects, props) {
  const { comments, likes, views } = addValues(projects);
  let badges = [];

  const titleForProjects = projectBadgeTitle(projects.length, props);
  const titleForComments = commentBadgeTitle(comments, props);
  const titleForLikes = likeBagdeTitle(likes, props);
  const titleForViews = viewBadgeTitle(views, props);

  if (titleForProjects) badges.push(titleForProjects);

  if (titleForComments) badges.push(titleForComments);

  if (titleForLikes) badges.push(titleForLikes);

  if (titleForViews) badges.push(titleForViews);

  return badges;
}

function addValues(projects) {
  const totalCount = {
    comments: 0,
    likes: 0,
    views: 0,
  };
  for (let project of projects) {
    totalCount.comments += project.comments_count;
    totalCount.likes += project.likes.length;
    totalCount.views += project.views_count;
  }

  return totalCount;
}

function projectBadgeTitle(count, t) {
  if (count > 100) return t('profile.badge.project.category4');
  else if (count > 50) return t('profile.badge.project.category3');
  else if (count > 10) return t('profile.badge.project.category2');
  else if (count > 0) return t('profile.badge.project.category1');
  return '';
}

function viewBadgeTitle(count, t) {
  if (count > 100000) return t('profile.badge.view.category4');
  else if (count > 5000) return t('profile.badge.view.category3');
  else if (count > 100) return t('profile.badge.view.category2');
  else if (count > 10) return t('profile.badge.view.category1');
  return '';
}

function likeBagdeTitle(count, t) {
  if (count > 1000) return t('profile.badge.like.category3');
  else if (count > 500) return t('profile.badge.like.category2');
  else if (count > 100) return t('profile.badge.like.category1');
  return '';
}

function commentBadgeTitle(count, t) {
  if (count > 1000) return t('profile.badge.comment.category3');
  else if (count > 500) return t('profile.badge.comment.category2');
  else if (count > 100) return t('profile.badge.comment.category1');
  return '';
}

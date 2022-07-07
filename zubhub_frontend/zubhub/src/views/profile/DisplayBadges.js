export function allBadgesTitle(projects) {
    const {comments, likes, views}= addValues(projects);
    let badges= [];

    const title_for_projects=projectBadgeTitle(projects.length);
    const title_for_comments=commentBadgeTitle(comments);
    const title_for_likes=likeBagdeTitle(likes);
    const title_for_views=viewBadgeTitle(views);

    if(title_for_projects)
    badges.push(title_for_projects);

    if(title_for_comments)
    badges.push(title_for_comments);

    if(title_for_likes)
    badges.push(title_for_likes);

    if(title_for_views)
    badges.push(title_for_views);

    return badges;
}

function addValues(projects){
    let total_count= {
        comments: 0,
        likes: 0,
        views: 0
    };
        for(let project of projects){
        
        total_count.comments+= project.comments_count;
        total_count.likes+= project.likes.length;
        total_count.views+= project.views_count;
       }
  
   return total_count;
}



function projectBadgeTitle(count) { 
    if (count > 100) return 'Expert Builder'
    else if (count > 50) return 'Master of the sky'
    else if (count > 10) return 'Flying Bird'
    else if (count > 0) return 'Hatchling'
    return '';
}

function viewBadgeTitle(count) {
    if (count > 100000) return 'Idea Factory' 
    else if (count > 5000) return 'Popular Projects'
    else if (count > 100) return 'Person of Interest'
    else if (count > 10) return 'Getting Famous'
    return '';
}

function likeBagdeTitle(count) {
    if (count > 1000) return 'Captain Project'
    else if (count > 500) return 'Favourite Kid'
    else if (count > 100) return 'Interesting Projects'
    return '';
}

function commentBadgeTitle(count) {
    if (count > 1000) return 'Expert Advisor'
    else if (count > 500) return 'Always Available'
    else if (count > 100) return 'Helping Hand'
    return '';
}
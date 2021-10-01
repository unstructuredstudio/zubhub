import Compressor from 'compressorjs';
import AWS from 'aws-sdk';
import logo from '../../images/logos/logo.png';

export const doConfig = {
  digitalOceanSpaces: 'https://zubhub.sfo2.digitaloceanspaces.com/',
  bucketName: 'zubhub',
  project_images: 'project_images',
};

export const cloudinaryFactory = window => {
  return window.cloudinary.Cloudinary.new({
    cloud_name: 'zubhub',
    secure: true,
  });
};

export const buildVideoThumbnailURL = video_url => {
  if(video_url.search("youtube.com/embed/") > -1){

     const id = video_url.split("youtube.com/embed/")[1];
     return `https://img.youtube.com/vi/${id}/0.jpg`;

  } else if(video_url.search("player.vimeo.com/video/") > -1){

    const id = video_url.split("player.vimeo.com/video/")[1];
    return `https://vumbnail.com/${id}.jpg`;

  }else if(video_url.search("drive.google.com") > -1){ 

      let id = video_url.split("/");
      id = id[id.length - 2]
      return `https://lh3.googleusercontent.com/d/${id}=s300`;

  }else if(video_url.search("cloudinary.com") > -1){

    if (video_url.search('upload/sp_hd') > -1) {
      return video_url.replace('upload/sp_hd', 'upload/f_jpg');
    } else if (video_url.search('upload') > -1) {
      return video_url.replace('upload', 'upload/f_jpg');
    } else {
      return video_url;
    } 

  };
};

export const getPlayerOptions = (window, video_url) => {
  return {
    posterOptions: { publicId: buildVideoThumbnailURL(video_url) },
    hideContextMenu: true,
    logoImageUrl: logo,
    logoOnclickUrl: window.location.origin,
    showLogo: true,
  };
};

export const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('sfo2.digitaloceanspaces.com'),
  accessKeyId: process.env.REACT_APP_DOSPACE_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_DOSPACE_ACCESS_SECRET_KEY,
});

const shouldSetImages = (compressed, images, state, handleSetState) => {
  if (compressed.length === images.length) {
    const { media_upload } = state;
    media_upload.images_to_upload = compressed;

    handleSetState(media_upload);
  }
};

export const slugify = str=> {
  return str.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
};

const recursiveCountComments = (comments, countArr) => {
  for (let comment of comments) {
    countArr['count'] += 1;
    recursiveCountComments(comment['replies'], countArr);
  }
};

export const countComments = comments => {
  const countArr = { count: 0 };
  recursiveCountComments(comments, countArr);
  return countArr['count'];
};

export const Compress = (images, state, handleSetState) => {
  let compressed = [];

  for (let index = 0; index < images.length; index += 1) {
    let image = images[index];

    if (image && image.type.split('/')[1] !== 'gif') {
      new Compressor(image, {
        quality: 0.6,
        convertSize: 100000,
        success: result => {
          compressed.push(result);
          shouldSetImages(compressed, images, state, handleSetState);
        },
        error: error => {
          console.warn(error.message);
          compressed.push(image);
          shouldSetImages(compressed, images, state, handleSetState);
        },
      });
    } else {
      compressed.push(image);
      shouldSetImages(compressed, images, state, handleSetState);
    }
  }
};

export const dFormatter = str => {
  const date = new Date(str);

  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    let result = Math.round(interval);
    return { value: result, key: result > 1 ? 'years' : 'year' };
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    let result = Math.round(interval);
    return { value: result, key: result > 1 ? 'months' : 'month' };
  }
  interval = seconds / 86400;
  if (interval > 1) {
    let result = Math.round(interval);
    return { value: result, key: result > 1 ? 'days' : 'day' };
  }
  interval = seconds / 3600;
  if (interval > 1) {
    let result = Math.round(interval);
    return { value: result, key: result > 1 ? 'hours' : 'hour' };
  }
  interval = seconds / 60;
  if (interval > 1) {
    let result = Math.round(interval);
    return { value: result, key: result > 1 ? 'minutes' : 'minute' };
  }
  let result = Math.round(interval);
  return { value: result, key: result > 1 ? 'seconds' : 'second' };
};

export function nFormatter(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

export const parseComments = comments => {
  for (let each_comment of comments) {
    const mentions = each_comment.text.match(/\B@[a-z0-9_.-]+/gi);
    if (Array.isArray(mentions)) {
      for (let mention of mentions) {
        each_comment.text = each_comment.text.replace(
          mention,
          `<a href="/creators/${
            mention.split('@')[1]
          }" class="mention">${mention}</a>`,
        );
      }
    }
    parseComments(each_comment['replies']);
  }
};

export const tempAddComment = (comment, comments, parent_id) => {
  for (let each_comment of comments) {
    if (each_comment.id === parent_id) {
      each_comment.replies.unshift(comment);
      break;
    } else {
      tempAddComment(comment, each_comment['replies'], parent_id);
    }
  }
};

export const tempDeleteComment = (comments, comment_id) => {
  for (let index = 0; index < comments.length; index++) {
    if (Number(comments[index].id) === Number(comment_id)) {
      comments.splice(index, 1);
      break;
    } else {
      tempDeleteComment(comments[index]['replies'], comment_id);
    }
  }
};

export const calculateLabelWidth=(text, document)=>{
  if(text?.length){
  let label = document.evaluate(`//label[text()='${text}']`, document, null, 0, null );
  label = label?.iterateNext();
  
  let label_width = label?.offsetWidth;
  return label_width ? label_width : text?.length;
  }else{
      return;
  }
}

import Compressor from 'compressorjs';
import AWS from 'aws-sdk';
import logo from '../../images/logos/logo.png';
import { BASE_TAGS } from './constants';

/**
 * @constant doConfig
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe constant's function
 */
export const doConfig = {
  digitalOceanSpaces: 'https://zubhub.sfo2.digitaloceanspaces.com/',
  bucketName: 'zubhub',
  project_images: 'project_images',
};

/**
 * @function cloudinaryFactory
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const cloudinaryFactory = window =>
  window.cloudinary.Cloudinary.new({
    cloud_name: 'zubhub',
    secure: true,
  });

/**
 * @function buildVideoThumbnailURL
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */

export const videoOrUrl = video_url => {
  const regex =
    /^((http[s]?:\/\/)?(www\.)?youtube\.com)?((http[s]?:\/\/)?(www\.)?vimeo\.com)?((http[s]?:\/\/)?(www\.)?drive.google\.com)?/gm;
  return video_url.match(regex)[0] !== '' ? false : true;
};

export const buildVideoThumbnailURL = video_url => {
  if (video_url.search('youtube.com/embed/') > -1) {
    const id = video_url.split('youtube.com/embed/')[1];
    return `https://img.youtube.com/vi/${id}/0.jpg`;
  } else if (video_url.search('player.vimeo.com/video/') > -1) {
    const id = video_url.split('player.vimeo.com/video/')[1];
    return `https://vumbnail.com/${id}.jpg`;
  } else if (video_url.search('drive.google.com') > -1) {
    let id = video_url.split('/');
    id = id[id.length - 2];
    return `https://lh3.googleusercontent.com/d/${id}=s300`;
  } else if (video_url.search('cloudinary.com') > -1) {
    if (video_url.search('upload/sp_hd') > -1) {
      return video_url.replace('upload/sp_hd', 'upload/f_jpg');
    } else if (video_url.search('upload') > -1) {
      return video_url.replace('upload', 'upload/f_jpg');
    } else {
      return video_url;
    }
  } else {
    return `${video_url}.jpg`;
  }
};

/**
 * @function getPlayerOptions
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getPlayerOptions = (window, video_url) => ({
  posterOptions: { publicId: buildVideoThumbnailURL(video_url) },
  hideContextMenu: true,
  logoImageUrl: logo,
  logoOnclickUrl: window.location.origin,
  showLogo: true,
});

/**
 * @object s3
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe object's function
 */
export const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('sfo2.digitaloceanspaces.com'),
  accessKeyId: process.env.REACT_APP_DOSPACE_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_DOSPACE_ACCESS_SECRET_KEY,
});

/**
 * @function shouldSetImages
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const shouldSetImages = (compressed, images, state, handleSetState) => {
  if (compressed.length === images.length) {
    const { media_upload } = state;
    media_upload.images_to_upload = compressed;
    handleSetState(media_upload);
  }
};

/**
 * @function slugify
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const slugify = str => str.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

/**
 * @function recursiveCountComments
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const recursiveCountComments = (comments, countArr) => {
  comments.forEach(comment => {
    countArr['count'] += 1;
    recursiveCountComments(comment['replies'], countArr);
  });
};

/**
 * @function countComments
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const countComments = comments => {
  const countArr = { count: 0 };
  recursiveCountComments(comments, countArr);
  return countArr['count'];
};

/**
 * @function Compress
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const Compress = (images, state, handleSetState) => {
  const compressed = [];
  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];

    if (image && image.type.split('/')[1] !== 'gif') {
      // eslint-disable-next-line no-new
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

/**
 * @function dFormatter
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const dFormatter = str => {
  const date = new Date(str);

  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    const result = Math.round(interval);
    return { value: result, key: result > 1 ? 'years' : 'year' };
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const result = Math.round(interval);
    return { value: result, key: result > 1 ? 'months' : 'month' };
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const result = Math.round(interval);
    return { value: result, key: result > 1 ? 'days' : 'day' };
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const result = Math.round(interval);
    return { value: result, key: result > 1 ? 'hours' : 'hour' };
  }
  interval = seconds / 60;
  if (interval > 1) {
    const result = Math.round(interval);
    return { value: result, key: result > 1 ? 'minutes' : 'minute' };
  }
  const result = Math.round(interval);
  return { value: result, key: result > 1 ? 'seconds' : 'second' };
};

export function nFormatter(num) {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}G`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num;
}

/**
 * @function parseComments
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const parseComments = comments => {
  comments.forEach(each_comment => {
    const mentions = each_comment.text.match(/\B@[a-z0-9_.-]+/gi);
    if (Array.isArray(mentions)) {
      mentions.forEach(mention => {
        each_comment.text = each_comment.text.replace(
          mention,
          `<a href="/creators/${mention.split('@')[1]}" class="mention">${mention}</a>`,
        );
      });
    }
    parseComments(each_comment['replies']);
  });
};

/**
 * @function tempAddComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const tempAddComment = (comment, comments, parent_id) => {
  comments.forEach(each_comment => {
    if (each_comment.id === parent_id) {
      each_comment.replies.unshift(comment);
    } else {
      tempAddComment(comment, each_comment['replies'], parent_id);
    }
  });
};

/**
 * @function tempDeleteComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const tempDeleteComment = (comments, comment_id) => {
  for (let index = 0; index < comments.length; index += 1) {
    if (Number(comments[index].id) === Number(comment_id)) {
      comments.splice(index, 1);
      break;
    } else {
      tempDeleteComment(comments[index]['replies'], comment_id);
    }
  }
};

/**
 * @function calculateLabelWidth
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const calculateLabelWidth = (text, document) => {
  if (text?.length) {
    let label = document.evaluate(`//label[text()='${text}']`, document, null, 0, null);
    label = label?.iterateNext();

    const label_width = label?.offsetWidth;
    return label_width ? label_width : text?.length;
  }
};

/**
 * @function isBaseTag
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @description used to know if a creator tag is base tag or not.
 * @param {String} tag - name of tag.
 * @returns {boolean}
 */
export const isBaseTag = tag => BASE_TAGS.includes(tag);

export const getRouteAndIndex = str => {
  const arr = str.split('[');
  return arr.length > 1
    ? { route: arr[0], index: parseInt(arr[1].split('')[0], 10) }
    : { route: arr[0], index: parseInt('-1', 10) };
};

export const getRouteFieldIndex = str => {
  const arr = str.split('.');
  const { route, index } = getRouteAndIndex(arr[0]);
  return arr.length > 1 ? { route, field: arr[1], index } : { field: route, index };
};

export const getIndexFromFieldName = fieldName => {
  const arr = fieldName.split('[');
  return arr.length > 1 ? parseInt(arr[1].split('')[0], 10) : parseInt('-1', 10);
};

export const getFieldAndIndex = str => {
  const arr = str.split('[');
  return arr.length > 1
    ? { field: arr[0], index: parseInt(arr[1].split('')[0], 10) }
    : { field: arr[0], index: parseInt('-1', 10) };
};

export const getBase64ImageFromURL = (url, field, index) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    // function draw(img) {
    //   var buffer = document.createElement('canvas');
    //   buffer.width = img.width;
    //   buffer.height = img.height;
    //   var bufferctx = buffer.getContext('2d');
    //   bufferctx.drawImage(img, 0, 0);
    //   var imageData = bufferctx.getImageData(0, 0, buffer.width, buffer.height);
    //   var data = imageData.data;
    //   var removeBlack = function () {
    //     for (var i = 0; i < data.length; i += 4) {
    //       if (data[i] + data[i + 1] + data[i + 2] < 10) {
    //         data[i + 3] = 0; // alpha
    //       }
    //     }
    //     bufferctx.putImageData(imageData, 0, 0);
    //   };
    //   removeBlack();
    //   var dataURL = buffer.toDataURL('image/jpeg');
    //   index >= 0
    //     ? resolve({ [`${field}${index}image`]: dataURL })
    //     : resolve({ [field]: dataURL });
    // }
    // img.onload = () => {
    //   draw(img);
    // };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFF';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      index >= 0 ? resolve({ [`${field}${index}image`]: dataURL }) : resolve({ [field]: dataURL });
    };
    img.onerror = error => {
      reject(error);
    };

    img.src = url;
  });

export const capitalize = str => {
  const newStr = str.toString().toLowerCase();
  return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

export const getRedirectPath = url => {
  url = url.split('redirect=');
  return url.length > 1 ? url[1] : '';
};

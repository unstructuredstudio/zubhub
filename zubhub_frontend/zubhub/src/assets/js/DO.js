import AWS from 'aws-sdk';

export const doConfig = {
    digitalOceanSpaces: 'https://zubhub.sfo2.digitaloceanspaces.com/',
    bucketName: 'zubhub',
    project_images: 'project_images',
  };


console.log(process.env.REACT_APP_DOSPACE_ACCESS_KEY_ID, process.env.REACT_APP_DOSPACE_ACCESS_SECRET_KEY)

const spacesEndpoint = new AWS.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.REACT_APP_DOSPACE_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_DOSPACE_ACCESS_SECRET_KEY
    });
export default s3;
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { s3 as DO, doConfig, Compress, slugify } from '../../assets/js/utils/scripts';
import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { site_mode, publish_type } from '../../assets/js/utils/constants';
import ZubhubAPI from '../../api';
const API = new ZubhubAPI();


export const vars = {
    image_field_touched: false,
    video_field_touched: false,
    upload_in_progress: false,
    timer: { id: null },
    default_state: {
        loading: true,
        error: null,
        desc_input_is_focused: false,
        video_upload_dialog_open: false,
        select_video_file: false,
        materials_used: [],
        categories: [],
        tag_suggestion: [],
        tag_suggestion_open: false,
        publish_types: [],
        publish_visible_to_suggestion: [],
        publish_visible_to_suggestion_open: false,
        media_upload: {
            upload_dialog: false,
            images_to_upload: [],
            videos_to_upload: [],
            upload_info: {},
            upload_percent: 0,
            uploaded_images_url: [],
            uploaded_videos_url: [],
        },
    },
    quill: {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, 4, 5, 6] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                ['code-block'],
            ],
        },
        formats: [
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'script',
            'list',
            'bullet',
            'indent',
            'link',
            'image',
            'color',
            'code-block',
        ],
    },
};






export const handleMaterialsUsedFieldBlur = props => {
    props.setStatus({ ...props.status, materials_used: '' });
    props.setFieldTouched('materials_used', true);
};

export const removeMetaData = (images, state, handleSetState) => {
    const newWorker = worker();
    newWorker.removeMetaData(images);
    newWorker.addEventListener('message', e => {
        Compress(e.data, state, handleSetState);
    });
};


export const initUpload = (state, props, handleSetState) => {
    if (!props.auth.token) return props.history.push('/login');

    if (!(props.values.images.length !== 0 || props.values.video.length !== 0)) {
        vars.upload_in_progress = true;
        return uploadProject(state, props, handleSetState);
    }

    vars.upload_in_progress = true;
    state.media_upload.upload_dialog = true;
    handleSetState({
        success: false,
        default_state: {
            loading: true,
        },
        media_upload: {
            ...state.media_upload,
            upload_dialog: true,
            upload_percent: 0,
        },
    });

    const promises = [];

    // upload images
    for (let index = 0; index < props.values.images.filter(img => !img.link).length; index++) {
        promises.push(uploadImage(props.values.images[index], state, props, handleSetState));
    }

    // upload videos
    for (let index = 0; index < props.values.video.length; index++) {
        promises.push(uploadVideo(props.values.video[index], state, props, handleSetState));
    }

    // wait for all image and video promises to resolve before continuing
    Promise.all(promises)
        .then(all => {
            const uploaded_images_url = state.media_upload.uploaded_images_url;
            const uploaded_videos_url = state.media_upload.uploaded_videos_url;

            all.forEach(each => {
                if (each.public_id) {
                    uploaded_images_url.push(each);
                } else if (each.secure_url) {
                    uploaded_videos_url[0] = each.secure_url;
                }
            });

            state = JSON.parse(JSON.stringify(state));
            state.media_upload.uploaded_images_url = uploaded_images_url;
            state.media_upload.uploaded_videos_url = uploaded_videos_url;

            uploadProject(state, props, handleSetState);
        })
        .catch(error => {
            // settimeout is used to delay closing the upload_dialog until
            // state have reflected all prior attempts to set state.
            // This is to ensure nothing overwrites the dialog closing.
            // A better approach would be to refactor the app and use
            // redux for most complex state interactions.
            setTimeout(
                () =>
                    handleSetState({
                        media_upload: { ...state.media_upload, upload_dialog: false },
                    }),
                2000,
            );

            if (error) toast.warning(error);
        });
};


export const uploadProject = async (state, props, handleSetState) => {
    const materials_used = props.values['materials_used']
        .filter(value => (value ? true : false))
        .join(',');

    const tags = props.values['tags'] ? props.values['tags'].map(tag => typeof tag === 'string' ? { name: tag } : tag) : [];

    const create_or_update = props.match.params.id ? props.updateProject : props.createProject;
    create_or_update({
        ...props.values,
        tags,
        materials_used,
        id: props.match.params.id,
        token: props.auth.token,
        activity: props.location.state?.activity_id,
        images: state.media_upload.uploaded_images_url || '',
        video: state.media_upload.uploaded_videos_url[0] || props.values.video_link,
        category: props.values.category.filter(cat => cat.name).map(cat => cat?.name),
        t: props.t,
        publish: { type: props.step < 3 ? 1 : 4, visible_to: [] }
    })
        .then((id) => {
            handleSetState({ ...state, default_state: { loading: false }, success: true, id: `${id}` })
        })
        .catch(error => {
            console.log(error, 'error');
            handleSetState({
                media_upload: {
                    ...state.media_upload,
                    upload_dialog: false,
                    default_state: { loading: false }
                },
            });
            const messages = JSON.parse(error.message);
            if (typeof messages === 'object') {
                const server_errors = {};
                Object.keys(messages).forEach(key => {
                    if (key === 'non_field_errors') {
                        server_errors['non_field_errors'] = messages[key][0];
                    } else {
                        server_errors[key] = messages[key][0];
                    }
                });
                props.setStatus({ ...server_errors });
            } else {
                props.setStatus({
                    non_field_errors: props.t('createProject.errors.unexpected'),
                });
            }
        })
        .finally(() => {
            vars.upload_in_progress = false; // flag to prevent attempting to upload a project when an upload is already in progress
        });
};


export const uploadVideo = (video, state, props, handleSetState) => {
    if (
        typeof video === 'string' &&
        video.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        )
    ) {
        return new Promise(r => r({ secure_url: video }));
    } else {
        const args = {
            t: props.t,
            token: props.auth.token,
        };

        return API.shouldUploadToLocal(args).then(res => {
            if (res && res.local === true) {
                return uploadVideoToLocal(video, state, props, handleSetState);
            } else if (res && res.local === false) {
                return uploadVideoToCloudinary(video, state, props, handleSetState);
            }
        });
    }
};


export const uploadVideoToLocal = (video, state, props, handleSetState) => {
    let url =
        process.env.REACT_APP_NODE_ENV === 'production'
            ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
            : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
    url = url + 'upload-file-to-local/';

    let key = nanoid();
    key = key.slice(0, Math.floor(key.length / 3));
    key = `videos/${slugify(props.auth.username)}-${slugify(video.name)}-${key}`;

    const formData = new FormData();
    formData.append('file', video);
    formData.append('key', key);

    return new Promise((resolve, reject) => {
        const um = new UploadMedia(
            'video',
            url,
            formData,
            state,
            props,
            handleSetState,
            resolve,
            reject,
        );
        um.upload();
    });
};


export const uploadVideoToCloudinary = (
    video,
    state,
    props,
    handleSetState,
) => {
    const url = process.env.REACT_APP_VIDEO_UPLOAD_URL;

    const upload_preset =
        process.env.REACT_APP_NODE_ENV === 'production'
            ? process.env.REACT_APP_VIDEO_UPLOAD_PRESET_NAME
            : process.env.REACT_APP_DEV_VIDEO_UPLOAD_PRESET_NAME;

    const params = {
        upload_preset,
        username: props.auth.username,
        filename: video.name,
        t: props.t,
        token: props.auth.token,
    };

    return props.getSignature(params).then(sig_res => {
        if (typeof sig_res === 'object') {
            const formData = new FormData();
            formData.append('file', video);
            formData.append('public_id', sig_res.public_id);
            formData.append('upload_preset', upload_preset);
            formData.append('api_key', sig_res.api_key);
            formData.append('timestamp', sig_res.timestamp);
            formData.append('signature', sig_res.signature);

            return new Promise((resolve, reject) => {
                const um = new UploadMedia(
                    'video',
                    url,
                    formData,
                    state,
                    props,
                    handleSetState,
                    resolve,
                    reject,
                );
                um.upload();
            });
        } else {
            return Promise.reject('');
        }
    });
};


export const uploadImage = (image, state, props, handleSetState) => {
    const args = {
        t: props.t,
        token: props.auth.token,
    };

    return API.shouldUploadToLocal(args).then(res => {
        if (res && res.local === true) {
            return uploadImageToLocal(image, state, props, handleSetState);
        } else if (res && res.local === false) {
            return uploadImageToDO(image, state, props, handleSetState);
        }
    });
};


export const uploadImageToLocal = (image, state, props, handleSetState) => {
    let url =
        process.env.REACT_APP_NODE_ENV === 'production'
            ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
            : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
    url = url + 'upload-file-to-local/';

    const formData = new FormData();
    formData.append('file', image);
    formData.append('key', `project_images/${nanoid()}`);
    return new Promise((resolve, reject) => {
        const um = new UploadMedia(
            'image',
            url,
            formData,
            state,
            props,
            handleSetState,
            resolve,
            reject,
        );
        um.upload();
    });
};


export const uploadImageToDO = (image, state, props, handleSetState) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: `${doConfig.bucketName}`,
            Key: `${doConfig.project_images}/${nanoid()}`,
            Body: image,
            ContentType: image.type,
            ACL: 'public-read',
        };

        DO.upload(params, err => {
            reject(err.message);
        })
            .on('httpUploadProgress', e => {
                const progress = Math.round((e.loaded * 100.0) / e.total);
                const { media_upload } = state;
                const upload_info = JSON.parse(
                    JSON.stringify(media_upload.upload_info),
                );
                upload_info[image.name] = progress;

                let total = 0;
                Object.keys(upload_info).forEach(each => {
                    total = total + upload_info[each];
                });

                total = total / Object.keys(upload_info).length;

                handleSetState({
                    default_state: { loading: false },
                    media_upload: {
                        ...media_upload,
                        upload_info,
                        upload_percent: total,
                    },
                });
            })
            .send((err, data) => {
                if (err) {
                    if (err.message.startsWith('Unexpected')) {
                        const error = props.t('createProject.errors.unexpected');
                        reject(error);
                    } else {
                        reject(err.message);
                    }
                } else {
                    const secure_url = data.Location;
                    const public_id = data.Key;
                    resolve({ image_url: secure_url, public_id });
                }
            });
    });
};


export const getProject = (props, state) => {
    return props
        .getProject({
            id: props.match.params.id,
            token: props.auth.token,
        })
        .then(obj => {
            if (!obj.project) {
                return obj;
            } else {
                const { media_upload } = state;

                if (obj.project.title) {
                    props.setFieldValue('title', obj.project.title);
                }

                if (obj.project.description) {
                    props.setFieldValue('description', obj.project.description);
                    // refs.desc_el.current.editor.root.innerHTML = obj.project.description;
                }

                if (obj.project.video) {
                    // refs.video_selection_feedback_el.current.innerText = `${props.t(
                    //     'createProject.inputs.videoURL',
                    // )}`;

                    props.setFieldValue('video_link', obj.project.video, true);
                }

                if (obj.project.images.length > 0) {
                    // refs.image_count_el.current.innerText = `${obj.project.images.length
                    //     } ${props.t(
                    //         `createProject.inputs.${obj.project.images.length < 2 ? 'image' : 'images'
                    //         }`,
                    //     )}`;

                    const files = obj.project.images.map(url => ({
                        name: url.image_url,
                        type: 'image/*',
                        size: 1000000,
                        link: true
                    }));

                    props.setFieldValue('images', files, true);
                }

                if (obj.project.materials_used) {
                    props.setFieldValue(
                        'materials_used',
                        obj.project.materials_used.split(','),
                        true,
                    );
                }

                if (obj.project.category) {
                    props.setFieldValue('category', obj.project.category.map(cat => ({ name: cat })), true);
                }

                if (obj.project.tags) {
                    props.setFieldValue('tags', obj.project.tags.map(tag => tag.name), true);
                }

                // if (refs.publish_type_el.current && obj.project.publish) {
                //     const publish = {
                //         type: obj.project.publish.type,
                //         visible_to: obj.project.publish.visible_to.map(
                //             creator => creator.username,
                //         ),
                //     };
                //     props.setFieldValue('publish', publish, true);
                // }

                media_upload.uploaded_images_url = obj.project.images;
                media_upload.uploaded_videos_url = obj.project.video
                    ? [obj.project.video]
                    : [];

                return {
                    materials_used: obj.project.materials_used.split(','),
                    media_upload,
                };
            }
        });
};


export const step1Validation = Yup.object().shape({
    title: Yup.string().max(100, 'max').required('required'),
    class_grade: Yup.object().shape({ name: Yup.string() }).nullable(),
    category: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required('Name is required')
            })
        ),
});

export const step1Schema = {
    initialValues: {
        title: undefined,
        class_grade: null,
        category: [],
    },
    validationSchema: step1Validation,
}

export const step2Validation = Yup.object().shape({
    introduction: Yup.string().max(500, 'max').required('required'),
    materials_used: Yup.string(),
    images: Yup.array(),
    making_steps: Yup.array().of(Yup.object().shape({
        title: Yup.string(),
        description: Yup.string().required(),
        step_order: Yup.number(),
        images: Yup.array(),
        materials_used_image: Yup.array()
    }))
});

export const step2Schema = {
    initialValues: {
        introduction: undefined,
        images: [],
        materials_used: '<ol> <li></li></ol>',
        making_steps: [],
        materials_used_image: []
    },
    validationSchema: step2Validation,
}


export class UploadMedia {
    constructor(
        type,
        url,
        formData,
        state,
        props,
        handleSetState,
        resolve,
        reject,
    ) {
        this.xhr = new XMLHttpRequest();
        this.type = type;
        this.url = url;
        this.formData = formData;
        this.state = state;
        this.props = props;
        this.handleSetState = handleSetState;
        this.resolve = resolve;
        this.reject = reject;
        this.xhr.upload.onload = this.uploadOnLoad;
        this.xhr.onreadystatechange = this.onReadyStateChange;
        this.xhr.upload.onerror = this.uploadOnerror;
        this.xhr.upload.onprogress = this.uploadOnprogress;
    }

    uploadOnLoad = () => {
        if (this.xhr.status !== 200 && this.xhr.readyState === 4) {
            const error = this.props.t('createProject.errors.unexpected');
            this.reject(error);
        }
    };

    onReadyStateChange = () => {
        if (
            this.xhr.status === 200 &&
            this.xhr.readyState === 4 &&
            this.type === 'video'
        ) {
            const data = JSON.parse(this.xhr.response);
            const secure_url = data.secure_url;
            this.resolve({ secure_url });
        } else if (
            this.xhr.status === 200 &&
            this.xhr.readyState === 4 &&
            this.type === 'image'
        ) {
            const data = JSON.parse(this.xhr.response);
            const secure_url = data.Location;
            const public_id = data.Key;

            this.resolve({ image_url: secure_url, public_id });
        }
    };

    uploadOnerror = _ => {
        const error = this.props.t('createProject.errors.unexpected');

        this.reject(error);
    };

    uploadOnprogress = e => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        const { media_upload } = this.state;

        const upload_info = JSON.parse(JSON.stringify(media_upload.upload_info));
        upload_info[this.formData.get('file').name] = progress;

        let total = 0;
        Object.keys(upload_info).forEach(each => {
            total = total + upload_info[each];
        });

        total = total / Object.keys(upload_info).length;

        this.handleSetState({
            media_upload: {
                ...media_upload,
                upload_info,
                upload_percent: total,
            },
        });
    };

    upload = () => {
        this.xhr.open('POST', this.url);
        if (!this.url.startsWith(process.env.REACT_APP_VIDEO_UPLOAD_URL)) {
            this.xhr.xsrfCookieName = 'csrftoken';
            this.xhr.xsrfHeaderName = 'X-CSRFToken';
            this.xhr.setRequestHeader(
                'Authorization',
                `Token ${this.props.auth.token}`,
            );
            this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        this.xhr.send(this.formData);
    };
}


export const submitForm = async ({ step1Values, step2Values, props, state, handleSetState }, callback) => {
    // Add all images present in th form in the imagesToUpload object for upload.
    let imagesToUpload = {}
    if (step2Values) {
        imagesToUpload.images = step2Values.images
        imagesToUpload.materials_used_image = step2Values.materials_used_image
        imagesToUpload.making_steps = {}
        step2Values.making_steps?.forEach((step, index) => {
            imagesToUpload.making_steps[`${index}`] = step.images
        })
    }

    // Upload all files present in the form and get their remote data.
    const res = await formFilesUpload(imagesToUpload, props, state, handleSetState);

    if (res.error) {
        alert('Failed to upload Files; Please try again');
        return;
    }

    // Add 
    const formData = {
        ...step1Values,
        ...step2Values,
        category: step1Values.category.map(item => item.name),
        class_grade: step1Values.class_grade.name,
        publish: true
    };

    let makinStepsImages = []

    // replace non uploaded images in formData fields with uploaded images
    res.forEach(obj => {
        if (obj.name.startsWith('making_steps')) {
            return makinStepsImages.push(obj)
        }

        if (obj.name === 'images') {
            formData[obj.name] = obj.files.map(item => ({ image: replaceImageUrlWithFileUrl(item) }))
            return
        }

        if (obj.name === 'materials_used_image') {
            formData[obj.name] = { file_url: obj.files[0].image_url, public_id: obj.files[0].public_id }
            return
        }

        formData[obj.name] = obj.files.map(item => replaceImageUrlWithFileUrl(item))
    })

    // Assign making steps uploaded and formated images to their associated steps
    if (makinStepsImages.length > 0) {
        const makingStepsWithUploadedImages = formData.making_steps.map((stepData, index) => {
            const data = {
                ...stepData,
                image: makinStepsImages[index].files.map(item => replaceImageUrlWithFileUrl(item)), step_order: index + 1
            };
            delete data.id;
            delete data.images
            return data;
        })

        formData.making_steps = makingStepsWithUploadedImages
    }

    // API call to the create activity endpoint
    const response = await API.createActivity(props.auth?.token, formData);
}

const replaceImageUrlWithFileUrl = (obj) => {
    if (!('file_url' in obj)) {
        obj = { ...obj, file_url: obj.image_url }
    }

    delete obj.image_url

    return obj
}

const formFilesUpload = (files, props, state, handleSetState) => {
    // The files parametter is in the format 
    // {[key]:value} where :
    // - key represents the field
    // - value represents an array of files belonging to the field.
    // - Value can also be an object of keys with their arrays values.
    // - returns a Promise containing {name:string, files:[]}[] or error

    let promises = new Map();

    Object.keys(files).forEach(field => {
        const list = files[field];
        const isArrayFilled = Array.isArray(list) && list.length > 0;
        const isObjectFilled = !isArrayFilled && Object.keys(list).length > 0;

        if (isArrayFilled) {
            const fieldFilesUploadPromises = [];

            list.forEach(file => fieldFilesUploadPromises.push(uploadImage(file, state, props, handleSetState)))
            promises.set(field, fieldFilesUploadPromises);
        }

        if (isObjectFilled) {
            Object.keys(list).forEach((key, index) => {
                const fieldFilesUploadPromises = [];

                list[key].forEach(file => fieldFilesUploadPromises.push(uploadImage(file, state, props, handleSetState)));
                promises.set(`${field}[${index}]`, fieldFilesUploadPromises);
            })
        }
    });

    const promisesArray = Array.from(promises.entries());

    return Promise.all(promisesArray.map(([name, promise]) =>
        Promise.all(promise).then(files => ({ name, files }))
    )).catch(err => ({ error: err }));
}
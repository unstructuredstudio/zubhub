import { getBase64ImageFromURL } from '../../assets/js/utils/scripts';
import logo from '../../assets/images/logos/logo-google.png';
export const getPdfMaterialsUsed = (activity, promiseImages) => {
  let pdfMaterials = [];
  let materialsList = {
    markerColor: 'var(--primary-color3)',
    style: 'textBody',
    ul: [],
  };
  activity.materials_used.split(',').forEach(item => {
    materialsList.ul.push(item);
  });
  pdfMaterials.push(materialsList);
  if (promiseImages['materials_used_image']) {
    pdfMaterials.push({
      image: promiseImages['materials_used_image'],
      width: 150,
      style: 'image',
    });
  }

  return {
    stack: [
      { text: 'MATERIALS USED', style: 'subTitles' },
      {
        margin: [20, 30],
        alignment: 'justify',
        columns: pdfMaterials,
      },
    ],
    unbreakable: true,
  };
};

export const getPdfMakingSteps = (activity, promiseImages) => {
  let steps = [];
  activity.making_steps.map((item, index) => {
    let step = { alignment: 'justify', columns: [] };
    if (item['description']) {
      step.columns.push({
        text: document.getElementById(`makingStep${index}description`).innerText,
        style: 'textBody',
      });
    }
    if (item['image']) {
      step.columns.push({
        image: promiseImages[`making_steps${index}image`],
        style: 'image',
        width: 200,
      });
    }
    steps.push({ text: `Step ${item.step_order}:`, style: 'stepTitle' }, step);
  });
  return {
    stack: [{ text: 'MAKING STEPS', style: 'subTitles' }, ...steps],
    // unbreakable: true,
  };
};

export const getPdfInspiringPerson = (activity, promiseImages) => {
  let artist = [];

  artist.push({
    alignment: 'center',
    width: 150,
    image: promiseImages['inspiring_artist'],
  });
  activity.inspiring_artist['name'] &&
    artist.push({
      alignment: 'center',
      text: activity.inspiring_artist['name'],
      style: 'textBody',
    });
  activity.inspiring_artist['short_biography'] &&
    artist.push({
      alignment: 'center',
      text: document.getElementById('inspiringArtistBiography').innerText,
      style: 'textBody',
    });

  return {
    stack: [{ text: 'INSPIRING PERSON', style: 'subTitles', alignment: 'center' }, ...artist],
    unbreakable: true,
  };
};

export const getPdfInspiringExamples = (activity, promiseImages) => {
  let lines = Math.ceil(activity['inspiring_examples'].length / 3);
  let factor = 1;
  let examples = [
    {
      columns: [
        { width: '*', text: '' },
        { width: 'auto', style: 'inspiring_examples', columns: [] },
        { width: '*', text: '' },
      ],
    },
  ];
  activity['inspiring_examples'].forEach((item, index) => {
    if (item['image']) {
      if (index === lines * factor) {
        factor += 1;
        examples.push({
          columns: [
            { width: '*', text: '' },
            { width: 'auto', style: 'inspiring_examples', columns: [] },
            { width: '*', text: '' },
          ],
        });
      }
      examples[factor - 1]['columns'][1]['columns'].push({
        height: 100,
        width: 100,
        image: promiseImages[`inspiring_examples${index}image`],
      });
    }
  });
  let descCredit = 'From left to right';
  activity.inspiring_examples.forEach((example, index) => {
    if (example['description']) {
      descCredit += example.description + ' ';
    }
    if (example['credit']) {
      descCredit += example.credit + ' ';
    }
    descCredit += ', ';
  });
  examples.push({
    text: descCredit,
    alignment: 'center',
    style: 'inspiringImageCredit',
  });

  return {
    stack: [
      { text: 'INSPIRING EXAMPLES', style: 'subTitles', alignment: 'center' },
      {
        // alignment: 'center',
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            stack: [...examples],
            unbreakable: true,
          },
          { width: '*', text: '' },
        ],
      },
    ],
    unbreakable: true,
  };
};

export const getPdfTextBlock = (title, elementId, breakable) => {
  return {
    stack: [
      { text: title, style: 'subTitles' },
      {
        alignment: 'justify',
        text: document.getElementById(elementId).innerText,
        style: 'textBody',
      },
    ],
    unbreakable: !breakable ? true : false,
  };
};

export const getBase64Images = activity => {
  const promises = [];
  promises.push(getBase64ImageFromURL(logo, 'logo'));
  promises.push(getBase64ImageFromURL(activity.images[0].image.file_url, 'activityImage'));
  activity['materials_used_image'] &&
    promises.push(getBase64ImageFromURL(activity['materials_used_image'].file_url, 'materials_used_image'));
  activity['inspiring_artist'] &&
    activity['inspiring_artist']['image'] &&
    promises.push(getBase64ImageFromURL(activity['inspiring_artist']['image'].file_url, 'inspiring_artist'));
  ['inspiring_examples', 'making_steps'].map(item => {
    if (activity[item]) {
      activity[item].map((step, index) => {
        if (step['image']) {
          promises.push(getBase64ImageFromURL(step.image.file_url, item, index));
        }
      });
    }
  });
  return promises;
};

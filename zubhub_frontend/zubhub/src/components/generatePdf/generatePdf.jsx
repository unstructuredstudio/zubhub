import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/button/Button';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { pdfStyle } from '../../assets/js/styles/components/generatePdf/generatePdfStyle';

import {
  getPdfTextBlock,
  getPdfMaterialsUsed,
  getPdfMakingSteps,
  getPdfInspiringPerson,
  getPdfInspiringExamples,
} from './generatePdfScripts';
import { getBase64Images } from './generatePdfScripts';

function GeneratePdf(props) {
  const { t } = useTranslation();
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { activity, fillPdf } = props;

  const [docDefinitionDefault, setDocDefinitionDefault] = useState({
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [60, 60, 60, 40],
    footer: function (currentPage, pageCount, pageSize) {
      return [
        {
          style: 'footer',
          table: {
            border: [false, false, false, false],
            widths: ['auto', '*', 'auto'],
            heights: 40,
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: `${activity.title}`,
                  style: 'footerCell',
                  link: window.location.href,
                  alignment: 'left',
                },
                {
                  border: [false, false, false, false],
                  style: 'footerCell',
                  text: currentPage.toString() + '/' + pageCount,
                  alignment: 'center',
                },

                {
                  border: [false, false, false, false],
                  style: 'footerCell',
                  text: `made by: @${activity.creators[0].username}`,
                  link: window.location.href,
                  alignment: 'right',
                },
              ],
            ],
          },
          layout: {
            fillColor: '#eeeeee',
          },
        },
      ];
    },

    content: [],
    defaultStyle: {
      columnGap: 15,
    },
    styles: pdfStyle,
  });
  useEffect(async () => {
    const result = await Promise.all(getBase64Images(activity));
    const promiseImages = {};
    result.forEach(item => {
      Object.entries(item).map(([key, value]) => {
        promiseImages[key] = value;
      });
    });
    setDocDefinitionDefault(state => {
      let newContent = state.content;
      newContent.push({
        alignment: 'justify',
        columns: [
          {
            stack: [
              {
                text: activity.title,
                style: 'title',
                alignment: 'justify',
              },
              {
                text: 'Activity GUIDE',
                style: 'secondaryTitle',
              },
              {
                text: 'This guide outlines some getting started ideas, materials required, and the making process of this activity from things around us. See it on the right!',
                style: 'textBody',
              },
            ],
          },
          {
            image: promiseImages['activityImage'],
            style: 'image',
            width: 200,
          },
        ],
      });
      activity.video !== '' &&
        newContent.push({
          //
          table: {
            body: [
              [
                {
                  border: [true, false, false, false],
                  margins: [20, 10, 10, 20],
                  fillColor: '#eeeeee',
                  text: ' To Watch it in action click here',
                  link: activity.video,
                  // text: `Watch it in action here: ${activity.video}`,
                  style: 'videoLink',
                },
              ],
              //  style: 'videoLink',
            ],
          },
        });
      newContent.push(
        getPdfTextBlock('MOTIVATION', 'activityMotivation'),
        getPdfMaterialsUsed(activity, promiseImages),
        getPdfTextBlock('LEARNING GOALS', 'activityLearningGoals'),
        getPdfMakingSteps(activity, promiseImages),
        getPdfTextBlock('FACILITATION TIPS', 'facilitationTips', true),
      );

      if (activity['inspiring_artist'] && promiseImages['inspiring_artist']) {
        newContent.push(getPdfInspiringPerson(activity, promiseImages));
      }

      if (
        activity['inspiring_examples'] &&
        activity['inspiring_examples'].length > 0
      ) {
        newContent.push(getPdfInspiringExamples(activity, promiseImages));
      }

      return {
        ...state,
        // header: function (currentPage, pageCount, pageSize) {
        //   return [
        //     {
        //       table: {
        //         alignment: 'center',
        //         border: [false, false, false, false],
        //         widths: [80],
        //         heights: 40,
        //         body: [
        //           [
        //             {
        //               border: [false, false, false, false],

        //               image: promiseImages['logo'],
        //               width: 80,
        //               height: 40,
        //               alignment: 'center',
        //             },
        //           ],
        //         ],
        //       },
        //       layout: {
        //         fillColor: 'white',
        //       },
        //     },
        //   ];
        // },
        content: [...newContent],
      };
    });
  }, [fillPdf]);

  const create = () => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinitionDefault);
    pdfDocGenerator.download();
  };

  return (
    <CustomButton
      variant="contained"
      primaryButtonStyle
      primaryButtonStyle3
      fullWidth
      onClick={e => create()}
    >
      {t('activityDetails.activity.pdf')}
    </CustomButton>
  );
}

export default GeneratePdf;

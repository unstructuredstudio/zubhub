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
import { getBase64Images } from '../../views/activity_details/activityDetailsScripts';

function GeneratePdf(props) {
  const { t } = useTranslation();
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const {
    activity,
    fillPdf,
    activityImage,
    activityTitle,
    activityMotivation,
    //  docDefinitionDefault,
  } = props;

  //console.log('docDefinitionDefault', docDefinitionDefault);
  //   pdfMake.fonts = {
  //     NimbusSans: {
  //       normal: 'NimbusSanL-Reg.otf',
  //       bold: 'NimbusSanL-Bol.otf',
  //       italics: 'NimbusSanL-RegIta.otf',
  //       bolditalics: 'NimbusSanL-BolIta.otf',
  //     },
  //   };
  const [docDefinitionDefault, setDocDefinitionDefault] = useState({
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 20, 40, 60],
    content: [
      {
        text: 'Zubhub Activities',
        style: 'header',
        alignment: 'center',
      },
    ],
    defaultStyle: {
      columnGap: 20,
    },
    styles: pdfStyle,
  });
  useEffect(async () => {
    //if (fillPdf) {
    const result = await Promise.all(getBase64Images(activity));
    const promiseImages = {};
    result.forEach(item => {
      Object.entries(item).map(([key, value]) => {
        promiseImages[key] = value;
      });
    });
    console.log('promises results', promiseImages);

    setDocDefinitionDefault(state => {
      let newContent = state.content;
      newContent.push(
        {
          alignment: 'justify',
          columns: [
            {
              image: promiseImages['activityImage'],
              width: 200,
              height: 200,
            },
            {
              text: activity.title,
              style: 'title',
              alignment: 'justify',
            },
          ],
        },
        {
          text: document.getElementById('activityMotivation').innerText,
          alignment: 'center',
        },
      );

      newContent.push(
        getPdfMaterialsUsed(activity, promiseImages),
        getPdfTextBlock('LEARNING GOALS', 'activityLearningGoals'),
        getPdfMakingSteps(activity, promiseImages),
        getPdfTextBlock('FACILITATION TIPS', 'facilitationTips'),
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

      console.log('content', newContent);
      return {
        ...state,
        content: [...newContent],
      };
    });
    //}
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

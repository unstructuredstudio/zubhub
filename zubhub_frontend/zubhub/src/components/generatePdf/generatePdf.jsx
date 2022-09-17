import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/button/Button';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function GeneratePdf(props) {
  const { t } = useTranslation();
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { activity, docDefinitionDefault } = props;
  console.log('docDefinitionDefault', docDefinitionDefault);
  //   pdfMake.fonts = {
  //     NimbusSans: {
  //       normal: 'NimbusSanL-Reg.otf',
  //       bold: 'NimbusSanL-Bol.otf',
  //       italics: 'NimbusSanL-RegIta.otf',
  //       bolditalics: 'NimbusSanL-BolIta.otf',
  //     },
  //   };
  //const [docDefinitionDefault, setDocDefinitionDefault] = useState({});

  // {
  //   layout: "lightHorizontalLines",
  //   style: "withMargin",
  //   table: {
  //     // headers are automatically repeated if the table spans over multiple pages
  //     // you can declare how many rows should be treated as headers
  //     headerRows: 1,
  //     widths: ["*", "auto", 100, "*", "*", "*", "*", "*"],

  //     body: [
  //       [],
  //       ["Value 1", "Value 2", "Value 3", "Value 4", "", "", "", ""],
  //       [
  //         { text: "Bold value", bold: true },
  //         "Val 2",
  //         "Val 3",
  //         "Val 4",
  //         "",
  //         "",
  //         "",
  //         ""
  //       ]
  //     ]
  //   }
  // }
  //   const [url, setUrl] = useState(null);
  //   const [data, setData] = useState([]);
  //   const [pdfData, setPdfData] = useState([]);
  //   const [docDefinition, setDocDefinition] = useState({});

  //   useEffect(() => {
  //     return () => {
  //       if (url !== null) {
  //         URL.revokeObjectURL(url);
  //       }
  //     };
  //   }, [url]);

  //   const setTableBodyData = () => {
  //     const template = { ...docDefinitionDefault };
  //     template.content[2].table.body = [headers, ...pdfData];
  //     setDocDefinition(template);
  //   };

  //   useEffect(() => {
  //     const parsed = parseLookAheadData(lookAheadData);
  //     const pdfData = parseToPdfData(parsed);
  //     setPdfData(pdfData);
  //     setData(parsed);
  //   }, []);

  //   useEffect(() => {
  //     setTableBodyData();
  //   }, [data]);

  const create = async () => {
    // const response = await getBase64ImageFromURL(
    //   activity.images[0].image.file_url,
    // );
    // console.log('response', response);

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

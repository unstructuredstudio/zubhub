import { colors } from '../../../assets/js/colors';

export const editorStyle = theme => ({
  editor: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    '& .ql-container.ql-snow': {
      borderRadius: '0 0 4px 4px !important',
      height: 150,
    },
    '& .ql-toolbar.ql-snow': {
      borderRadius: '4px 4px 0 0 !important',
      // overflow: 'auto'
    },
  },
  toolbarDisabled: {
    '& .ql-toolbar': {
      display: 'none',
    },
    '& .ql-container.ql-snow': {
      fontSize: 14,
      flex: 1,
      height: 150,
    },
  },
  editorTooltip: ({ position: { left, top, width } }) => ({
    display: 'flex',
    border: 'solid 1px #ccc',
    position: 'absolute',
    top: top - 50,
    left: width / 2 + left,
    borderRadius: 10,
    padding: '2px 20px',
    // gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  }),
  tooltipItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    borderRadius: 6,
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    },
  },
});

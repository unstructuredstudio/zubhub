import { Box, ClickAwayListener, makeStyles } from '@material-ui/core';
import {
  DescriptionOutlined,
  FileCopyOutlined,
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatUnderlinedOutlined,
} from '@material-ui/icons';
import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { editorStyle } from './editor.style';

const menu = [
  { name: 'copy', icon: FileCopyOutlined },
  { name: 'paste', icon: DescriptionOutlined },
  { name: 'bold', icon: FormatBoldOutlined },
  { name: 'italic', icon: FormatItalicOutlined },
  { name: 'underline', icon: FormatUnderlinedOutlined },
  // { name: 'attachment', icon: AttachFileOutlined },
];

export default function Editor() {
  let quillRef = useRef(null);
  const [position, setPosition] = useState({});
  const [isSeleted, setIsSeleted] = useState(false);
  const classes = makeStyles(editorStyle)({ position });

  const onSelectionChange = range => {
    if (range && range.length) {
      const { top, bottom, left, right, width } = getSelectedTextBounds();
      setPosition({ top, bottom, left, right, width });
      setIsSeleted(true);
    }
  };

  const getSelectedTextBounds = () => {
    const editor = quillRef.getEditor();
    const selection = editor.getSelection();
    if (selection && selection.length > 0) {
      const range = editor.getSelection(true);
      const bounds = editor.getBounds(range.index, range.length);
      return bounds;
    }
  };

  const handleFormatting = ({ bold, underline, italic, copy, paste }) => {
    const editor = quillRef.getEditor();
    if (bold) return setBold(editor);
    if (italic) return setItalic(editor);
    if (underline) return setUnderline(editor);
  };

  const setBold = editor => editor.format('bold', !editor.getFormat().bold);
  const setItalic = editor => editor.format('italic', !editor.getFormat().italic);
  const setUnderline = editor => editor.format('underline', !editor.getFormat().underline);

  const tooltip = (
    <ClickAwayListener onClickAway={() => setIsSeleted(false)}>
      <Box className={classes.editorTooltip}>
        <>
          {menu.map(({ name, icon: Icon }) => (
            <div key={name} className={classes.tooltipItem} onClick={() => handleFormatting({ [name]: true })}>
              <Icon style={{ fontSize: 18 }} />
            </div>
          ))}
        </>
      </Box>
    </ClickAwayListener>
  );

  return (
    <div style={{ position: 'relative' }}>
      <ReactQuill
        ref={ref => (quillRef = ref)}
        onChangeSelection={onSelectionChange}
        className={classes.editor}
        modules={{ toolbar: false }}
        placeholder="Please describe your project"
      />
      {isSeleted ? tooltip : null}
    </div>
  );
}

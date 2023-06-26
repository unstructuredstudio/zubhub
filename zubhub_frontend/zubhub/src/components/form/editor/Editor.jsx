import { makeStyles } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { editorStyle } from './editor.style';

export default function Editor() {
  const classes = makeStyles(editorStyle)();
  let quillRef = useRef(null);
  useEffect(() => {
    // const editor = quillRef.current?.getEditor();
    // if (editor) {
    //   editor.on('selection-change', handleSelectionChange);
    // }
    // return () => {
    //   if (editor) {
    //     editor.off('selection-change', handleSelectionChange);
    //   }
    // };
  }, []);

  console.log(quillRef.current);

  const handleSelectionChange = range => {
    if (range) {
      const selectedText = quillRef.current?.getEditor().getText(range.index, range.length);
      console.log('Selected Text:', selectedText);
    }
  };

  const handleChange = (...rest) => {
    // console.log(rest);
    // const selection = editor.getSelection();
    // if (selection && selection.length > 0) {
    //   const formats = editor.getFormat(selection.index, selection.length);
    //   if (formats.bold) {
    //     // If the selected text is already bold, remove the formatting
    //     editor.format('bold', false);
    //   } else {
    //     // Apply bold formatting to the selected text
    //     editor.format('bold', true);
    //   }
    // }
    // Continue with other onChange logic if needed
  };
  const onSelectionChange = range => {
    if (range && range.length) {
      handleFormatting({ italic: true });
    }
  };

  const handleFormatting = ({ bold, underline, italic, copy, paste }) => {
    const editor = quillRef.getEditor();
    if (bold) return setBold(editor);
    if (italic) return setItalic(editor);
  };

  const setBold = editor => editor.format('bold', !editor.getFormat().bold);
  const setItalic = editor => editor.format('italic', !editor.getFormat().italic);

  return (
    <ReactQuill
      ref={ref => (quillRef = ref)}
      onChangeSelection={onSelectionChange}
      onChange={handleChange}
      className={classes.editor}
      modules={{ toolbar: true }}
      // Other props
    />
  );
}

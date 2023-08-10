import React, { useEffect, useState } from 'react';
import { CustomButton, Editor, ImageInput, LabeledLine } from '../../../components';
import { Box, Button, Divider, IconButton, Menu, MenuItem, Typography, makeStyles } from '@material-ui/core';
import { step2Styles } from './Step2.styles';
import styles from '../../../assets/js/styles';
import { Add, MoreHoriz } from '@material-ui/icons';
import clsx from 'clsx';

const DEFAULT_STEP = { description: '', attachments: [] };
let index = 1;

export default function Step2() {
  const classes = makeStyles(step2Styles)();
  const commonClasses = makeStyles(styles)();
  const handleIntroductionChange = value => {};
  const [steps, setSteps] = useState([{ ...DEFAULT_STEP }]);
  const [anchorEl, setAnchorEl] = useState(null);

  const addStep = () => {
    setSteps([...steps, { ...DEFAULT_STEP }]);
  };

  const onStepChange = (data, type, stepIndex) => {
    let stepsTemp = [...steps];
    let step = stepsTemp[stepIndex];
    step[type] = data;
    stepsTemp[stepIndex] = step;
    console.log(data, type, stepIndex);

    setSteps(stepsTemp);
  };

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteStep = index => {
    setSteps(steps.splice(index, 1));
    handleClose();
  };

  const moveUp = index => {
    const stepsTemp = [...steps];
  };
  const moveDown = index => {
    if (index + 1 < steps.length) {
      const stepsTemp = [...steps];
      [stepsTemp[index], stepsTemp[index + 1]] = [stepsTemp[index + 1], stepsTemp[index]];
      setSteps(stepsTemp);
    }
  };

  console.log(steps);

  return (
    <div className={classes.container}>
      <Box className={classes.formItem}>
        <Editor
          // enableToolbar={true}
          onChange={handleIntroductionChange}
          label="Introduction"
          required
          placeholder="Start writting"
        />
        <LabeledLine label="ATTACH" />

        <ImageInput message={imageInputMessage} />
      </Box>

      <Box className={classes.formItem}>
        <Editor
          // enableToolbar={true}
          onChange={handleIntroductionChange}
          label="Materials Used"
          value={defaultQuillValue}
          required
          placeholder="1. "
        />
        <LabeledLine label="ATTACH" />

        <ImageInput message={imageInputMessage} />
      </Box>

      {steps.map((step, index) => (
        <div key={index}>
          <div className={clsx(commonClasses.justifySpaceBetween, commonClasses.alignCenter)}>
            <Typography className={commonClasses.title2}>Step {index + 1}:</Typography>
            <IconButton
              id={`basic-button${index}`}
              aria-controls={open ? `menu${index}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreHoriz />
            </IconButton>
            <Menu
              id={`menu${index}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': `basic-button${index}`,
              }}
            >
              <MenuItem onClick={() => moveUp(index)}>Move up one step</MenuItem>
              <MenuItem onClick={() => moveDown(index)}>Move down one step</MenuItem>
              <Divider />
              <MenuItem onClick={() => deleteStep(index)}>Delete step</MenuItem>
            </Menu>
          </div>
          <Box className={classes.formItem}>
            <Editor
              // enableToolbar={true}
              onChange={data => onStepChange(data, 'description', index)}
              value={step.description}
              placeholder="Type Description..."
            />
            <LabeledLine label="ATTACH" />

            <ImageInput message={imageInputMessage} />
          </Box>
        </div>
      ))}

      <CustomButton onClick={addStep} style={{ alignSelf: 'center' }} primaryButtonOutlinedStyle endIcon={<Add />}>
        Add New Step
      </CustomButton>
    </div>
  );
}

const imageInputMessage =
  'Upload photos and other files (Supported files: jpg, png, gif, bmp, pdf, txt, stl. Max 25MB)';
const defaultQuillValue = `
<ol>
  <li></li>
</ol>
`;

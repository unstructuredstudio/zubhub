export const calcAlignLeft = (step, stepCount) => {
  const leftPercent = (100 * step) / (stepCount - 1);
  return [leftPercent, '%'].join('');
};

export const isCompleted = (step, stateStep) => {
  return stateStep > step ? true : false;
};

//calculates and return the width percent of the progress bar to color based on step completed
export const widthToColorPercent = (stateStep, stepCount) => {
  return [(100 * (stateStep - 1)) / (stepCount - 1), '%'].join('');
};

export const arrayFromStepCount = stepCount => {
  const newArray = Array(stepCount + 1)
    .fill()
    .map((v, i) => i);
  newArray.shift();
  return newArray;
};

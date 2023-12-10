import React, { useContext } from 'react';
import { ThemeContext } from '../../../App';

function ProjectsCountIcon() {
  const theme = useContext(ThemeContext);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.48em"
      height="1.2em"
      fill={theme['primary-color3']}
      viewBox="0 0 576 512"
    >
      <path d="M0 80C0 53.49 21.49 32 48 32H144C170.5 32 192 53.49 192 80V96H384V80C384 53.49 405.5 32 432 32H528C554.5 32 576 53.49 576 80V176C576 202.5 554.5 224 528 224H432C405.5 224 384 202.5 384 176V160H192V176C192 177.7 191.9 179.4 191.7 180.1L272 288H368C394.5 288 416 309.5 416 336V432C416 458.5 394.5 480 368 480H272C245.5 480 224 458.5 224 432V336C224 334.3 224.1 332.6 224.3 331L144 224H48C21.49 224 0 202.5 0 176V80z" />
    </svg>
  );
}

export default ProjectsCountIcon;

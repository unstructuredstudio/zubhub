export const updateTheme = themeData => {
  const root = document.documentElement;

  root.style.setProperty('--primary-color1', themeData['Primary_Color1']);
  root.style.setProperty('--primary-color2', themeData['Primary_Color2']);
  root.style.setProperty('--primary-color3', themeData['Primary_Color3']);
  root.style.setProperty('--secondary-color1', themeData['Secondary_Color1']);
  root.style.setProperty('--secondary-color2', themeData['Secondary_Color2']);
  root.style.setProperty('--secondary-color3', themeData['Secondary_Color3']);
  root.style.setProperty('--secondary-color4', themeData['Secondary_Color4']);
  root.style.setProperty('--secondary-color5', themeData['Secondary_Color5']);
  root.style.setProperty('--secondary-color6', themeData['Secondary_Color6']);
  root.style.setProperty('--text-color1', themeData['Text_Color1']);
  root.style.setProperty('--text-color2', themeData['Text_Color2']);
  root.style.setProperty('--text-color3', themeData['Text_Color3']);
};

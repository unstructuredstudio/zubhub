export const handleFileButtonClick = (refs) => {
    refs.fileInput.current.click()
}; 

export const handleFileFieldChange = (refs, props) => {
    refs.file_count_el.current.innerText = `${
    refs.fileInput.current.files.length
    } ${props.t(
        `createProject.inputs.${
            refs.fileInput.current.files.length < 2 ? 'image' : 'images'
        }`,
        )}`;
};   
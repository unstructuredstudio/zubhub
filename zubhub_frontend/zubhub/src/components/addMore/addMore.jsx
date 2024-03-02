import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import CustomButton from '../../components/button/Button';
function AddMore(props) {
  const {label, setNodeList} = props
  const addNode = () => {
    setNodeList((prevNodes) => [...prevNodes, ''])
  }
  return (
    <CustomButton
        variant="outlined"
        size="large"
        onClick={e => addNode()}
        secondaryButtonStyle
        customButtonStyle
            
        >
        <AddIcon />{' '}
        {label}
    </CustomButton>  
  )
}

export default AddMore
export const validateStep = (step, props, newActivity) =>{
   props.handleSetState({step: step, newActivity: newActivity})
   props.handleSetState({newActivity: newActivity})      
   }
   
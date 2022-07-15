const validateStep = (step, props, newActivity) =>{
   props.handleSetState({step: step})
   props.handleSetState({newActivity: newActivity})      
   }
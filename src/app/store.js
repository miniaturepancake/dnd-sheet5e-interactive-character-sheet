function createRuntimeStore(initialState,persistState){
  let currentState=initialState;
  const listeners=[];

  function notify(nextState,meta){
    listeners.slice().forEach(listener=>listener(nextState,meta||{}));
  }

  function getState(){
    return currentState;
  }

  function setState(nextState,options){
    const opts=options || {};
    currentState=nextState;
    if(opts.persist!==false && typeof persistState==='function') persistState(currentState);
    if(opts.notify!==false) notify(currentState,opts);
    return currentState;
  }

  function updateState(mutator,options){
    const draft=clone(currentState);
    mutator(draft);
    return setState(draft,options);
  }

  function subscribe(listener){
    listeners.push(listener);
    return function unsubscribe(){
      const index=listeners.indexOf(listener);
      if(index>=0) listeners.splice(index,1);
    };
  }

  return {getState,setState,updateState,subscribe};
}

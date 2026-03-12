const LEVEL_ORDINAL = {'1':'1st','2':'2nd','3':'3rd','4':'4th','5':'5th','6':'6th'};
let lastSavedAt = '';
const runtimeStore=createRuntimeStore(loadState(),saveStateSnapshot);
saveStateSnapshot(runtimeStore.getState());

function getState(){
	return runtimeStore.getState();
}

function replaceState(nextState,options){
	return runtimeStore.setState(nextState,options);
}

function updateState(mutator,options){
	return runtimeStore.updateState(mutator,options);
}

function subscribeState(listener){
	return runtimeStore.subscribe(listener);
}

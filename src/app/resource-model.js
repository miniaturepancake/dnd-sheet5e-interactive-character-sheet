function runtimeResourceId(alias){
  return CURRENT_CHARACTER_RESOURCE_IDS[alias] || null;
}

function runtimeResourcePath(alias){
  const id=runtimeResourceId(alias);
  return id ? `resources.${id}` : '';
}

function runtimeResourceValue(alias){
  const id=runtimeResourceId(alias);
  return id ? !!state.resources[id] : false;
}

function runtimeResourceValueById(resourceId){
  return !!state.resources[resourceId];
}

function setRuntimeResourceValue(alias,value){
  const id=runtimeResourceId(alias);
  if(!id) return false;
  state.resources[id]=value;
  return true;
}

function setRuntimeResourceValueById(resourceId,value){
  if(!resourceId) return false;
  state.resources[resourceId]=value;
  return true;
}

function toggleRuntimeResourceValue(alias){
  const id=runtimeResourceId(alias);
  if(!id) return false;
  state.resources[id]=!state.resources[id];
  return true;
}

function spellSlotCount(levelKey){
  return Number(state.spellSlots[levelKey] || 0);
}

function spendSpellSlot(levelKey){
  const current=spellSlotCount(levelKey);
  if(current<=0) return false;
  state.spellSlots[levelKey]=current-1;
  return true;
}

function spendItemUse(itemId){
  if(!itemId || !state.itemUses[itemId]) return false;
  state.itemUses[itemId]=false;
  return true;
}

function toggleItemUse(itemId){
  if(!itemId) return false;
  state.itemUses[itemId]=!state.itemUses[itemId];
  return true;
}

function spendFreeCastByResourceId(resourceId){
  if(!resourceId || !runtimeResourceValueById(resourceId)) return false;
  setRuntimeResourceValueById(resourceId,false);
  return true;
}

function getSpellCastRule(spellName){
  return CURRENT_CHARACTER_SPELL_CAST_RULES[spellName] || null;
}

function getSpellCastRuleByActionType(actionType){
  return Object.values(CURRENT_CHARACTER_SPELL_CAST_RULES).find(rule=>rule.actionType===actionType) || null;
}

function resetRuntimeResourceIds(ids){
  ids.forEach(id=>{
    if(id in state.resources) state.resources[id]=CHARACTER_DEFAULT_STATE.resources[id];
  });
}

function resetRuntimeItemRecoveries(){
  state.itemResources=state.itemResources || {};
  CURRENT_CHARACTER_ITEM_RECOVERY_IDS.forEach(id=>{
    const defaultValue=CHARACTER_DEFAULT_STATE.itemResources?.[id]?.recoveryAvailable;
    state.itemResources[id]={recoveryAvailable: typeof defaultValue==='boolean' ? defaultValue : true};
  });
}

function refreshRuntimeItemUses(){
  CURRENT_CHARACTER_ITEM_USE_IDS.forEach(id=>{
    state.itemUses[id]=true;
  });
}
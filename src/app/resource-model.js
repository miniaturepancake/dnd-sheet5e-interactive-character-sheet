function runtimeResourceId(alias){
  return CURRENT_CHARACTER_RESOURCE_IDS[alias] || null;
}

function resolveRuntimeState(runtimeState){
  return runtimeState || getState();
}

function runtimeResourcePath(alias){
  const id=runtimeResourceId(alias);
  return id ? `resources.${id}` : '';
}

function runtimeResourceValue(alias,runtimeState){
  const id=runtimeResourceId(alias);
  const source=resolveRuntimeState(runtimeState);
  return id ? !!source.resources[id] : false;
}

function runtimeResourceValueById(resourceId,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  return !!source.resources[resourceId];
}

function setRuntimeResourceValue(alias,value,runtimeState){
  const id=runtimeResourceId(alias);
  const source=resolveRuntimeState(runtimeState);
  if(!id) return false;
  source.resources[id]=value;
  return true;
}

function setRuntimeResourceValueById(resourceId,value,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  if(!resourceId) return false;
  source.resources[resourceId]=value;
  return true;
}

function toggleRuntimeResourceValue(alias,runtimeState){
  const id=runtimeResourceId(alias);
  const source=resolveRuntimeState(runtimeState);
  if(!id) return false;
  source.resources[id]=!source.resources[id];
  return true;
}

function spellSlotCount(levelKey,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  return Number(source.spellSlots[levelKey] || 0);
}

function spendSpellSlot(levelKey,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  const current=spellSlotCount(levelKey,source);
  if(current<=0) return false;
  source.spellSlots[levelKey]=current-1;
  return true;
}

function spendItemUse(itemId,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  if(!itemId || !source.itemUses[itemId]) return false;
  source.itemUses[itemId]=false;
  return true;
}

function toggleItemUse(itemId,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  if(!itemId) return false;
  source.itemUses[itemId]=!source.itemUses[itemId];
  return true;
}

function spendFreeCastByResourceId(resourceId,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  if(!resourceId || !runtimeResourceValueById(resourceId,source)) return false;
  setRuntimeResourceValueById(resourceId,false,source);
  return true;
}

function getSpellCastRule(spellName){
  return CURRENT_CHARACTER_SPELL_CAST_RULES[spellName] || null;
}

function getSpellCastRuleByActionType(actionType){
  return Object.values(CURRENT_CHARACTER_SPELL_CAST_RULES).find(rule=>rule.actionType===actionType) || null;
}

function resetRuntimeResourceIds(ids,runtimeState){
  const source=resolveRuntimeState(runtimeState);
  ids.forEach(id=>{
    if(id in source.resources) source.resources[id]=CHARACTER_DEFAULT_STATE.resources[id];
  });
}

function resetRuntimeItemRecoveries(runtimeState){
  const source=resolveRuntimeState(runtimeState);
  source.itemResources=source.itemResources || {};
  CURRENT_CHARACTER_ITEM_RECOVERY_IDS.forEach(id=>{
    const defaultValue=CHARACTER_DEFAULT_STATE.itemResources?.[id]?.recoveryAvailable;
    source.itemResources[id]={recoveryAvailable: typeof defaultValue==='boolean' ? defaultValue : true};
  });
}

function refreshRuntimeItemUses(runtimeState){
  const source=resolveRuntimeState(runtimeState);
  CURRENT_CHARACTER_ITEM_USE_IDS.forEach(id=>{
    source.itemUses[id]=true;
  });
}
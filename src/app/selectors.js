function selectState(){
  return getState();
}

function selectUi(){
  return selectState().ui || {};
}

function selectActiveTab(){
  return selectUi().activeTab;
}

function selectSpellFilters(){
  return selectUi().spellFilters || {timing:'', concentration:false, ritual:false};
}

function selectExpandedSpells(){
  return selectUi().expandedSpells || {};
}

function selectResourceById(resourceId){
  return selectState().resources?.[resourceId];
}

function selectResource(alias){
  const resourceId=runtimeResourceId(alias);
  if(!resourceId) return undefined;
  return selectResourceById(resourceId);
}

function selectResourceBool(alias){
  return !!selectResource(alias);
}

function selectSpellSlots(){
  return selectState().spellSlots || {};
}

function selectSpellSlotCount(levelKey){
  return Number(selectSpellSlots()[levelKey] || 0);
}

function selectHasSpellSlot(levelKey){
  return selectSpellSlotCount(levelKey)>0;
}

function selectItemUse(itemId){
  return !!selectState().itemUses?.[itemId];
}

function selectItemRecovery(itemId){
  return !!selectState().itemResources?.[itemId]?.recoveryAvailable;
}

function selectAttunement(attunementId){
  return !!selectState().attunement?.[attunementId];
}

function selectIsFocusHeld(){
  return selectResourceBool('focusHeld');
}

function selectLastSavedAt(){
  return lastSavedAt;
}

function spellSlotPath(levelKey){
  return `spellSlots.${levelKey}`;
}

function attunementPath(attunementId){
  return `attunement.${attunementId}`;
}

function itemRecoveryPath(itemId){
  return `itemResources.${itemId}.recoveryAvailable`;
}

function consumablePath(name){
  return `consumables.${name}`;
}

function notePath(section){
  return `notes.${section}`;
}

function bioPath(field){
  return `biography.${field}`;
}

function selectBioLocked(){
  return (selectState().biography || {}).locked !== false;
}

function selectBioField(field){
  const override=(selectState().biography || {})[field];
  if(override!==null && override!==undefined && override!=='') return override;
  return null;
}

function selectNotesUnlocked(){
  return !!(selectState().ui || {}).notesUnlocked;
}

function selectNotesPasswordError(){
  return !!(selectState().ui || {}).notesPasswordError;
}

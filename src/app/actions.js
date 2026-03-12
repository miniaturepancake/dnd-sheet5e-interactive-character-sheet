function resolveSpellCastIntent(spell,levelKey){
  if(spell.id){
    const available=!!state.itemUses[spell.id];
    return {type:'item', available, disabledReason:available ? '' : 'Item use spent', levelKey:levelKey||''};
  }

  const specialRule=getSpellCastRule(spell.name);
  if(specialRule && specialRule.type==='freeThenSlot'){
    const freeAvailable=runtimeResourceValueById(specialRule.freeResourceId);
    const slotAvailable=spellSlotCount(specialRule.slotLevel)>0;
    const available=freeAvailable || slotAvailable;
    return {
      type:specialRule.actionType,
      available,
      disabledReason:available ? '' : specialRule.depletedReason,
      levelKey:specialRule.slotLevel,
    };
  }

  if(levelKey){
    const available=spellSlotCount(levelKey)>0;
    return {type:'slot', available, disabledReason:available ? '' : 'No slot remaining', levelKey};
  }

  return {type:'none', available:true, disabledReason:'', levelKey:''};
}

function runCastSpellAction(payload){
  const castType=payload.castType;
  const level=payload.level;
  const itemId=payload.itemId;

  if(castType==='item') return spendItemUse(itemId);
  if(castType==='slot') return spendSpellSlot(level);

  const specialRule=getSpellCastRuleByActionType(castType);
  if(!specialRule || specialRule.type!=='freeThenSlot') return false;
  if(spendFreeCastByResourceId(specialRule.freeResourceId)) return true;
  return spendSpellSlot(specialRule.slotLevel);
}

function dispatchRuntimeAction(action,payload){
  if(action==='tab'){state.ui.activeTab=payload.tab; return {handled:true, render:true};}
  if(action==='toggleSpellFilter'){
    const filter=payload.filter;
    const value=payload.value;
    if(filter==='timing'){
      state.ui.spellFilters.timing=state.ui.spellFilters.timing===value ? '' : value;
    }else{
      state.ui.spellFilters[filter]=!state.ui.spellFilters[filter];
    }
    return {handled:true, render:true};
  }
  if(action==='clearSpellFilters'){clearSpellFilters(); return {handled:true, render:true};}
  if(action==='toggleSpellExpand'){
    state.ui.expandedSpells=state.ui.expandedSpells || {};
    state.ui.expandedSpells[payload.key]=!state.ui.expandedSpells[payload.key];
    return {handled:true, render:true};
  }
  if(action==='dec' || action==='inc'){
    const path=payload.path;
    const current=Number(getByPath(state,path) ?? 0);
    const max=Number(payload.max || current+999);
    const next=action==='dec' ? Math.max(0,current-1) : Math.min(max,current+1);
    setByPath(state,path,next);
    return {handled:true, render:true};
  }
  if(action==='toggle'){
    const path=payload.path;
    setByPath(state,path,!getByPath(state,path));
    return {handled:true, render:true};
  }
  if(action==='toggleShield'){
    const shieldActiveAlias='shieldActive';
    const reactionAlias='reactionUsed';
    const next=!runtimeResourceValue(shieldActiveAlias);
    setRuntimeResourceValue(shieldActiveAlias,next);
    if(next) setRuntimeResourceValue(reactionAlias,true);
    return {handled:true, render:true};
  }
  if(action==='toggleItemUse'){
    toggleItemUse(payload.key);
    return {handled:true, render:true};
  }
  if(action==='castSpell'){
    runCastSpellAction(payload);
    return {handled:true, render:true};
  }
  if(action==='rollSpirit'){state.lastSpiritRoll=Math.floor(Math.random()*10)+1; return {handled:true, render:true};}
  if(action==='shortRest'){shortRest(); return {handled:true, render:true};}
  if(action==='longRest'){longRest(); return {handled:true, render:true};}
  if(action==='resetAll'){resetAll(); return {handled:true, render:true};}
  return {handled:false, render:false};
}

function dispatchRuntimeChange(action,payload){
  if(action==='number'){
    const path=payload.path;
    let value=Number(payload.value || 0);
    value=path==='hp.max' ? Math.max(1,value) : Math.max(0,value);
    setByPath(state,path,value);
    if(path==='hp.max' && state.hp.current>state.hp.max) state.hp.current=state.hp.max;
    return {handled:true, render:true};
  }
  if(action==='checkbox'){
    setByPath(state,payload.path,!!payload.checked);
    return {handled:true, render:true};
  }
  return {handled:false, render:false};
}

function dispatchRuntimeInput(action,payload){
  if(action==='textarea'){
    setByPath(state,payload.path,payload.value);
    return {handled:true, render:false, saveOnly:true};
  }
  return {handled:false, render:false};
}
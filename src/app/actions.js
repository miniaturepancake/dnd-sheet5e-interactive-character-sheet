function resolveSpellCastIntent(spell,levelKey){
  if(spell.id){
    const available=selectItemUse(spell.id);
    return {type:'item', available, disabledReason:available ? '' : 'Item use spent', levelKey:levelKey||''};
  }

  const specialRule=getSpellCastRule(spell.name);
  if(specialRule && specialRule.type==='freeThenSlot'){
    const freeAvailable=!!selectResourceById(specialRule.freeResourceId);
    const slotAvailable=selectHasSpellSlot(specialRule.slotLevel);
    const available=freeAvailable || slotAvailable;
    return {
      type:specialRule.actionType,
      available,
      disabledReason:available ? '' : specialRule.depletedReason,
      levelKey:specialRule.slotLevel,
    };
  }

  if(levelKey){
    const available=selectHasSpellSlot(levelKey);
    return {type:'slot', available, disabledReason:available ? '' : 'No slot remaining', levelKey};
  }

  return {type:'none', available:true, disabledReason:'', levelKey:''};
}

function runCastSpellAction(payload,runtimeState){
  const castType=payload.castType;
  const level=payload.level;
  const itemId=payload.itemId;

  if(castType==='item') return spendItemUse(itemId,runtimeState);
  if(castType==='slot') return spendSpellSlot(level,runtimeState);

  const specialRule=getSpellCastRuleByActionType(castType);
  if(!specialRule || specialRule.type!=='freeThenSlot') return false;
  if(spendFreeCastByResourceId(specialRule.freeResourceId,runtimeState)) return true;
  return spendSpellSlot(specialRule.slotLevel,runtimeState);
}

function dispatchRuntimeAction(action,payload){
  if(action==='tab'){updateState(function(nextState){nextState.ui.activeTab=payload.tab;}); return {handled:true, render:true};}
  if(action==='toggleSpellFilter'){
    updateState(function(nextState){
      const filter=payload.filter;
      const value=payload.value;
      if(filter==='timing'){
        nextState.ui.spellFilters.timing=nextState.ui.spellFilters.timing===value ? '' : value;
      }else{
        nextState.ui.spellFilters[filter]=!nextState.ui.spellFilters[filter];
      }
    });
    return {handled:true, render:true};
  }
  if(action==='clearSpellFilters'){updateState(function(nextState){nextState.ui.spellFilters={timing:'', concentration:false, ritual:false};}); return {handled:true, render:true};}
  if(action==='toggleSpellExpand'){
    updateState(function(nextState){nextState.ui.expandedSpells=nextState.ui.expandedSpells || {}; nextState.ui.expandedSpells[payload.key]=!nextState.ui.expandedSpells[payload.key];});
    return {handled:true, render:true};
  }
  if(action==='dec' || action==='inc'){
    updateState(function(nextState){const path=payload.path; const current=Number(getByPath(nextState,path) ?? 0); const max=Number(payload.max || current+999); const next=action==='dec' ? Math.max(0,current-1) : Math.min(max,current+1); setByPath(nextState,path,next);});
    return {handled:true, render:true};
  }
  if(action==='toggle'){
    updateState(function(nextState){const path=payload.path; setByPath(nextState,path,!getByPath(nextState,path));});
    return {handled:true, render:true};
  }
  if(action==='toggleShield'){
    updateState(function(nextState){const shieldActiveAlias='shieldActive'; const reactionAlias='reactionUsed'; const next=!runtimeResourceValue(shieldActiveAlias,nextState); setRuntimeResourceValue(shieldActiveAlias,next,nextState); if(next) setRuntimeResourceValue(reactionAlias,true,nextState);});
    return {handled:true, render:true};
  }
  if(action==='toggleItemUse'){
    updateState(function(nextState){toggleItemUse(payload.key,nextState);});
    return {handled:true, render:true};
  }
  if(action==='castSpell'){
    updateState(function(nextState){runCastSpellAction(payload,nextState);});
    return {handled:true, render:true};
  }
  if(action==='rollSpirit'){updateState(function(nextState){nextState.lastSpiritRoll=Math.floor(Math.random()*10)+1;}); return {handled:true, render:true};}
  if(action==='shortRest'){shortRest(); return {handled:true, render:true};}
  if(action==='longRest'){longRest(); return {handled:true, render:true};}
  if(action==='resetAll'){resetAll(); return {handled:true, render:true};}
  if(action==='notesUnlock'){const input=document.getElementById('notes-password-input'); const attempt=input?input.value.trim():''; const expected=(window.NOTES_CONFIG&&window.NOTES_CONFIG.password)||''; if(attempt===expected&&expected!==''){updateState(function(s){s.ui.notesUnlocked=true; s.ui.notesPasswordError=false;});}else{updateState(function(s){s.ui.notesPasswordError=true;});} return {handled:true, render:true};}
  if(action==='notesRelock'){updateState(function(s){s.ui.notesUnlocked=false; s.ui.notesPasswordError=false;}); return {handled:true, render:true};}
  return {handled:false, render:false};
}

function dispatchRuntimeChange(action,payload){
  if(action==='number'){
    updateState(function(nextState){const path=payload.path; let value=Number(payload.value || 0); value=path==='hp.max' ? Math.max(1,value) : Math.max(0,value); setByPath(nextState,path,value); if(path==='hp.max' && nextState.hp.current>nextState.hp.max) nextState.hp.current=nextState.hp.max;});
    return {handled:true, render:true};
  }
  if(action==='checkbox'){
    updateState(function(nextState){setByPath(nextState,payload.path,!!payload.checked);});
    return {handled:true, render:true};
  }
  return {handled:false, render:false};
}

function dispatchRuntimeInput(action,payload){
  if(action==='textarea'){
    updateState(function(nextState){setByPath(nextState,payload.path,payload.value);},{notify:false});
    return {handled:true, render:false, saveOnly:true};
  }
  return {handled:false, render:false};
}
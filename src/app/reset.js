function shortRest(){resetRuntimeResourceIds(CURRENT_CHARACTER_SHORT_REST_RESOURCE_IDS);}
function longRest(){state.hp.current=state.hp.max; state.hp.temp=0; state.hitDiceRemaining=CHARACTER_DEFAULT_STATE.hitDiceRemaining; state.deathSaves.successes=[false,false,false]; state.deathSaves.failures=[false,false,false]; resetRuntimeResourceIds(CURRENT_CHARACTER_LONG_REST_RESOURCE_IDS); state.spellSlots=clone(DATA.spellSlots); refreshRuntimeItemUses(); resetRuntimeItemRecoveries();}
function resetAll(){state=clone(CHARACTER_DEFAULT_STATE);}

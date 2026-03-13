const CURRENT_CHARACTER_ID = resolveCurrentCharacterId();
const CURRENT_CHARACTER = window.CHARACTERS[CURRENT_CHARACTER_ID];

if(!CURRENT_CHARACTER){
  throw new Error('No current character configured.');
}

function resolveCurrentCharacterId(){
  if(window.ACTIVE_CHARACTER_ID) return window.ACTIVE_CHARACTER_ID;
  if(typeof window.resolveBootCharacterId==='function') return window.resolveBootCharacterId();
  return window.DEFAULT_CHARACTER_ID;
}

const CHARACTER_BUNDLE_ID = CURRENT_CHARACTER.bundleId || CURRENT_CHARACTER_ID;
const CHARACTER_BUNDLES = window.CHARACTER_BUNDLES || {};
const CHARACTER_BUNDLE = CHARACTER_BUNDLES[CHARACTER_BUNDLE_ID];
const DATA = CHARACTER_BUNDLE && CHARACTER_BUNDLE.data;
const DEFAULT_STATE = CHARACTER_BUNDLE && CHARACTER_BUNDLE.defaultState;
const SPELL_META = CHARACTER_BUNDLE && CHARACTER_BUNDLE.spellMeta;
const STORAGE_KEY = (CHARACTER_BUNDLE && CHARACTER_BUNDLE.storageKey) || CURRENT_CHARACTER.storageKey;
const CURRENT_CHARACTER_LEGACY_STORAGE_KEYS = normalizeLegacyStorageKeys(CURRENT_CHARACTER, CHARACTER_BUNDLE);

if(!DATA || !DEFAULT_STATE || !SPELL_META){
  throw new Error(`Character bundle data is missing for ${CURRENT_CHARACTER_ID}.`);
}
const CURRENT_CHARACTER_RUNTIME_MODEL = CURRENT_CHARACTER.runtimeModel || {};
const CURRENT_CHARACTER_FOCUS_ITEM_ID = CURRENT_CHARACTER_RUNTIME_MODEL.focusItemId || null;
const CURRENT_CHARACTER_SHORT_REST_RESOURCE_IDS = CURRENT_CHARACTER_RUNTIME_MODEL.shortRestResourceIds || [];
const CURRENT_CHARACTER_LONG_REST_RESOURCE_IDS = CURRENT_CHARACTER_RUNTIME_MODEL.longRestResourceIds || [];
const CURRENT_CHARACTER_ITEM_RECOVERY_IDS = CURRENT_CHARACTER_RUNTIME_MODEL.itemRecoveryIds || [];
const CURRENT_CHARACTER_RESOURCE_IDS = normalizeResourceIds(CURRENT_CHARACTER_RUNTIME_MODEL.resourceIds || {});
const CURRENT_CHARACTER_SPELL_CAST_RULES = normalizeSpellCastRules(CURRENT_CHARACTER_RUNTIME_MODEL.spellCastRules || {});
const CURRENT_CHARACTER_ATTUNEMENT_IDS = (DATA.attunement || []).map(item => item.id || item.key).filter(Boolean);
const CURRENT_CHARACTER_MAGIC_ITEMS_BY_ID = indexMagicItems(DATA.magicItems || []);
const CURRENT_CHARACTER_FOCUS_ITEM = CURRENT_CHARACTER_FOCUS_ITEM_ID ? (CURRENT_CHARACTER_MAGIC_ITEMS_BY_ID[CURRENT_CHARACTER_FOCUS_ITEM_ID] || null) : null;
const CURRENT_CHARACTER_FOCUS_ITEM_NAME = CURRENT_CHARACTER_FOCUS_ITEM?.name || 'Focus item';
const CURRENT_CHARACTER_ITEM_USE_IDS = collectItemUseIds(DATA);
const CURRENT_CHARACTER_ITEM_USE_LABELS = collectItemUseLabels(DATA);
const CURRENT_CHARACTER_QUICK_RESOURCES = normalizeQuickResources(CURRENT_CHARACTER_RUNTIME_MODEL.quickResources || {});
const CHARACTER_DEFAULT_STATE = normalizeState(DEFAULT_STATE);

function normalizeLegacyStorageKeys(character,bundle){
  const keys=[];
  const addKey=(value)=>{
    if(value && !keys.includes(value) && value!==STORAGE_KEY) keys.push(value);
  };
  (character.legacyStorageKeys || []).forEach(addKey);
  (bundle?.legacyStorageKeys || []).forEach(addKey);
  return keys;
}

function normalizeResourceIds(resourceIds){
  return {
    focusHeld: resourceIds.focusHeld || 'holdingViol',
    shieldFreeCast: resourceIds.shieldFreeCast || 'shieldFree',
    spiritGuardiansFreeCast: resourceIds.spiritGuardiansFreeCast || 'spiritGuardiansFree',
    spiritGuardiansCover: resourceIds.spiritGuardiansCover || 'spiritGuardiansCover',
    shieldActive: resourceIds.shieldActive || 'shieldActive',
    reactionUsed: resourceIds.reactionUsed || 'reactionUsed',
    concentration: resourceIds.concentration || 'concentration',
    bardicInspiration: resourceIds.bardicInspiration || 'bardicInspiration',
    blessing: resourceIds.blessing || 'blessing',
  };
}

function normalizeSpellCastRules(spellCastRules){
  const shieldRule=spellCastRules['Shield'] || {};
  const spiritGuardiansRule=spellCastRules['Spirit Guardians'] || {};
  return {
    'Shield': {
      type: shieldRule.type || 'freeThenSlot',
      actionType: shieldRule.actionType || 'shield',
      freeResourceId: shieldRule.freeResourceId || CURRENT_CHARACTER_RESOURCE_IDS.shieldFreeCast,
      slotLevel: shieldRule.slotLevel || '1',
      depletedReason: shieldRule.depletedReason || 'No Shield free cast or 1st-level slot',
    },
    'Spirit Guardians': {
      type: spiritGuardiansRule.type || 'freeThenSlot',
      actionType: spiritGuardiansRule.actionType || 'spiritGuardians',
      freeResourceId: spiritGuardiansRule.freeResourceId || CURRENT_CHARACTER_RESOURCE_IDS.spiritGuardiansFreeCast,
      slotLevel: spiritGuardiansRule.slotLevel || '3',
      depletedReason: spiritGuardiansRule.depletedReason || 'No Spirit Guardians free cast or 3rd-level slot',
    },
  };
}

function normalizeQuickResources(quickResources){
  return {
    summaryEntries: Array.isArray(quickResources.summaryEntries) ? quickResources.summaryEntries : [],
    groups: Array.isArray(quickResources.groups) ? quickResources.groups : [],
    includeItemPowers: quickResources.includeItemPowers !== false,
  };
}

function indexMagicItems(items){
  return (items || []).reduce(function(index,item){
    if(item && item.id) index[item.id]=item;
    return index;
  }, {});
}

function collectItemUseIds(data){
  const ids=[];
  const addId=(value)=>{if(value && !ids.includes(value)) ids.push(value);};
  Object.values(data.cantrips || {}).flat().forEach(spell=>addId(spell.id));
  const itemGranted=(data.specialSpells || {})['Item-granted spells'] || {};
  Object.values(itemGranted).flat().forEach(spell=>addId(spell.id));
  return ids;
}

function collectItemUseLabels(data){
  const labels={};
  const addSpell=(spell)=>{
    if(spell && spell.id && !labels[spell.id]) labels[spell.id]=spell.name || spell.id;
  };
  Object.values(data.cantrips || {}).flat().forEach(addSpell);
  const itemGranted=(data.specialSpells || {})['Item-granted spells'] || {};
  Object.values(itemGranted).flat().forEach(addSpell);
  return labels;
}

function normalizeAttunementState(attunement){
  const normalized={};
  for(const item of (DATA.attunement || [])){
    const id=item.id || item.key;
    if(!id) continue;
    const legacyKey=item.key;
    const fromId=attunement ? attunement[id] : undefined;
    const fromLegacy=attunement ? attunement[legacyKey] : undefined;
    normalized[id]=typeof fromId==='boolean' ? fromId : (typeof fromLegacy==='boolean' ? fromLegacy : !!item.default);
  }
  return normalized;
}

function normalizeItemUseState(itemUses){
  const normalized={};
  for(const id of CURRENT_CHARACTER_ITEM_USE_IDS){
    normalized[id]=itemUses && typeof itemUses[id]==='boolean' ? itemUses[id] : true;
  }
  return normalized;
}

function normalizeItemResourceState(itemResources, resources){
  const normalized={};
  for(const id of CURRENT_CHARACTER_ITEM_RECOVERY_IDS){
    const current=itemResources?.[id]?.recoveryAvailable;
    const legacy=resources?.[`${id}Recover`];
    const defaultValue=DEFAULT_STATE.itemResources?.[id]?.recoveryAvailable;
    const value=typeof current==='boolean' ? current : (typeof legacy==='boolean' ? legacy : (typeof defaultValue==='boolean' ? defaultValue : true));
    normalized[id]={recoveryAvailable:value};
  }
  return normalized;
}

function normalizeState(rawState){
  const merged=deepMerge(clone(DEFAULT_STATE), rawState || {});
  merged.attunement=normalizeAttunementState(merged.attunement || {});
  merged.itemUses=normalizeItemUseState(merged.itemUses || {});
  merged.itemResources=normalizeItemResourceState(merged.itemResources || {}, merged.resources || {});
  if(merged.ui) merged.ui.notesPasswordError=false;
  if(merged.resources){
    for(const id of CURRENT_CHARACTER_ITEM_RECOVERY_IDS){
      const legacyKey=`${id}Recover`;
      if(legacyKey in merged.resources) delete merged.resources[legacyKey];
    }
  }
  return merged;
}

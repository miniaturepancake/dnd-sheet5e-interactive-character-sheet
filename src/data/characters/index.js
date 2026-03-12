function buildStorageKey(seed){
  return `${seed}-sheet-v1`;
}

window.CHARACTER_BOOT_CONFIG = {
  queryParam: 'character',
};

window.resolveBootCharacterId = function resolveBootCharacterId(){
  const knownCharacters=window.CHARACTERS||{};
  const knownIds=Object.keys(knownCharacters);
  if(!knownIds.length) return null;

  const bootConfig=window.CHARACTER_BOOT_CONFIG||{};
  const queryParam=bootConfig.queryParam||'character';
  const searchParams=new URLSearchParams(window.location.search||'');
  const requestedId=(searchParams.get(queryParam)||'').trim();

  if(requestedId && requestedId in knownCharacters) return requestedId;
  return null;
};

window.CHARACTERS = {
  'sable-vey': {
    id: 'sable-vey',
    label: 'Sable Vey',
    bundleId: 'sable-vey',
    storageKeySeed: 'sable-vey',
    storageKey: buildStorageKey('sable-vey'),
    scriptPaths: [
      './src/data/characters/sable-vey/character-data.js',
      './src/data/characters/sable-vey/default-state.js',
      './src/data/characters/sable-vey/spell-meta.js',
    ],
    runtimeModel: {
      focusItemId: 'viol',
      itemRecoveryIds: ['viol'],
      resourceIds: {
        focusHeld: 'holdingViol',
        shieldFreeCast: 'shieldFree',
        spiritGuardiansFreeCast: 'spiritGuardiansFree',
        spiritGuardiansCover: 'spiritGuardiansCover',
        shieldActive: 'shieldActive',
        reactionUsed: 'reactionUsed',
        concentration: 'concentration',
        bardicInspiration: 'bardicInspiration',
        blessing: 'blessing',
      },
      spellCastRules: {
        'Shield': {
          type: 'freeThenSlot',
          actionType: 'shield',
          freeResourceId: 'shieldFree',
          slotLevel: '1',
          depletedReason: 'No Shield free cast or 1st-level slot',
        },
        'Spirit Guardians': {
          type: 'freeThenSlot',
          actionType: 'spiritGuardians',
          freeResourceId: 'spiritGuardiansFree',
          slotLevel: '3',
          depletedReason: 'No Spirit Guardians free cast or 3rd-level slot',
        },
      },
      shortRestResourceIds: ['bardicInspiration', 'spiritGuardiansCover', 'reactionUsed', 'concentration', 'shieldActive'],
      longRestResourceIds: ['bardicInspiration', 'blessing', 'shieldFree', 'spiritGuardiansFree', 'spiritGuardiansCover', 'reactionUsed', 'concentration', 'shieldActive'],
    },
  },
  'placeholder-adept': {
    id: 'placeholder-adept',
    label: 'Morrow Vale',
    bundleId: 'placeholder-adept',
    storageKeySeed: 'placeholder-adept',
    storageKey: buildStorageKey('placeholder-adept'),
    scriptPaths: [
      './src/data/characters/placeholder-adept/character-data.js',
      './src/data/characters/placeholder-adept/default-state.js',
      './src/data/characters/placeholder-adept/spell-meta.js',
    ],
    runtimeModel: {
      focusItemId: 'viol',
      itemRecoveryIds: ['viol'],
      resourceIds: {
        focusHeld: 'holdingViol',
        shieldFreeCast: 'shieldFree',
        spiritGuardiansFreeCast: 'spiritGuardiansFree',
        spiritGuardiansCover: 'spiritGuardiansCover',
        shieldActive: 'shieldActive',
        reactionUsed: 'reactionUsed',
        concentration: 'concentration',
        bardicInspiration: 'bardicInspiration',
        blessing: 'blessing',
      },
      spellCastRules: {
        'Shield': {
          type: 'freeThenSlot',
          actionType: 'shield',
          freeResourceId: 'shieldFree',
          slotLevel: '1',
          depletedReason: 'No Shield free cast or 1st-level slot',
        },
        'Spirit Guardians': {
          type: 'freeThenSlot',
          actionType: 'spiritGuardians',
          freeResourceId: 'spiritGuardiansFree',
          slotLevel: '3',
          depletedReason: 'No Spirit Guardians free cast or 3rd-level slot',
        },
      },
      shortRestResourceIds: ['bardicInspiration', 'spiritGuardiansCover', 'reactionUsed', 'concentration', 'shieldActive'],
      longRestResourceIds: ['bardicInspiration', 'blessing', 'shieldFree', 'spiritGuardiansFree', 'spiritGuardiansCover', 'reactionUsed', 'concentration', 'shieldActive'],
    },
  },
};

window.DEFAULT_CHARACTER_ID = 'sable-vey';

window.CHARACTER_REGISTRY_SCAFFOLD = {
  'example-character-id': {
    id: 'example-character-id',
    label: 'Example Character',
    bundleId: 'example-character-id',
    storageKeySeed: 'example-character-id',
    storageKey: buildStorageKey('example-character-id'),
    scriptPaths: [
      './src/data/characters/example-character-id/character-data.js',
      './src/data/characters/example-character-id/default-state.js',
      './src/data/characters/example-character-id/spell-meta.js',
    ],
    runtimeModel: {
      focusItemId: null,
      itemRecoveryIds: [],
      resourceIds: {},
      spellCastRules: {},
      shortRestResourceIds: [],
      longRestResourceIds: [],
    },
  },
};

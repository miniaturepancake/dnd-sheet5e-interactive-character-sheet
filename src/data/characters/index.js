function buildStorageKey(seed){
  return `${seed}-sheet-v1`;
}

function quickResourceConfig(){
  return {
    summaryEntries: [
      {kind: 'resource-counter', alias: 'bardicInspiration', label: 'Bardic Inspiration', shortLabel: 'Inspiration', max: 5},
      {kind: 'resource-counter', alias: 'blessing', label: 'Blessing of the Raven Queen', shortLabel: 'Blessing', max: 4},
      {kind: 'resource-toggle', alias: 'shieldFreeCast', label: 'Shield free cast', shortLabel: 'Shield'},
      {kind: 'resource-toggle', alias: 'spiritGuardiansFreeCast', label: 'Spirit Guardians free cast', shortLabel: 'Spirit G.'},
    ],
    groups: [
      {
        id: 'classResources',
        label: 'Class resources',
        entries: [
          {kind: 'resource-counter', alias: 'bardicInspiration', label: 'Bardic Inspiration', max: 5, note: 'Short or Long Rest'},
          {kind: 'resource-counter', alias: 'blessing', label: 'Blessing of the Raven Queen', max: 4, note: 'Long Rest'},
          {kind: 'path-counter', path: 'hitDiceRemaining', label: 'Hit Dice', max: 11, note: 'Short Rest spend'},
        ],
      },
      {
        id: 'freeCasts',
        label: 'Free casts',
        entries: [
          {kind: 'resource-toggle', alias: 'shieldFreeCast', label: 'Shield', note: 'Magic Initiate', onLabel: 'Available', offLabel: 'Used'},
          {kind: 'resource-toggle', alias: 'spiritGuardiansFreeCast', label: 'Spirit Guardians', note: 'Subclass', onLabel: 'Available', offLabel: 'Used'},
          {kind: 'resource-toggle', alias: 'spiritGuardiansCover', label: 'Spirit Guardians Half Cover', note: 'Short or Long Rest', onLabel: 'Ready', offLabel: 'Used'},
        ],
      },
    ],
    includeItemPowers: true,
  };
}

window.CHARACTER_BOOT_CONFIG = {
  queryParam: 'character',
};

// NOTES_CONFIG: password for the Notes tab soft UI gate.
// CLIENT-SIDE ONLY: This password is visible in the page source.
// It provides soft access control for a static GitHub Pages site only.
// It is NOT server-side protection and should not guard sensitive information.
// Change the password value here to configure it per deployment.
window.NOTES_CONFIG = {
  password: 'notes',
};

window.CHARACTER_ID_ALIASES = {
  'placeholder-adept': 'morrow-vale',
};

window.resolveCanonicalCharacterId = function resolveCanonicalCharacterId(requestedId){
  const knownCharacters=window.CHARACTERS||{};
  const aliases=window.CHARACTER_ID_ALIASES||{};
  const value=(requestedId||'').trim();
  if(!value) return null;
  if(value in knownCharacters) return value;
  const aliasedId=aliases[value];
  return aliasedId && aliasedId in knownCharacters ? aliasedId : null;
};

window.resolveBootCharacterId = function resolveBootCharacterId(){
  const bootConfig=window.CHARACTER_BOOT_CONFIG||{};
  const queryParam=bootConfig.queryParam||'character';
  const searchParams=new URLSearchParams(window.location.search||'');
  const requestedId=(searchParams.get(queryParam)||'').trim();
  const resolver=window.resolveCanonicalCharacterId;
  return typeof resolver==='function' ? resolver(requestedId) : null;
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
      quickResources: quickResourceConfig(),
    },
  },
  'morrow-vale': {
    id: 'morrow-vale',
    label: 'Morrow Vale',
    bundleId: 'morrow-vale',
    storageKeySeed: 'morrow-vale',
    storageKey: buildStorageKey('morrow-vale'),
    legacyIds: ['placeholder-adept'],
    legacyStorageKeys: [buildStorageKey('placeholder-adept')],
    scriptPaths: [
      './src/data/characters/morrow-vale/character-data.js',
      './src/data/characters/morrow-vale/default-state.js',
      './src/data/characters/morrow-vale/spell-meta.js',
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
      quickResources: quickResourceConfig(),
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
      quickResources: {
        summaryEntries: [],
        groups: [],
        includeItemPowers: true,
      },
    },
  },
};

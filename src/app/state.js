const DATA = window.SABLE_DATA;
const DEFAULT_STATE = window.SABLE_DEFAULT_STATE;
const SPELL_META = window.SABLE_SPELL_META;
const LEVEL_ORDINAL = {'1':'1st','2':'2nd','3':'3rd','4':'4th','5':'5th','6':'6th'};
let state = loadState();
let lastSavedAt = '';

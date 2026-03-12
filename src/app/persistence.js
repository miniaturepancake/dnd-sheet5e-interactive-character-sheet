const STORAGE_KEY = 'sable-vey-sheet-v1';
function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return clone(DEFAULT_STATE); return deepMerge(clone(DEFAULT_STATE), JSON.parse(raw));}catch(err){return clone(DEFAULT_STATE);}}
function saveState(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); lastSavedAt = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});}

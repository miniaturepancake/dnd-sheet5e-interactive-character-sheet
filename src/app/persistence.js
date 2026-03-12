function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return clone(CHARACTER_DEFAULT_STATE); return normalizeState(JSON.parse(raw));}catch(err){return clone(CHARACTER_DEFAULT_STATE);}}
function saveState(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); lastSavedAt = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});}

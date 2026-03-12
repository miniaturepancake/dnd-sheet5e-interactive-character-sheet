function parseStoredState(raw){
	if(!raw) return null;
	return normalizeState(JSON.parse(raw));
}

function migrateLegacyState(){
	for(const legacyKey of (CURRENT_CHARACTER_LEGACY_STORAGE_KEYS || [])){
		const raw=localStorage.getItem(legacyKey);
		if(!raw) continue;
		const migrated=parseStoredState(raw);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
		return migrated;
	}
	return null;
}

function loadState(){
	try{
		const stored=parseStoredState(localStorage.getItem(STORAGE_KEY));
		if(stored) return stored;
		const migrated=migrateLegacyState();
		if(migrated) return migrated;
		return clone(CHARACTER_DEFAULT_STATE);
	}catch(err){
		return clone(CHARACTER_DEFAULT_STATE);
	}
}

function saveStateSnapshot(runtimeState){
	localStorage.setItem(STORAGE_KEY, JSON.stringify(runtimeState));
	lastSavedAt = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
}

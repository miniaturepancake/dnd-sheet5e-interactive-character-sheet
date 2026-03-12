function counterCard(title,path,max,meta){
  const runtimeState=selectState();
  const value=Number(getByPath(runtimeState,path) ?? 0);
  const cap=typeof max==='string' ? Number(getByPath(runtimeState,max) ?? 0) : Number(max);
  const depleted=value<=0;
  return `<div class="resource-card ${depleted?'depleted':'available'}"><div class="resource-top"><div><div class="resource-name">${escapeHtml(title)}</div><div class="resource-meta">${escapeHtml(meta)}</div></div><div class="small"><strong>${value}</strong> / ${cap}</div></div><div class="stepper"><button data-action="dec" data-path="${path}">−</button><div class="stepper-value">${value}</div><button data-action="inc" data-path="${path}" data-max="${cap}">+</button></div></div>`;
}

function boolCard(title,path,meta,onLabel='Available',offLabel='Used',style='on'){
  const runtimeState=selectState();
  const value=!!getByPath(runtimeState,path);
  const klass=value ? (style==='neutral' ? 'neutral-on' : 'on') : 'off';
  return `<div class="resource-card ${value?'available':'depleted'}"><div class="resource-top"><div><div class="resource-name">${escapeHtml(title)}</div><div class="resource-meta">${escapeHtml(meta)}</div></div></div><button class="toggle-btn ${klass}" data-action="toggle" data-path="${path}">${value ? onLabel : offLabel}</button></div>`;
}

function activeSpellFilterCount(){
  const f=selectSpellFilters();
  return (f.timing?1:0) + (f.concentration?1:0) + (f.ritual?1:0);
}

function clearSpellFilters(){
  updateState(function(nextState){
    nextState.ui.spellFilters={timing:'', concentration:false, ritual:false};
  });
}

function getSpellMeta(spell){
  const raw=SPELL_META[spell.name]||{};
  const tags=spell.tags||[];
  return {
    timing: raw.timing || 'action',
    concentration: !!raw.concentration,
    ritual: !!raw.ritual || tags.includes('Ritual'),
    range: raw.range || '—',
    duration: raw.duration || '—',
    components: raw.components || '—',
    damage: raw.damage || '',
    save: raw.save || '',
  };
}

function spellKey(spell){
  return spell.id || spell.name;
}

function isSpellExpanded(spell){
  return !!selectExpandedSpells()[spellKey(spell)];
}

function spellMatchesFilters(spell){
  const filters=selectSpellFilters();
  const meta=getSpellMeta(spell);
  if(filters.timing && meta.timing!==filters.timing) return false;
  if(filters.concentration && !meta.concentration) return false;
  if(filters.ritual && !meta.ritual) return false;
  return true;
}

function parseSpellLevelKey(label){
  if(/cantrip/i.test(label)) return null;
  const match=String(label||'').match(/^(\d+)(?:st|nd|rd|th)\s+level/i);
  return match ? match[1] : null;
}

function renderSpellFilterBar(){
  const filters=selectSpellFilters();
  const timingButton=function(value,label){
    return `<button class="spell-filter-btn ${filters.timing===value?'active':''}" data-action="toggleSpellFilter" data-filter="timing" data-value="${value}">${label}</button>`;
  };
  const toggleButton=function(key,label){
    return `<button class="spell-filter-btn ${filters[key]?'active':''}" data-action="toggleSpellFilter" data-filter="${key}" data-value="${filters[key]?'off':'on'}">${label}</button>`;
  };
  return `<div class="spell-filter-wrap"><div class="spell-filter-bar">${timingButton('action','Action')}${timingButton('bonus','Bonus Action')}${timingButton('reaction','Reaction')}${toggleButton('concentration','Concentration')}${toggleButton('ritual','Ritual')}${activeSpellFilterCount()?'<button class="spell-filter-btn" data-action="clearSpellFilters">Clear filters</button>':''}</div><div class="spell-filter-note">Filter by casting time and maintenance. Click a spell name to expand its details. Spell detail tags use local spell metadata; source/category tags remain unchanged.</div></div>`;
}

function renderSpellSection(groups){
  const blocks=groups.map(function(group){
    const label=group[0];
    const spells=group[1];
    const filtered=spells.filter(spellMatchesFilters);
    if(!filtered.length) return '';
    const levelKey=parseSpellLevelKey(label);
    return `<div class="spell-group"><h3 class="spell-level-title">${escapeHtml(label)}</h3><div class="spell-card-grid">${filtered.map(function(spell){return spellCard(spell,levelKey);}).join('')}</div></div>`;
  }).filter(Boolean).join('');
  return blocks || `<div class="empty-state">No spells in this section match the active filters.</div>`;
}

function renderSpiritResult(){
  const runtimeState=selectState();
  if(!runtimeState.lastSpiritRoll) return `<div class="footer-note">Spirits from Beyond currently uses only results 1–10 at Bard 11.</div>`;
  const spirit = DATA.spirits.find(function(entry){return entry.roll===runtimeState.lastSpiritRoll;});
  if(!spirit) return '';
  return `<div class="spirits-result"><strong>Spirit result ${spirit.roll} — ${escapeHtml(spirit.name)}</strong><div class="small" style="margin-top:6px;line-height:1.45;">${escapeHtml(spirit.effect)}</div></div>`;
}

function spellCard(spell,levelKey){
  const meta=getSpellMeta(spell);
  const timingLabel=meta.timing==='bonus' ? '1 Bonus Action' : (meta.timing==='reaction' ? '1 Reaction' : '1 Action');
  const sourceTags=[...(spell.tags||[])];
  const detailTags=[timingLabel, meta.range, meta.duration, `Components: ${meta.components}`, ...(meta.concentration?['Concentration']:[]), ...(meta.ritual?['Ritual']:[])];
  const effectTags=[...(meta.damage?[meta.damage]:[]), ...(meta.save?[meta.save]:[])];
  const expanded=isSpellExpanded(spell);
  const key=spellKey(spell);
  const castIntent=resolveSpellCastIntent(spell,levelKey);
  const itemAvailable=spell.id ? selectItemUse(spell.id) : null;
  const cardClasses=['spell-card'];
  if(expanded) cardClasses.push('expanded');
  if((spell.id && !itemAvailable) || (castIntent.type!=='none' && !castIntent.available)) cardClasses.push('depleted');
  const castButton=castIntent.type==='none' ? '' : `<div class="spell-cast-row"><button class="cast-btn ${castIntent.available?'available':'depleted'}" data-action="castSpell" data-cast-type="${castIntent.type}" data-level="${castIntent.levelKey||''}" data-item-id="${spell.id||''}" data-spell-name="${escapeHtml(spell.name)}" ${castIntent.available?'':'disabled'}>${castIntent.available?'Cast':'Depleted'}</button>${castIntent.disabledReason?`<span class="spell-cast-note">${escapeHtml(castIntent.disabledReason)}</span>`:''}</div>`;
  return `<div class="${cardClasses.join(' ')}"><button class="spell-row-btn" data-action="toggleSpellExpand" data-key="${escapeHtml(key)}" aria-expanded="${expanded?'true':'false'}"><span class="spell-name-wrap"><span class="spell-chevron">▸</span><span class="spell-name">${escapeHtml(spell.name)}</span></span></button><div class="spell-card-body">${sourceTags.length?`<div class="spell-tags">${sourceTags.map(function(tag){return `<span class="tag ${/Magical Secrets|Subclass|Magic Initiate/.test(tag)?'special':/Item cast/.test(tag)?'item':''}">${escapeHtml(tag)}</span>`;}).join('')}</div>`:''}<div class="spell-detail-row">${detailTags.map(function(tag){return `<span class="tag meta">${escapeHtml(tag)}</span>`;}).join('')}</div>${effectTags.length?`<div class="spell-effect-row">${effectTags.map(function(tag){return `<span class="tag effect">${escapeHtml(tag)}</span>`;}).join('')}</div>`:''}${castButton}${spell.id ? `<div class="pill-grid"><button class="use-pill ${itemAvailable?'available':'spent'}" data-action="toggleItemUse" data-key="${spell.id}">${itemAvailable?'Available':'Used'}</button></div>` : ''}</div></div>`;
}

function renderSpellSlots(){
  return Object.entries(DATA.spellSlots).map(function(entry){
    const level=entry[0];
    const max=entry[1];
    const current=selectSpellSlotCount(level);
    return `<div class="slot-row"><div><strong>${LEVEL_ORDINAL[level]}</strong> level</div><div class="slot-pips">${Array.from({length:max},function(_,index){return `<span class="slot-pip ${index<current?'filled':''}"></span>`;}).join('')}</div><div class="stepper"><button data-action="dec" data-path="${spellSlotPath(level)}">−</button><div class="stepper-value">${current}</div><button data-action="inc" data-path="${spellSlotPath(level)}" data-max="${max}">+</button></div></div>`;
  }).join('');
}

function humanizeLabel(value){
  return String(value||'')
    .replace(/([a-z])([A-Z])/g,'$1 $2')
    .replace(/[_-]+/g,' ')
    .replace(/\s+/g,' ')
    .trim()
    .replace(/^./, function(char){return char.toUpperCase();});
}

function magicItemName(itemId,fallback){
  return CURRENT_CHARACTER_MAGIC_ITEMS_BY_ID[itemId]?.name || fallback || humanizeLabel(itemId);
}

function itemUseLabel(itemId){
  return CURRENT_CHARACTER_ITEM_USE_LABELS[itemId] || humanizeLabel(itemId);
}

function findQuickEntryByResourceId(resourceId){
  const entries=[...(CURRENT_CHARACTER_QUICK_RESOURCES.summaryEntries||[]), ...(CURRENT_CHARACTER_QUICK_RESOURCES.groups||[]).flatMap(function(group){return group.entries || [];})];
  for(const entry of entries){
    if(entry.resourceId===resourceId) return entry;
    if(entry.alias && runtimeResourceId(entry.alias)===resourceId) return entry;
  }
  return null;
}

function resourceLabelById(resourceId){
  const configured=findQuickEntryByResourceId(resourceId);
  if(configured && configured.label) return configured.label;
  return humanizeLabel(resourceId);
}

function quickEntryPath(entry){
  if(entry.kind==='resource-counter' || entry.kind==='resource-toggle') return runtimeResourcePath(entry.alias);
  if(entry.kind==='path-counter' || entry.kind==='path-toggle') return entry.path || '';
  if(entry.kind==='item-recovery') return itemRecoveryPath(entry.itemId);
  return '';
}

function quickEntryLabel(entry){
  if(entry.label) return entry.label;
  if(entry.kind==='item-use') return itemUseLabel(entry.itemId);
  if(entry.kind==='item-recovery') return `${magicItemName(entry.itemId)} recovery`;
  if(entry.alias) return humanizeLabel(entry.alias);
  if(entry.resourceId) return humanizeLabel(entry.resourceId);
  if(entry.path) return humanizeLabel(entry.path.split('.').slice(-1)[0]);
  return 'Tracked resource';
}

function quickEntryShortLabel(entry){
  return entry.shortLabel || quickEntryLabel(entry);
}

function quickEntryNote(entry){
  return entry.note || 'Tracked resource';
}

function quickEntryMax(entry,runtimeState){
  const source=runtimeState || selectState();
  if(entry.max===undefined || entry.max===null) return null;
  if(typeof entry.max==='string') return Number(getByPath(source, entry.max) ?? 0);
  return Number(entry.max);
}

function quickEntryValue(entry,runtimeState){
  const source=runtimeState || selectState();
  if(entry.kind==='resource-counter') return Number(selectResource(entry.alias));
  if(entry.kind==='path-counter') return Number(getByPath(source, entry.path) ?? 0);
  if(entry.kind==='resource-toggle') return !!selectResource(entry.alias);
  if(entry.kind==='path-toggle') return !!getByPath(source, entry.path);
  if(entry.kind==='item-use') return !!selectItemUse(entry.itemId);
  if(entry.kind==='item-recovery') return !!selectItemRecovery(entry.itemId);
  return null;
}

function renderQuickSummaryPill(entry){
  const value=quickEntryValue(entry);
  if(entry.kind==='resource-counter' || entry.kind==='path-counter'){
    const max=quickEntryMax(entry);
    return `<span class="quick-summary-pill ${value>0?'available':'spent'}"><strong>${escapeHtml(quickEntryShortLabel(entry))}</strong><span>${value}${max!==null?` / ${max}`:''}</span></span>`;
  }
  return `<span class="quick-summary-pill ${value?'available':'spent'}"><strong>${escapeHtml(quickEntryShortLabel(entry))}</strong><span>${value?(entry.onLabel||'Ready'):(entry.offLabel||'Spent')}</span></span>`;
}

function renderQuickEntryCard(entry){
  const label=quickEntryLabel(entry);
  const note=quickEntryNote(entry);
  const path=quickEntryPath(entry);
  if(entry.kind==='resource-counter' || entry.kind==='path-counter'){
    return counterCard(label, path, quickEntryMax(entry), note);
  }
  if(entry.kind==='resource-toggle' || entry.kind==='path-toggle' || entry.kind==='item-recovery'){
    return boolCard(label, path, note, entry.onLabel || 'Ready', entry.offLabel || 'Used', entry.style || 'on');
  }
  if(entry.kind==='item-use'){
    const available=selectItemUse(entry.itemId);
    return `<div class="resource-card ${available?'available':'depleted'}"><div class="resource-top"><div><div class="resource-name">${escapeHtml(label)}</div><div class="resource-meta">${escapeHtml(note)}</div></div></div><button class="toggle-btn ${available?'neutral-on':'off'}" data-action="toggleItemUse" data-key="${entry.itemId}">${available?(entry.onLabel || 'Available'):(entry.offLabel || 'Used')}</button></div>`;
  }
  return '';
}

function buildItemPowerEntries(){
  const entries=[];
  CURRENT_CHARACTER_ITEM_RECOVERY_IDS.forEach(function(itemId){
    entries.push({kind:'item-recovery', itemId:itemId, label:`${magicItemName(itemId)} recovery`, note:'Item recovery', onLabel:'Available', offLabel:'Used'});
  });
  CURRENT_CHARACTER_ITEM_USE_IDS.forEach(function(itemId){
    entries.push({kind:'item-use', itemId:itemId, label:itemUseLabel(itemId), note:'Item power', onLabel:'Available', offLabel:'Used'});
  });
  return entries;
}

function renderQuickGroup(group){
  const entries=(group.entries || []).map(renderQuickEntryCard).join('');
  if(!entries) return '';
  return `<section class="quick-group-card"><div class="quick-group-head"><h3>${escapeHtml(group.label || 'Resources')}</h3></div><div class="quick-entry-grid">${entries}</div></section>`;
}

function renderRestCadenceSection(title,resourceIds){
  if(!resourceIds.length) return `<div class="quick-rest-block"><div class="quick-rest-title">${escapeHtml(title)}</div><div class="quick-mini-pills"><span class="quick-mini-pill empty">No tracked resources</span></div></div>`;
  const pills=resourceIds.map(function(resourceId){
    const value=runtimeResourceValueById(resourceId);
    return `<span class="quick-mini-pill ${value?'available':'spent'}">${escapeHtml(resourceLabelById(resourceId))}: ${value?'Ready':'Spent'}</span>`;
  }).join('');
  return `<div class="quick-rest-block"><div class="quick-rest-title">${escapeHtml(title)}</div><div class="quick-mini-pills">${pills}</div></div>`;
}

function renderQuickResourcesSurface(){
  const configuredGroups=(CURRENT_CHARACTER_QUICK_RESOURCES.groups || []).map(renderQuickGroup).join('');
  const itemPowerEntries=CURRENT_CHARACTER_QUICK_RESOURCES.includeItemPowers===false ? [] : buildItemPowerEntries();
  const itemPowerGroup=itemPowerEntries.length ? `<section class="quick-group-card"><div class="quick-group-head"><h3>Item powers</h3></div><div class="quick-entry-grid">${itemPowerEntries.map(renderQuickEntryCard).join('')}</div></section>` : '';
  const restGroup=`<section class="quick-group-card quick-rest-card"><div class="quick-group-head"><h3>Rest resources</h3></div>${renderRestCadenceSection('Short-rest resources', CURRENT_CHARACTER_SHORT_REST_RESOURCE_IDS)}${renderRestCadenceSection('Long-rest resources', CURRENT_CHARACTER_LONG_REST_RESOURCE_IDS)}</section>`;
  return `<div class="quick-resources-shell">${configuredGroups}${itemPowerGroup}${restGroup}</div>`;
}

function renderQuickPlayBar(){
  const runtimeState=selectState();
  const d=derived();
  const summaryEntries=(CURRENT_CHARACTER_QUICK_RESOURCES.summaryEntries || []).map(renderQuickSummaryPill).join('');
  const hasSpellcasting=!!DATA.spellcasting;
  return `<div class="quick-play-bar"><section class="quick-play-tile quick-play-vitals"><div class="status-label">Hit Points</div><div class="quick-play-value">${runtimeState.hp.current} / ${runtimeState.hp.max}</div><div class="quick-play-sub">Temp HP ${runtimeState.hp.temp} • ${d.hpPct}%</div></section><section class="quick-play-tile"><div class="status-label">Armor Class</div><div class="quick-play-value">${d.ac}</div><div class="quick-play-sub">${selectResourceBool('shieldActive')?'Shield active':'Base AC'}</div></section><section class="quick-play-tile quick-play-actions"><div class="status-label">Action economy</div><div class="quick-play-actions-row"><button class="toggle-btn ${selectResourceBool('concentration')?'on':'off'}" data-action="toggle" data-path="${runtimeResourcePath('concentration')}">${selectResourceBool('concentration')?'Concentration on':'Concentration off'}</button><button class="toggle-btn ${selectResourceBool('reactionUsed')?'off':'neutral-on'}" data-action="toggle" data-path="${runtimeResourcePath('reactionUsed')}">${selectResourceBool('reactionUsed')?'Reaction spent':'Reaction ready'}</button></div></section>${hasSpellcasting?`<section class="quick-play-tile"><div class="status-label">Spellcasting</div><div class="quick-play-split"><div><div class="quick-play-stat">DC ${d.spellDc}</div><div class="quick-play-mini">Save DC</div></div><div><div class="quick-play-stat">+${d.spellAtk}</div><div class="quick-play-mini">Attack</div></div></div></section>`:''}<section class="quick-play-tile quick-play-summary"><div class="status-label">Key resources</div><div class="quick-summary-pills">${summaryEntries || '<span class="quick-summary-pill empty">No quick resources configured</span>'}</div></section></div>`;
}

function applyEventResult(result){if(!result || !result.handled) return; if(result.render){renderApp(); return;} if(result.saveOnly){const pill=document.querySelector('.saved-pill'); if(pill) pill.textContent = `Saved locally • ${selectLastSavedAt()}`;}}
function handleClick(event){const btn=event.target.closest('[data-action]'); if(!btn) return; applyEventResult(dispatchRuntimeAction(btn.dataset.action, btn.dataset));}
function handleChange(event){const el=event.target; applyEventResult(dispatchRuntimeChange(el.dataset.action, {path:el.dataset.path, value:el.value, checked:el.checked}));}
function handleInput(event){const el=event.target; applyEventResult(dispatchRuntimeInput(el.dataset.action, {path:el.dataset.path, value:el.value}));}

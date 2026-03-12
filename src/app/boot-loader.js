(function(){
  const sharedScriptPaths=[
    './src/app/utils.js',
    './src/app/current-character.js',
    './src/app/persistence.js',
    './src/app/store.js',
    './src/app/state.js',
    './src/app/resource-model.js',
    './src/app/selectors.js',
    './src/app/derived.js',
    './src/app/reset.js',
    './src/app/actions.js',
    './src/app/view-helpers.js',
    './src/app/render.js',
    './src/app/events.js',
    './src/app/main.js',
  ];

  function loadScript(path){
    return new Promise(function(resolve,reject){
      const script=document.createElement('script');
      script.src=path;
      script.async=false;
      script.onload=function(){resolve();};
      script.onerror=function(){reject(new Error(`Failed to load script: ${path}`));};
      document.head.appendChild(script);
    });
  }

  function loadScriptsSequentially(paths){
    return paths.reduce(function(chain,path){
      return chain.then(function(){return loadScript(path);});
    }, Promise.resolve());
  }

  function escapeHtml(value){
    return String(value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function buildCharacterHref(id){
    const base=window.location.pathname.split('?')[0] || 'index.html';
    return `${base}?character=${encodeURIComponent(id)}`;
  }

  function renderCharacterChooser(knownCharacters){
    const app=document.getElementById('app');
    if(!app) throw new Error('Chooser root #app is missing.');
    const entries=Object.values(knownCharacters);
    app.innerHTML=`<section class="chooser-shell"><div class="chooser-card"><h1>Choose a character</h1><p class="chooser-sub">Select a character to open the interactive sheet.</p><div class="chooser-list">${entries.map(character=>`<a class="chooser-item" href="${buildCharacterHref(character.id)}">${escapeHtml(character.label||character.id)}</a>`).join('')}</div></div></section>`;
  }

  function startBoot(){
    const knownCharacters=window.CHARACTERS||{};
    const resolver=window.resolveBootCharacterId;
    const resolvedId=typeof resolver==='function' ? resolver() : null;
    const characterId=(resolvedId && resolvedId in knownCharacters) ? resolvedId : null;

    if(!characterId){
      renderCharacterChooser(knownCharacters);
      return Promise.resolve();
    }

    const characterConfig=knownCharacters[characterId];

    if(!characterConfig){
      throw new Error('No boot character could be resolved from registry.');
    }

    window.ACTIVE_CHARACTER_ID=characterId;

    return loadScriptsSequentially(characterConfig.scriptPaths||[])
      .then(function(){return loadScriptsSequentially(sharedScriptPaths);});
  }

  startBoot().catch(function(error){
    throw error;
  });
})();

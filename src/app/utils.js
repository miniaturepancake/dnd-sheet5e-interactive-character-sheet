function clone(v){return JSON.parse(JSON.stringify(v));}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function getByPath(obj,path){return path.split('.').reduce((acc,key)=>acc?.[key],obj);}
function setByPath(obj,path,value){const parts=path.split('.');let cur=obj;for(let i=0;i<parts.length-1;i++)cur=cur[parts[i]];cur[parts[parts.length-1]]=value;}
function escapeHtml(str){return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');}
function deepMerge(base,override){if(Array.isArray(base)||Array.isArray(override)) return override ?? base; if(typeof base!=='object'||base===null) return override ?? base; const out={...base}; for(const key of Object.keys(override||{})){out[key]=key in base? deepMerge(base[key],override[key]) : override[key];} return out;}

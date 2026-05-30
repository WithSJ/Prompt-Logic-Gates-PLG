// PLG Semantic Compiler Engine
// Node-by-Node compilation trace + AI gate logic connection triggers

export const CATEGORIES = {
  subject:    { p: 100, label: 'Subject', kw: ['man','woman','person','people','character','figure','girl','boy','child','ghost','nurse','creature','monster','demon','spirit','animal','dog','cat','soldier','priest','father','daughter','robot','zombie','skeleton','witch','beast','entity','protagonist','villain','face','portrait'] },
  environment:{ p: 90,  label: 'Environment', kw: ['hospital','forest','room','factory','city','street','house','building','dungeon','cave','school','office','church','temple','abandoned','ruins','landscape','mountain','desert','ocean','sea','village','town','corridor','hallway','basement','attic','warehouse','laboratory','swamp','jungle','interior','exterior','background','setting','environment'] },
  action:     { p: 80,  label: 'Action', kw: ['running','walking','standing','sitting','screaming','crying','attacking','holding','fighting','jumping','falling','crawling','hiding','chasing','floating','flying','reaching','looking','staring','praying','dancing','reading','sleeping','dying','bleeding'] },
  emotion:    { p: 70,  label: 'Emotion', kw: ['scary','terrifying','eerie','creepy','dread','horror','horrific','ominous','unsettling','frightening','tense','melancholic','sad','happy','joyful','peaceful','calm','angry','lonely','hopeless','disturbing','nightmarish','sinister','mood','atmosphere','atmospheric'] },
  lighting:   { p: 60,  label: 'Lighting', kw: ['dark','darkness','bright','dim','neon','candlelight','moonlight','sunlight','backlit','fog','foggy','mist','shadow','shadows','glow','glowing','flickering','spotlight','rim light','volumetric','silhouette','overcast','dusk','dawn','night','day','lighting'] },
  style:      { p: 50,  label: 'Style', kw: ['ps1','ps2','realistic','photorealistic','cartoon','anime','toon','painterly','cinematic','3d','3d render','render','pixel','pixel art','low poly','retro','vintage','noir','watercolor','oil painting','sketch','comic','manga','hyperrealistic','stylized','grunge','vfx','analog','found footage','style','aesthetic'] },
  camera:     { p: 40,  label: 'Camera', kw: ['close-up','closeup','wide shot','wide angle','first-person','first person','third-person','top-down','bird','fisheye','depth of field','bokeh','macro','panorama','dutch angle','low angle','high angle','tracking shot','pov','shot','lens','35mm','50mm','85mm'] },
  effects:    { p: 30,  label: 'Effects', kw: ['grain','film grain','blur','motion blur','particles','vignette','chromatic aberration','glitch','lens flare','dust','smoke','sparks','rain','snow','scanlines','noise','distortion','vfx','effect','effects','bloom'] },
  detail:     { p: 45,  label: 'Detail', kw: [] }
};

export const DOMAINS = {
  image: {
    subject:    { p: 100, label: 'Subject', kw: ['man','woman','person','people','character','figure','girl','boy','child','ghost','nurse','creature','monster','demon','spirit','animal','dog','cat','soldier','priest','father','daughter','robot','zombie','skeleton','witch','beast','entity','protagonist','villain','face','portrait'] },
    environment:{ p: 90,  label: 'Environment', kw: ['hospital','forest','room','factory','city','street','house','building','dungeon','cave','school','office','church','temple','abandoned','ruins','landscape','mountain','desert','ocean','sea','village','town','corridor','hallway','basement','attic','warehouse','laboratory','swamp','jungle','interior','exterior','background','setting','environment'] },
    action:     { p: 80,  label: 'Action', kw: ['running','walking','standing','sitting','screaming','crying','attacking','holding','fighting','jumping','falling','crawling','hiding','chasing','floating','flying','reaching','looking','staring','praying','dancing','reading','sleeping','dying','bleeding'] },
    emotion:    { p: 70,  label: 'Emotion', kw: ['scary','terrifying','eerie','creepy','dread','horror','horrific','ominous','unsettling','frightening','tense','melancholic','sad','happy','joyful','peaceful','calm','angry','lonely','hopeless','disturbing','nightmarish','sinister','mood','atmosphere','atmospheric'] },
    lighting:   { p: 60,  label: 'Lighting', kw: ['dark','darkness','bright','dim','neon','candlelight','moonlight','sunlight','backlit','fog','foggy','mist','shadow','shadows','glow','glowing','flickering','spotlight','rim light','volumetric','silhouette','overcast','dusk','dawn','night','day','lighting'] },
    style:      { p: 50,  label: 'Style', kw: ['ps1','ps2','realistic','photorealistic','cartoon','anime','toon','painterly','cinematic','3d','3d render','render','pixel','pixel art','low poly','retro','vintage','noir','watercolor','oil painting','sketch','comic','manga','hyperrealistic','stylized','grunge','vfx','analog','found footage','style','aesthetic'] },
    detail:     { p: 45,  label: 'Detail', kw: ['highly detailed','8k','photorealistic','intricate','cinematic'] },
    camera:     { p: 40,  label: 'Camera', kw: ['close-up','closeup','wide shot','wide angle','first-person','first person','third-person','top-down','bird','fisheye','depth of field','bokeh','macro','panorama','dutch angle','low angle','high angle','tracking shot','pov','shot','lens','35mm','50mm','85mm'] },
    effects:    { p: 30,  label: 'Effects', kw: ['grain','film grain','blur','motion blur','particles','vignette','chromatic aberration','glitch','lens flare','dust','smoke','sparks','rain','snow','scanlines','noise','distortion','vfx','effect','effects','bloom'] }
  },
  code: {
    lang_env:      { p: 100, label: 'Language & Env', kw: ['python', 'rust', 'javascript', 'typescript', 'react', 'node', 'v18', 'compile', 'runtime'] },
    functionality: { p: 95,  label: 'Core Functionality', kw: ['function', 'method', 'class', 'api fetch', 'endpoint', 'algorithm', 'sorting', 'route'] },
    io_structure:  { p: 85,  label: 'I/O & Data Structure', kw: ['json payload', 'schema', 'parameters', 'return type', 'string', 'database', 'array'] },
    constraints:   { p: 75,  label: 'Performance Rules', kw: ['fast', 'memory limit', 'time complexity', 'o(1)', 'no dependencies', 'lightweight'] },
    standards:     { p: 65,  label: 'Coding Standards', kw: ['clean code', 'modular', 'solid', 'dry', 'airbnb style', 'oop', 'functional programming'] },
    edge_cases:    { p: 55,  label: 'Edge Cases', kw: ['null pointer', 'undefined', 'exception', 'fallback', 'timeout', 'empty array'] },
    libraries:     { p: 45,  label: 'Third-Party Libs', kw: ['lodash', 'axios', 'tailwind', 'redis', 'express', 'mongoose', 'pandas', 'numpy'] },
    testing:       { p: 35,  label: 'Testing', kw: ['unit test', 'jest', 'pytest', 'test suite', 'mock', 'assertion', 'coverage'] },
    documentation: { p: 25,  label: 'Docs & Comments', kw: ['jsdoc', 'inline comments', 'docstrings', 'readme', 'markdown', 'swagger'] }
  },
  debug: {
    error_stack:   { p: 100, label: 'Error & Stacktrace', kw: ['typeerror', 'nullpointerexception', 'syntaxerror', 'crash', 'uncaught exception'] },
    failing_code:  { p: 95,  label: 'Failing Code', kw: ['block of code', 'function snippet', 'index.js', 'line 42', 'failing method'] },
    expected:      { p: 85,  label: 'Expected Behavior', kw: ['should return', 'expected behavior', 'goal', 'target output', 'expected to'] },
    actual:        { p: 80,  label: 'Actual Behavior', kw: ['actually returns', 'undefined behavior', 'incorrect output', 'freezing'] },
    env_state:     { p: 70,  label: 'Environment State', kw: ['os version', 'node version', 'chrome devtools', 'local storage', 'docker container'] },
    recent_changes:{ p: 60,  label: 'Recent Changes', kw: ['git diff', 'commit history', 'changed file', 'updated package', 'refactored'] },
    attempts:      { p: 50,  label: 'Attempted Fixes', kw: ['already tried', 'tried replacing', 'attempted solution', "doesn't work"] },
    logs:          { p: 40,  label: 'Diagnostics & Logs', kw: ['console.log', 'network payload', 'stack trace', 'db query', 'print', 'debug log'] },
    constraints:   { p: 30,  label: 'Resolution Constraints', kw: ['hotfix only', 'no refactoring', 'legacy-compatible', 'avoid breaking changes'] }
  },
  architecture: {
    goals_scale:   { p: 100, label: 'Goals & Scale', kw: ['10m dau', 'latency', 'throughput', 'scale', 'goals', 'highly available', 'business'] },
    patterns:      { p: 90,  label: 'Arch Pattern', kw: ['microservices', 'monolith', 'serverless', 'mvc', 'event-driven', 'pub-sub'] },
    data_storage:  { p: 80,  label: 'Data & Storage', kw: ['sql', 'postgresql', 'nosql', 'mongodb', 'redis cache', 'indexing', 'replica'] },
    platforms:     { p: 70,  label: 'Tech Stack', kw: ['aws', 'kubernetes', 'docker', 'node.js', 'go', 'python', 'cloud infrastructure'] },
    quality_attr:  { p: 60,  label: 'Quality Attributes', kw: ['scalability', 'reliability', 'portability', 'maintainability', 'extensibility'] },
    protocols:     { p: 50,  label: 'APIs & Protocols', kw: ['rest api', 'graphql', 'grpc', 'websockets', 'kafka message broker', 'http/2'] },
    security:      { p: 40,  label: 'Security Rules', kw: ['oauth2', 'jwt', 'gdpr compliance', 'encryption', 'ssl', 'firewall', 'iam'] },
    devops:        { p: 30,  label: 'CI/CD & DevOps', kw: ['pipeline', 'deployment', 'github actions', 'prometheus', 'grafana', 'monitoring'] },
    cost:          { p: 20,  label: 'Budget & Cost', kw: ['server cost', 'budget constraints', 'minimal resources', 'pricing', 'cloud expense'] }
  },
  gui: {
    layout:        { p: 100, label: 'Layout & Grid', kw: ['responsive', 'desktop', 'mobile', 'grid system', 'flexbox', 'sidebar', 'container'] },
    components:    { p: 90,  label: 'UI Components', kw: ['navbar', 'dashboard card', 'modal dialog', 'form', 'button', 'tooltip', 'table'] },
    theme:         { p: 80,  label: 'Theme & Palette', kw: ['dark mode', 'color palette', 'primary cyan', 'gradient', 'glassmorphism', 'hsl'] },
    typography:    { p: 70,  label: 'Typography', kw: ['font family', 'inter', 'typography scale', 'font weight', 'line height', 'header'] },
    interactions:  { p: 60,  label: 'Transitions & Hover', kw: ['hover animation', 'active state', 'micro-animation', 'spinner', 'fade in'] },
    framework:     { p: 50,  label: 'Frameworks', kw: ['tailwind css', 'pure vanilla css', 'react flow', 'material ui', 'bootstrap'] },
    a11y:          { p: 40,  label: 'Accessibility', kw: ['aria landmarks', 'alt text', 'screen reader', 'color contrast', 'keyboard-safe'] },
    spacing:       { p: 30,  label: 'Spacing & Gaps', kw: ['padding', 'margin', 'border radius', 'gap-4', 'auto alignment', 'layout flow'] },
    assets:        { p: 20,  label: 'Icons & Media', kw: ['svg icons', 'lucide', 'avatar image', 'placeholder image', 'logo vector'] }
  }
};

export const CONFLICTS = [
  ['realistic','cartoon'], ['photorealistic','cartoon'], ['realistic','anime'], ['photorealistic','anime'],
  ['realistic','toon'], ['hyperrealistic','pixel'], ['dark','bright'], ['day','night'], ['dawn','dusk'],
  ['colorful','monochrome'], ['detailed','minimalist'], ['cute','horror'], ['cute','terrifying'],
  ['peaceful','terrifying'], ['happy','horror'], ['calm','chaotic'], ['clean','grunge']
];

// Helper functions for parsing
function tokens(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean);
}

function hasTerm(text, term) {
  return (text || '').toLowerCase().includes(term.toLowerCase());
}

export function categorize(text, categories = CATEGORIES) {
  const t = (text || '').toLowerCase();
  const catKeys = Object.keys(categories);
  const fallbackCat = catKeys.includes('detail') ? 'detail' : (catKeys.includes('documentation') ? 'documentation' : catKeys[catKeys.length - 1] || 'detail');
  const fallbackP = categories[fallbackCat]?.p || 45;
  
  let best = { cat: fallbackCat, hits: 0, p: fallbackP };
  for (const [cat, info] of Object.entries(categories)) {
    if (cat === fallbackCat) continue;
    let hits = 0;
    for (const k of info.kw) {
      if (t.includes(k.toLowerCase())) hits++;
    }
    if (hits > best.hits || (hits === best.hits && hits > 0 && info.p > best.p)) {
      best = { cat, hits, p: info.p };
    }
  }
  return { category: best.cat, priority: categories[best.cat]?.p || fallbackP };
}

export function contextScore(text, contextText, categories = CATEGORIES) {
  const ct = tokens(contextText);
  const tt = tokens(text);
  const cset = new Set(ct);
  let overlap = 0;
  tt.forEach(w => {
    if (cset.has(w)) overlap++;
  });

  const tc = categorize(text, categories).category;
  let affinity = 0;
  for (const [cat, info] of Object.entries(categories)) {
    if (cat === tc) {
      for (const k of info.kw) {
        if (contextText.toLowerCase().includes(k.toLowerCase())) {
          affinity += 1;
          break;
        }
      }
    }
  }

  let penalty = 0;
  for (const [a, b] of CONFLICTS) {
    if ((hasTerm(text, a) && hasTerm(contextText, b)) || (hasTerm(text, b) && hasTerm(contextText, a))) {
      penalty += 3;
    }
  }

  return overlap * 2 + affinity + (categorize(text, categories).priority / 100) - penalty;
}

// Builds the topological execution order based on file and prompt-converter dependencies
export function buildExecutionOrder(nodes, edges) {
  const gates = nodes.filter(n => ['and', 'or', 'not', 'askQuestion', 'answerQuestions', 'promptConcat', 'promptToFile'].includes(n.type));
  
  // Recursive function to trace upstream gate ID from any node ID along file lines
  const traceUpstreamGate = (nodeId) => {
    const e = edges.find(x => x.target === nodeId && x.targetHandle === 'file');
    if (!e) return null;
    const src = nodes.find(n => n.id === e.source);
    if (!src) return null;
    if (['and', 'or', 'not', 'askQuestion', 'answerQuestions', 'promptConcat', 'promptToFile'].includes(src.type)) return src.id;
    if (['fileViewer', 'fileToPrompt'].includes(src.type)) {
      return traceUpstreamGate(src.id);
    }
    return null;
  };

  // For each gate, map all upstream gate dependencies it must wait for
  const dependencies = {};
  gates.forEach(g => {
    const deps = new Set();
    
    // Dependency 1: Direct file input path
    const fileGate = traceUpstreamGate(g.id);
    if (fileGate) deps.add(fileGate);
    
    // Dependency 2 & 3: Prompt inputs connected to converters, answerQuestions, or promptConcat
    const incomingPromptEdges = edges.filter(x => x.target === g.id && (['a', 'b'].includes(x.targetHandle) || x.targetHandle.startsWith('p')));
    incomingPromptEdges.forEach(e => {
      const src = nodes.find(n => n.id === e.source);
      if (src) {
        if (src.type === 'fileToPrompt') {
          const promptGate = traceUpstreamGate(src.id);
          if (promptGate) deps.add(promptGate);
        } else if (src.type === 'fileViewer') {
          const promptGate = traceUpstreamGate(src.id);
          if (promptGate) deps.add(promptGate);
        } else if (src.type === 'answerQuestions') {
          deps.add(src.id);
        } else if (src.type === 'promptConcat') {
          deps.add(src.id);
        }
      }
    });

    // Dependency 4: questions input on askQuestion or answerQuestions
    if (g.type === 'askQuestion' || g.type === 'answerQuestions') {
      const qEdge = edges.find(x => x.target === g.id && x.targetHandle === 'questions');
      if (qEdge) {
        const src = nodes.find(n => n.id === qEdge.source);
        if (src && src.type === 'askQuestion') {
          deps.add(src.id);
        }
      }
    }



    dependencies[g.id] = Array.from(deps);
  });

  const order = [];
  const visited = new Set();
  const temp = new Set();

  function visit(id) {
    if (visited.has(id) || !gates.find(g => g.id === id)) return;
    if (temp.has(id)) return; // Prevent loop on cycles
    
    temp.add(id);
    
    // Visit all transitive gate dependencies first
    const deps = dependencies[id] || [];
    deps.forEach(depId => {
      visit(depId);
    });
    
    temp.delete(id);
    visited.add(id);
    order.push(id);
  }

  gates.forEach(g => visit(g.id));
  return order;
}

// Traces the upstream file state recursively from a given target pin
export function getFileInput(nodes, edges, gateId, gateStates) {
  const edge = edges.find(e => e.target === gateId && e.targetHandle === 'file');
  if (!edge) return { positive: '', negative: '' };
  
  const sourceNode = nodes.find(sn => sn.id === edge.source);
  if (!sourceNode) return { positive: '', negative: '' };
  
  if (sourceNode.type === 'fileNode') {
    return { positive: '', negative: '' };
  }
  
  if (['and', 'or', 'not', 'askQuestion', 'answerQuestions', 'promptToFile', 'promptConcat', 'contextMemory'].includes(sourceNode.type)) {
    return gateStates[sourceNode.id] || { positive: '', negative: '' };
  }
  
  if (['fileViewer', 'fileToPrompt'].includes(sourceNode.type)) {
    return getFileInput(nodes, edges, sourceNode.id, gateStates);
  }
  
  return { positive: '', negative: '' };
}

// Aggregate and retrieve all enabled global memory content from the canvas
export function getMemoryInput(nodes, edges, gateId) {
  // Find all contextMemory nodes that are currently enabled (data.enabled !== false)
  const enabledMemoryNodes = (nodes || []).filter(
    n => n.type === 'contextMemory' && n.data?.enabled !== false
  );
  return enabledMemoryNodes.map(n => n.data?.extractedMemory || '').filter(Boolean).join('\n\n');
}

// Retrieve prompt text from input pin recursively resolving converters
function promptInput(nodes, edges, gateId, pinId, gateStates) {
  const e = edges.find(x => x.target === gateId && x.targetHandle === pinId);
  if (!e) return null;
  const src = nodes.find(n => n.id === e.source);
  if (!src) return null;
  
  if (src.type === 'promptBox') {
    return (src.data.text || '').trim() || null;
  }
  
  if (src.type === 'fileToPrompt') {
    // Trace back file connection from the converter recursively
    const traceUpstreamText = (converterId) => {
      const edge = edges.find(x => x.target === converterId && x.targetHandle === 'file');
      if (!edge) return '';
      
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (!sourceNode) return '';
      
      if (['and', 'or', 'not', 'answerQuestions', 'promptConcat'].includes(sourceNode.type)) {
        return gateStates[sourceNode.id]?.positive || '';
      }
      
      if (['fileViewer', 'fileToPrompt'].includes(sourceNode.type)) {
        return traceUpstreamText(sourceNode.id);
      }
      
      return '';
    };
    
    return traceUpstreamText(src.id).trim() || null;
  }

  if (src.type === 'answerQuestions') {
    if (e.sourceHandle === 'out') {
      return (gateStates[src.id]?.prompt_val || '').trim() || null;
    }
    return (gateStates[src.id]?.positive || '').trim() || null;
  }

  if (src.type === 'promptConcat') {
    return (gateStates[src.id]?.positive || '').trim() || null;
  }
  
  return null;
}

// Unified API call core using local CORS proxies
export async function callAI(system, user, settings) {
  const { provider, keys, models } = settings;
  const key = keys[provider];
  const model = models[provider];
  if (!key) throw new Error(`Missing API Key for ${provider}. Please configure settings.`);

  if (provider === 'anthropic') {
    const res = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: user }]
      })
    });
    if (!res.ok) throw new Error(await errText(res));
    const d = await res.json();
    return (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
  }

  if (provider === 'openai') {
    const res = await fetch('/api/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 0.2
      })
    });
    if (!res.ok) throw new Error(await errText(res));
    const d = await res.json();
    return d.choices?.[0]?.message?.content || '';
  }

  if (provider === 'google') {
    const url = `/api/google/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0.2 }
      })
    });
    if (!res.ok) throw new Error(await errText(res));
    const d = await res.json();
    return (d.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('') || '';
  }

  if (provider === 'openrouter') {
    const res = await fetch('/api/openrouter/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + key,
        'X-Title': 'PLG IDE'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 0.2
      })
    });
    if (!res.ok) throw new Error(await errText(res));
    const d = await res.json();
    return d.choices?.[0]?.message?.content || '';
  }

  throw new Error('Unknown AI API Provider');
}

async function errText(res) {
  let t = '';
  try {
    const j = await res.json();
    t = j.error?.message || j.message || JSON.stringify(j);
  } catch (e) {
    t = await res.text().catch(() => '');
  }
  return `${res.status} ${t}`.slice(0, 160);
}

function extractJson(s) {
  if (!s) return null;
  s = s.replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b < 0) return null;
  try {
    return JSON.parse(s.slice(a, b + 1));
  } catch (e) {
    return null;
  }
}

// ------------------------------------------------------------
// NODE-BY-NODE ACTIVE AI GATES ACTIONS
// ------------------------------------------------------------

// 1. AI Conjunction (AND) Gate execution
async function aiGateAnd(baselinePos, A, B, settings, memoryContent) {
  let system = `You are the AI compiler for an "AND Gate" inside a visual prompt-building IDE. Your job is to take the current prompt baseline and merge it with two new prompt fragments (A and B). You must merge them into a single, cohesive Compiled Prompt using strict, directive, and commanding language (e.g., 'Depict...', 'Render...', 'Enforce...'). Speak directly to the downstream AI model, giving direct visual instructions on what to compile. (1) rank foundational elements (subjects, environments) first, style/modifiers later; (2) remove duplicates; (3) maintain proper flow. Do not use any phrases like "according to memory", "based on fragment A", "merged prompt", or any meta-labels. Output a single seamless set of commanding directions. Respond with ONLY the optimized Compiled Prompt text, no markdown, no quotes, no extra commentary.`;
  
  if (memoryContent) {
    system += `\n\nCRITICAL CONSTRAINT: You MUST preserve and exactly employ the casing, spelling, variables, and function names present in the following Context Memory. Frame them as direct visual directives:\n${memoryContent}`;
  }

  const user = `Baseline Prompt So Far:\n"${baselinePos || '(empty)'}"\n\nNew Fragment A: "${A || '(none)'}"\nNew Fragment B: "${B || '(none)'}"\n\nReturn the merged prompt:`;
  const raw = await callAI(system, user, settings);
  return (raw || '').trim();
}

// 2. AI Context Selector (OR) Gate execution
async function aiGateOr(baselinePos, A, B, settings, memoryContent) {
  let system = `You are the AI compiler for an "OR Gate" inside a visual prompt-building IDE. Your job is to read the current prompt context and evaluate two competing candidate prompt fragments (A and B). You must select the SINGLE best candidate that is most semantically compatible with the current context, explain your choice in one sentence, and output the updated Compiled Prompt. Ensure the "updated_prompt" is phrased strictly as a direct command/direction to the generator (e.g., 'Depict...', 'Enforce...'), with absolutely no meta-text, no mention of A or B, and no references to "selected choice" or "according to context". Respond with STRICT JSON in this format: {"selected": "A" or "B", "reason": "Your brief explanation", "updated_prompt": "The consolidated prompt including the chosen candidate phrased as a direct command"}`;
  
  if (memoryContent) {
    system += `\n\nCRITICAL CONSTRAINT: Select the candidate strictly aligned with the following Context Memory and ensure the updated_prompt employs exact variable casings:\n${memoryContent}`;
  }

  const user = `Baseline Context So Far:\n"${baselinePos || '(empty)'}"\n\nCandidate Prompt A: "${A || '(none)'}"\nCandidate Prompt B: "${B || '(none)'}"\n\nReturn JSON:`;
  const raw = await callAI(system, user, settings);
  const json = extractJson(raw);
  if (!json || !json.selected) throw new Error('Bad OR Gate AI JSON structure');
  return json;
}

// 3. AI Negation Routing (NOT) Gate execution
async function aiGateNot(baselinePos, A, settings, memoryContent) {
  let system = `You are the AI compiler for a "NOT Gate" inside a visual prompt-building IDE. Your job is to read the current prompt baseline and a concept to suppress (A). You must: (1) strip any positive trace or reference of A from the prompt if it exists, (2) append a strict commanding instruction explicitly stating not to do, use, or include A (e.g. "avoid A", "do not include A", "never employ A"). Ensure the updated_positive prompt does not mention "sanitized", "NOT gate", "concept A", or document references in its text. It must be phrased strictly as direct visual commands. Respond with STRICT JSON in this format: {"updated_positive": "The sanitized prompt with explicit commanding negation instructions built-in"}`;
  
  if (memoryContent) {
    system += `\n\nCRITICAL CONSTRAINT: Ensure no exact variables from the Context Memory are altered unless explicitly negated, and preserve variable casing exactly:\n${memoryContent}`;
  }

  const user = `Baseline Prompt:\n"${baselinePos || '(empty)'}"\n\nConcept to Suppress (NOT A): "${A || '(none)'}"\n\nReturn JSON:`;
  const raw = await callAI(system, user, settings);
  const json = extractJson(raw);
  if (!json || !json.updated_positive) throw new Error('Bad NOT Gate AI JSON structure');
  return json;
}

const MOCK_QUESTIONS = [
  "What is the desired primary subject focus or perspective of the generation?",
  "Are there specific color palettes, mood variables, or lighting constraints to prioritize?",
  "What stylistic medium or resolution characteristics should be enforced?"
];

const ALT_MOCK_QUESTIONS = [
  "What time of day or atmospheric weather effects should be present in the scene?",
  "Are there any secondary background elements, props, or characters to place?",
  "Should the visual style emulate a specific director, artist, or historical era?"
];

// AI Clarification Questions generator
async function aiAskQuestions(baselinePos, excludedQs, count, settings, memoryContent) {
  let system = `You are an expert AI prompt engineer. Your job is to analyze the positive prompt compiled so far, identify any gaps, ambiguities, or unclear stylistic directions, and generate a list of exactly ${count} crucial clarifying questions that the user should answer to make the prompt perfect.
If the prompt is empty or very short, ask foundational questions about what the user wants to create.
You must respond with STRICT JSON containing a list of strings: {"questions": ["Clarifying question 1", ..., "Clarifying question ${count}"]}. No commentary, no markdown.`;

  if (memoryContent) {
    system += `\n\nReview the following Context Memory to understand what technical terms, variables, and rules are already defined before formulating questions. Do not ask questions about details already specified in the memory:\n${memoryContent}`;
  }

  if (excludedQs && excludedQs.length > 0) {
    system += `\n\nCRITICAL CONSTRAINT: You MUST NOT ask any questions that are semantically identical or highly similar to the following questions which have ALREADY been asked:\n${excludedQs.map((q, i) => `- ${q}`).join('\n')}\nGenerate ${count} entirely NEW and different questions.`;
  }

  const user = `Positive Prompt So Far:\n"${baselinePos || 'empty baseline'}"\n\nReturn JSON:`;
  const raw = await callAI(system, user, settings);
  const json = extractJson(raw);
  if (!json || !Array.isArray(json.questions)) throw new Error('Bad questions list JSON structure');
  return json.questions;
}

// AI Refinement of prompt based on questions and answers
async function aiRefineAnswers(baselinePos, questions, answers, settings, memoryContent) {
  let system = `You are an expert AI prompt engineer. Your job is to take a baseline prompt, a list of clarifying questions, and the user's typed answers, and synthesize them into a single, cohesive, highly optimized Compiled Prompt using a commanding and directive style (e.g. 'Depict...', 'Enforce...'). Speak directly to the downstream generator model, giving strict instructions.
You must:
1. Merge the answers naturally and seamlessly as direct visual commands.
2. Maintain proper structure (foundational directives first, modifier commands later).
3. Do NOT include the questions, literal "Clarification on Q..." strings, or any labels like "Answer to question 1". The output must be pure direct visual instructions for the AI generator model, with absolutely no references to the clarifying session.
4. Keep the output extremely clean. Respond with ONLY the optimized, merged positive prompt text. No markdown, no quotes, no extra commentary.`;

  if (memoryContent) {
    system += `\n\nCRITICAL CONSTRAINT: Align the refined prompt exactly with the terms, variables, and syntax specified in the Context Memory. Frame them as imperative commands:\n${memoryContent}`;
  }

  const qas = [];
  questions.forEach((q, idx) => {
    const ans = answers[idx] || '';
    if (ans.trim()) {
      qas.push(`Question: "${q}"\nAnswer: "${ans}"`);
    }
  });

  const user = `Baseline Positive Prompt:\n"${baselinePos || '(empty)'}"\n\nUser Answers to Clarifications:\n${qas.join('\n\n')}\n\nReturn the refined, integrated positive prompt:`;
  const raw = await callAI(system, user, settings);
  return (raw || '').trim();
}

// AI Context Memory alignment compiler
async function aiAlignPromptWithMemory(incomingPrompt, memoryContent, settings) {
  const system = `You are a principal prompt alignment compiler inside a visual prompt-building IDE.
Your task is to take an incoming prompt baseline, and rewrite it to strictly align with the provided Context Memory using a highly commanding and directive style (e.g. 'Depict...', 'Enforce...', 'Apply...'). Speak directly to the downstream AI generator model, giving strict instructions. Do not write a passive description, and never write 'according to the memory document', 'as per context memory', or 'memory constraints'. Convert the specifications, variables, and rules into direct, imperative commands. NEVER mention "Context Memory", "the document", "memory specifications", or "the rules say". Translate all definitions and memory rules directly into active, commanding prompt instructions. For example, if a variable 'theme' is defined as 'dark forest', write: 'Enforce a dark forest theme.' rather than 'According to context memory, theme is dark forest.'

If the incoming prompt contains any reference, abbreviation, or keyword that matches an entry, variable, function name, or file section in the Context Memory (even a loose or case-insensitive match):
1. You MUST fully expand and design the prompt in rich detail according to the complete specifications, guidelines, syntax, and rules of that memory catalog entry, framing them as direct commands.
2. If the user refers to a concept at a high level (e.g. "mempalace recovery" or "agents logic"), pull in the actual structure, variables (like "dimensionality"), function signatures, and constraints from the corresponding wing/room/hall of the Context Memory and phrase them as imperative directives.
3. Strictly employ the exact case-sensitive variables, function names, and file rules from the memory ledger. Do not translate or modify them.
4. Ensure all baseline concepts are preserved, but completely designed and contextualized as direct instructions.

Respond with ONLY the optimized, fully-designed Compiled Prompt text, with no markdown, no quotes, and no conversational preambles.`;

  const user = `Incoming Prompt Baseline:\n"${incomingPrompt || '(empty)'}"\n\nContext Memory:\n${memoryContent}\n\nReturn the aligned prompt:`;
  const raw = await callAI(system, user, settings);
  return (raw || '').trim();
}

export const OFFLINE_QUESTIONS = {
  image: [
    "What is the desired primary subject focus or perspective of the generation?",
    "Are there specific color palettes, mood variables, or lighting constraints to prioritize?",
    "What stylistic medium or resolution characteristics should be enforced?",
    "What time of day or atmospheric weather effects should be present in the scene?",
    "Are there any secondary background elements, props, or characters to place?",
    "Should the visual style emulate a specific director, artist, or historical era?",
    "What specific camera framing, lens focal length, or viewing angle should be used?",
    "What kind of visual effects, grain, vignette, or post-processing is preferred?",
    "Is there a specific level of detail, roughness, or cleanliness expected?",
    "Are there negative elements or objects that must be completely absent?"
  ],
  code: [
    "What is the primary programming language, framework, or runtime environment (e.g., Python 3.10, React 18 with TypeScript)?",
    "What is the core business logic, algorithm, or function that this code must perform?",
    "What are the expected input parameters and their exact data structures or schemas?",
    "What is the expected return type, output format, or response structure?",
    "Are there specific performance constraints, time/space complexities (e.g., O(N log N)), or execution memory limits?",
    "Should the code follow a specific design pattern, standard, or paradigm (e.g., Functional, OOP, SOLID)?",
    "What third-party libraries, modules, or dependencies are allowed or preferred for this implementation?",
    "How should exceptions, boundary limits, and unexpected input edge cases be handled?",
    "Are there specific unit testing requirements (e.g., Jest, PyTest) or mocking expectations?",
    "What level of documentation, JSDoc schemas, or inline comments are expected in the final code?"
  ],
  debug: [
    "What is the exact error message, warning label, or uncaught exception stack trace?",
    "Can you provide the specific code snippet, function, or file name where the error occurs?",
    "What was the expected correct behavior or output that should have occurred?",
    "What is the actual incorrect behavior, output, or crash pattern happening instead?",
    "What are the operating system, language runtime, or package dependency versions in this environment?",
    "What recent changes, refactorings, or updates were made to the codebase before the bug appeared?",
    "What troubleshooting steps, logging attempts, or fixes have you already tried?",
    "Can you supply console logs, network response payloads, or database query dumps from the time of the crash?",
    "What system state, database records, or input data trigger this specific bug?",
    "Are there strict resolution constraints, such as keeping the fix backward-compatible or avoiding core refactorings?"
  ],
  architecture: [
    "What are the primary business goals, target scale (e.g., 10M DAU), and throughput/latency requirements?",
    "Which architectural style or system pattern is preferred (e.g., Microservices, Monolithic, Event-Driven)?",
    "What database engine, storage format, caching layer, or indexing strategy should be adopted?",
    "What is the preferred tech stack, hosting provider (AWS, GCP), and container orchestrator (Kubernetes)?",
    "What are the most critical non-functional requirements (e.g., scalability, high availability, maintainability)?",
    "Which communication protocols and message brokers should connect the services (e.g., gRPC, REST, Kafka)?",
    "What are the user authentication, data privacy, and security compliance constraints (e.g., OAuth2, GDPR)?",
    "What kind of continuous integration, deployment pipeline, and monitoring systems are required (e.g., Prometheus, Grafana)?",
    "Are there strict hosting budgets, infrastructure costs, or physical resource limits to respect?",
    "What are the integration touchpoints with legacy systems or external third-party API services?"
  ],
  gui: [
    "What is the target platform (Web, Mobile, Desktop) and target screen size (Responsive, Mobile-first)?",
    "What core visual components (e.g., sidebar navigation, dashboard widgets, modal drawers) must be present?",
    "What is the preferred color palette, theme orientation (dark mode, light mode), or HSL brand tokens?",
    "What font families, typography weights, and text scaling rules should be applied?",
    "What micro-animations, hover transition effects, or visual loading feedback states are required?",
    "Which CSS framework, component library, or custom styling rules should be used (e.g., Tailwind CSS, Vanilla CSS)?",
    "What are the specific accessibility guidelines (a11y), screen-reader properties, or keyboard navigations to implement?",
    "What margin, padding, border radius, and flexbox/grid layout spaces should govern the components?",
    "What graphical assets, SVG vectors, icon styles (e.g., Lucide), or logotypes must be integrated?",
    "Are there specific responsive breakpoints or container width limitations to enforce?"
  ]
};

function offlineMockQuestions(excludedQs, count, domain = 'image') {
  const bank = OFFLINE_QUESTIONS[domain] || OFFLINE_QUESTIONS.image;
  const excludedSet = new Set((excludedQs || []).map(s => s.toLowerCase().trim()));
  const filtered = bank.filter(q => !excludedSet.has(q.toLowerCase().trim()));
  return filtered.slice(0, count);
}

export async function classifyDomain(text, settings) {
  if (settings.mode === 'ai') {
    try {
      const system = `You are the dynamic Priority Manager for a multi-domain prompt-building IDE. 
Your job is to analyze the raw, connected prompt fragments and classify the overall target task into exactly ONE of these five categories:
- "image" (digital art, visuals, rendering directives)
- "code" (writing code, software functions, algorithmic logic)
- "debug" (solving bugs, analyzing errors, fixing stack traces)
- "architecture" (designing systems, DB schemas, hosting patterns)
- "gui" (web UI layouts, CSS themes, front-end grid alignments)

You must respond with STRICT JSON containing only your selection and a brief logic description:
{"domain": "image" | "code" | "debug" | "architecture" | "gui", "reason": "Your brief classification logic"}`;

      const user = `Analyze these prompt fragments:
"${text}"

Return JSON:`;
      const raw = await callAI(system, user, settings);
      const json = extractJson(raw);
      if (json && ['image', 'code', 'debug', 'architecture', 'gui'].includes(json.domain)) {
        return json.domain;
      }
    } catch (err) {
      console.error("AI Domain classification failed, falling back to lexical classifier: ", err);
    }
  }

  // Lexical / Rule-Based Classification (Pathway 1)
  const t = (text || '').toLowerCase();
  const scores = {
    code: 0,
    debug: 0,
    architecture: 0,
    gui: 0,
    image: 0
  };

  const kw = {
    code: ['function', 'import', 'class', 'def ', 'fn ', 'let ', 'const', 'typescript', 'rust', 'compile', 'runtime', 'javascript', 'react', 'node', 'v18', 'algorithm', 'sorting', 'route', 'json payload', 'return type', 'time complexity', 'o(1)', 'clean code', 'solid', 'dry', 'functional programming', 'unit test', 'jest', 'pytest', 'jsdoc', 'docstring'],
    debug: ['typeerror', 'nullpointerexception', 'syntaxerror', 'crash', 'uncaught exception', 'stacktrace', 'bug', 'at line', 'console.log', 'expected behavior', 'failing code', 'failing method', 'actually returns', 'chrome devtools', 'local storage', 'docker container', 'git diff', 'commit history', 'tried replacing', 'attempted solution', 'debug log'],
    architecture: ['architecture', 'microservices', 'scalability', 'high availability', 'throughput', 'kubernetes', 'monolith', 'serverless', 'mvc', 'event-driven', 'postgresql', 'nosql', 'mongodb', 'redis cache', 'replica', 'docker', 'cloud infrastructure', 'rest api', 'graphql', 'grpc', 'kafka', 'oauth2', 'jwt', 'gdpr compliance', 'prometheus', 'grafana'],
    gui: ['navbar', 'sidebar', 'tailwind', 'flexbox', 'grid', 'css', 'hover', 'padding', 'margin', 'typography', 'dashboard card', 'modal dialog', 'glassmorphism', 'font family', 'inter', 'micro-animation', 'spinner', 'aria landmarks', 'alt text', 'border radius', 'svg icons', 'lucide'],
    image: ['photorealistic', 'lighting', 'volumetric', 'camera', 'oil painting', 'render', 'man', 'woman', 'portrait', 'creature', 'zombie', 'dragon', 'robot', 'forest', 'hospital', 'city', 'ruins', 'screaming', 'floating', 'eerie', 'unsettling', 'candles', 'moonlight', 'ps1', 'retro', 'wide-shot', 'fisheye', 'film grain', 'chromatic aberration']
  };

  for (const [domain, list] of Object.entries(kw)) {
    list.forEach(word => {
      if (t.includes(word)) {
        scores[domain] += 1;
      }
    });
  }

  let bestDomain = 'image'; // Default fallback
  let maxScore = -1;
  for (const [domain, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  }

  return maxScore > 0 ? bestDomain : 'image';
}

// ------------------------------------------------------------
// MAIN DYNAMIC NODE-BY-NODE COMPILER ENGINE
// ------------------------------------------------------------

export async function compileGraph(nodes, edges, settings) {
  const { priorityDomain = 'auto' } = settings;
  const canvasTexts = nodes.map(n => (n.data?.text || '') + ' ' + (n.data?.extractedMemory || '')).filter(Boolean).join('\n');
  const activeDomain = priorityDomain === 'auto' 
    ? await classifyDomain(canvasTexts, settings)
    : priorityDomain;
    
  const activeCategories = DOMAINS[activeDomain] || DOMAINS.image;

  const stages = [];
  const items = [];
  const neg = [];
  const gateStates = {}; // Track intermediate prompt states after each gate executes
  
  // Current active prompt state as compilation flows node-by-node
  let activePositive = '';
  let activeNegative = '';

  const fileNode = nodes.find(n => n.type === 'fileNode');
  const gates = nodes.filter(n => ['and', 'or', 'not', 'askQuestion', 'answerQuestions'].includes(n.type));

  if (!fileNode) {
    throw new Error('Missing File Node: Please add a File Node as the single source of truth.');
  }
  if (!gates.length) {
    throw new Error('No logic nodes added: Please add at least one logic node (AND, OR, NOT, Ask Questions, or Provide Answers) to execute prompt logic.');
  }

  // 1. Stage 0: Initial Memory Read from source
  stages.push({
    name: `File Node (${fileNode.data.filename || 'prompt.txt'})`,
    status: 'ok',
    type: 'info',
    desc: `Source of truth initialized.\nBaseline Positive: "${activePositive || '(empty)'}"\nBaseline Negative: "${activeNegative || '(empty)'}"`
  });

  // Stage 0.5: Priority Schema classification
  stages.push({
    name: `Compiler Priority Schema`,
    status: 'ok',
    type: priorityDomain === 'auto' ? 'ai' : 'info',
    desc: `Active Domain: ${activeDomain.toUpperCase()} ${priorityDomain === 'auto' ? '(Auto-Detected)' : '(Manually Selected)'}\nSorting priority weights mapped successfully using ${Object.keys(activeCategories).length} dimensions.`
  });

  // Get topological execution path
  const order = buildExecutionOrder(nodes, edges);

  // 2. Walk gates in order of graph dependencies (node-by-node)
  for (const [idx, gid] of order.entries()) {
    const g = nodes.find(n => n.id === gid);
    const A = promptInput(nodes, edges, gid, 'a', gateStates);
    const B = promptInput(nodes, edges, gid, 'b', gateStates);

    const gateTitle = g.type.toUpperCase();
    const nodeLabel = `Node ${idx + 2}: ${gateTitle} Gate (${g.id.slice(-6)})`;

    let traceDesc = '';
    let statusType = 'ok';
    let statusLabel = 'ok';

    // Retrieve localized baseline from connected file input pin
    const fileInput = getFileInput(nodes, edges, gid, gateStates);
    activePositive = fileInput.positive;
    activeNegative = fileInput.negative;

    // Retrieve localized/global context memory to inject into active logic prompts
    const memoryInput = getMemoryInput(nodes, edges, gid);

    // Special fallback for AnswerQuestions if file input is not connected but questions pin is
    if (g.type === 'answerQuestions' && !edges.some(e => e.target === gid && e.targetHandle === 'file')) {
      const qEdge = edges.find(e => e.target === gid && e.targetHandle === 'questions');
      if (qEdge) {
        const sourceGateState = gateStates[qEdge.source];
        if (sourceGateState) {
          activePositive = sourceGateState.positive || '';
          activeNegative = sourceGateState.negative || '';
        }
      }
    }

    try {
      // ----------------- AND GATE LOGIC -----------------
      if (g.type === 'and') {
        const cands = [A, B].filter(Boolean);
        cands.forEach(txt => {
          items.push({ text: txt, ...categorize(txt, activeCategories), by: `AND (${g.id.slice(-4)})` });
        });

        if (settings.mode === 'ai') {
          // Trigger AND Gate AI
          const merged = await aiGateAnd(activePositive, A, B, settings, memoryInput);
          activePositive = merged;
          traceDesc = `[AI Active Conjunction]\nBaseline: "${activePositive}"\nMerged input A: "${A || 'none'}" + B: "${B || 'none'}"\nResulting Positive Prompt:\n"${activePositive}"`;
          statusType = 'ai';
          statusLabel = 'ai';
        } else {
          // Offline Rule-based AND logic
          const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
          cands.forEach(c => {
            if (c && !activeArr.includes(c)) activeArr.push(c);
          });
          // Sort active arrays based on categories weight
          const analyzed = activeArr.map(t => ({ text: t, ...categorize(t, activeCategories) }));
          analyzed.sort((x, y) => y.priority - x.priority);
          
          activePositive = analyzed.map(x => x.text).join(', ');
          traceDesc = `[Rule-based Conjunction]\nMerged input A: "${A || 'none'}" + B: "${B || 'none'}" in priority order.\nResulting Positive Prompt:\n"${activePositive}"`;
        }
      } 
      // ----------------- OR GATE LOGIC -----------------
      else if (g.type === 'or') {
        const cands = [A, B].filter(Boolean);
        
        if (cands.length) {
          if (settings.mode === 'ai') {
            // Trigger OR Gate AI Context selection
            const json = await aiGateOr(activePositive, A, B, settings, memoryInput);
            activePositive = json.updated_prompt;
            items.push({ 
              text: json.selected === 'A' ? A : B, 
              ...categorize(json.selected === 'A' ? A : B, activeCategories), 
              by: `OR (${g.id.slice(-4)})` 
            });
            
            traceDesc = `[AI Context Selection]\nSelected Candidate: ${json.selected} ("${json.selected === 'A' ? A : B}")\nReasoning: "${json.reason}"\nResulting Positive Prompt:\n"${activePositive}"`;
            statusType = 'ai';
            statusLabel = 'ai';
          } else {
            // Offline Context Overlap Score
            let best = cands[0], bs = -1e9;
            cands.forEach(t => {
              const s = contextScore(t, activePositive, activeCategories);
              if (s > bs) {
                bs = s;
                best = t;
              }
            });

            items.push({ text: best, ...categorize(best, activeCategories), by: `OR (${g.id.slice(-4)})` });
            const dropped = cands.filter(t => t !== best);
            
            const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
            if (!activeArr.includes(best)) activeArr.push(best);
            
            activePositive = activeArr.join(', ');
            traceDesc = `[Rule-based Selection]\nEvaluated context overlap score (A vs B).\nSelected best fit: "${best}"\nDropped candidate: ${dropped.length ? dropped.map(x => `"${x}"`).join(', ') : 'none'}\nResulting Positive Prompt:\n"${activePositive}"`;
          }
        } else {
          traceDesc = `[OR Gate skipped: No input prompts attached]`;
        }
      } 
      // ----------------- NOT GATE LOGIC -----------------
      else if (g.type === 'not') {
        if (A) {
          if (settings.mode === 'ai') {
            // Trigger NOT Gate AI Negation routing
            const json = await aiGateNot(activePositive, A, settings, memoryInput);
            activePositive = json.updated_positive;
            
            // Mark matching upstream items as dropped for traceability
            const idxToDrop = items.findIndex(item => hasTerm(item.text, A));
            if (idxToDrop >= 0) {
              items[idxToDrop]._drop = `Suppressed by NOT Gate (AI)`;
            }
            
            // We can also extract the newly added negation phrase and push to items for visualization
            const negatedTerm = `avoid ${A}`;
            items.push({ text: negatedTerm, ...categorize(negatedTerm, activeCategories), by: `NOT AI (${g.id.slice(-4)})` });

            traceDesc = `[AI Negation routing]\nSuppressed concept: "${A}"\nCompiled Prompt Sanitized & Updated:\n"${activePositive}"`;
            statusType = 'ai';
            statusLabel = 'ai';
          } else {
            // Offline negative suppression
            // Strip term if literally present in positive string
            const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
            const sanitized = activeArr.filter(t => !hasTerm(t, A));
            const negatedTerm = `avoid ${A}`;
            if (!sanitized.includes(negatedTerm)) {
              sanitized.push(negatedTerm);
            }
            activePositive = sanitized.join(', ');
            
            // Mark matching upstream items as dropped for traceability
            const idxToDrop = items.findIndex(item => hasTerm(item.text, A));
            if (idxToDrop >= 0) {
              items[idxToDrop]._drop = `Suppressed by NOT Gate`;
            }
            
            items.push({ text: negatedTerm, ...categorize(negatedTerm, activeCategories), by: `NOT (${g.id.slice(-4)})` });
            traceDesc = `[Rule-based Negation]\nSuppressed concept: "${A}". Stripped positive references and appended "${negatedTerm}".\nResulting Prompt:\n"${activePositive}"`;
          }
        } else {
          traceDesc = `[NOT Gate skipped: No suppression prompt attached]`;
        }
      }
      // ----------------- ASK QUESTION LOGIC -----------------
      else if (g.type === 'askQuestion') {
        let qs = [];
        const existingQs = g.data?.questions || [];
        const numRequested = g.data?.numQuestions !== undefined ? g.data.numQuestions : 3;
        
        // Find connected upstream askQuestion node to get excluded questions
        const exEdge = edges.find((x) => x.target === gid && x.targetHandle === 'questions');
        const excludedQs = exEdge ? (gateStates[exEdge.source]?.questions || []) : [];
        
        if (existingQs.length === numRequested) {
          qs = existingQs;
          traceDesc = `[Ask AI Questions Node - Reused Existing]\nReused all ${qs.length} clarifying questions to maintain consistency.`;
          statusType = 'info';
          statusLabel = 'ok';
        } else if (existingQs.length > numRequested) {
          qs = existingQs.slice(0, numRequested);
          traceDesc = `[Ask AI Questions Node - Sliced Existing]\nQuestions count decreased from ${existingQs.length} to ${numRequested}. Kept first ${numRequested} questions.`;
          statusType = 'info';
          statusLabel = 'ok';
        } else {
          // existingQs.length < numRequested: generate only the difference
          const diff = numRequested - existingQs.length;
          let newQs = [];
          
          if (settings.mode === 'ai') {
            newQs = await aiAskQuestions(activePositive, [...existingQs, ...excludedQs], diff, settings, memoryInput);
          } else {
            newQs = offlineMockQuestions([...existingQs, ...excludedQs], diff, activeDomain);
          }
          
          qs = [...existingQs, ...newQs];
          traceDesc = `[Ask AI Questions Node - Appended New]\nAdded ${diff} new clarifying questions, preserving previous ${existingQs.length} questions.\nTotal list size: ${qs.length} questions.`;
          statusType = 'ai';
          statusLabel = 'ai';
        }
        
        gateStates[gid] = { ...(gateStates[gid] || {}), questions: qs };
      }

      // ----------------- ANSWER QUESTIONS LOGIC -----------------
      else if (g.type === 'answerQuestions') {
        const qEdge = edges.find((x) => x.target === gid && x.targetHandle === 'questions');
        let qs = [];
        if (qEdge) {
          qs = gateStates[qEdge.source]?.questions || [];
        }
        
        const answers = g.data?.answers || {};
        let answerPrompt = '';
        let combinedVal = '';
        
        if (settings.mode === 'ai') {
          // In AI mode, use AI to refine the baseline prompt using the Q&A context
          const activeArr = [];
          qs.forEach((q, idx) => {
            if (answers[idx] && answers[idx].trim()) activeArr.push({ q, a: answers[idx].trim() });
          });
          
          if (activeArr.length > 0) {
            combinedVal = await aiRefineAnswers(activePositive, qs, answers, settings, memoryInput);
            answerPrompt = combinedVal;
          } else {
            combinedVal = activePositive;
            answerPrompt = '';
          }
        } else {
          // In offline rule-based mode, join typed answers directly with commas to save tokens
          const ansArr = [];
          qs.forEach((q, idx) => {
            const ans = answers[idx] || '';
            if (ans.trim()) {
              ansArr.push(ans.trim());
            }
          });
          answerPrompt = ansArr.join(', ');
          combinedVal = activePositive 
            ? (answerPrompt.trim() ? activePositive + ', ' + answerPrompt : activePositive)
            : answerPrompt;
        }
        
        // Check which output pins are connected downstream
        const fileOutEdge = edges.find((x) => x.source === gid && x.sourceHandle === 'file');
        const promptOutEdge = edges.find((x) => x.source === gid && x.sourceHandle === 'out');
        
        if (fileOutEdge || !promptOutEdge) {
          // If file out pin is connected, or if nothing is connected (Baseline mode), update activePositive
          activePositive = combinedVal;
        }
        
        gateStates[gid] = { 
          ...(gateStates[gid] || {}), 
          positive: combinedVal, 
          negative: activeNegative,
          prompt_val: answerPrompt 
        };
        
        if (fileOutEdge) {
          traceDesc = settings.mode === 'ai'
            ? `[Answer Questions Node - AI Mode]\nAI refined the baseline using the Q&A context:\n"${combinedVal}"`
            : `[Answer Questions Node - Rule Mode]\nAnswers joined with commas and appended to baseline:\n"${combinedVal}"`;
          statusType = settings.mode === 'ai' ? 'ai' : 'info';
          statusLabel = 'ok';
        } else if (promptOutEdge) {
          traceDesc = settings.mode === 'ai'
            ? `[Answer Questions Node - AI Mode]\nRefined prompt fragment:\n"${answerPrompt || '(no answers)'}"`
            : `[Answer Questions Node - Rule Mode]\nAnswers output downstream as a prompt fragment:\n"${answerPrompt || '(no answers)'}"`;
          statusType = 'info';
          statusLabel = 'ok';
        } else {
          traceDesc = settings.mode === 'ai'
            ? `[Answer Questions Node - AI Mode]\nAI refined the baseline prompt directly:\n"${combinedVal}"`
            : `[Answer Questions Node - Rule Mode]\nAnswers appended to baseline prompt:\n"${combinedVal}"`;
          statusType = settings.mode === 'ai' ? 'ai' : 'info';
          statusLabel = 'ok';
        }
      }
      // ----------------- CONTEXT MEMORY ALIGNMENT GATE -----------------
      else if (g.type === 'contextMemory') {
        const memoryContent = g.data?.extractedMemory || '';
        
        if (activePositive && memoryContent) {
          if (settings.mode === 'ai') {
            const aligned = await aiAlignPromptWithMemory(activePositive, memoryContent, settings);
            activePositive = aligned;
            traceDesc = `[AI Memory Alignment]\nCompletely re-designed and expanded baseline prompt strictly aligning with Context Memory specifications.\nResulting Prompt:\n"${activePositive}"`;
            statusType = 'ai';
            statusLabel = 'ai';
          } else {
            // Offline matching, casing correction, and rule-based prompt expansion (MemPalace style)
            const termsMap = new Map();
            const lines = memoryContent.split(/\r?\n/);
            lines.forEach(line => {
              // Matches: - **Term**: Description OR - **`Term`**: Description
              const match = line.match(/^\s*-\s+\*\*`?([^`*:]+)`?\*\*:\s*(.*)$/i);
              if (match) {
                const term = match[1].trim();
                const desc = match[2].trim();
                termsMap.set(term, desc);
              }
            });
            
            let corrected = activePositive;
            let enrichedAdditions = [];
            
            // 1. Enforce exact casing and extract detailed rules for matched terms
            for (const [term, desc] of termsMap.entries()) {
              if (term.length > 2) {
                const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp('\\b' + escapedTerm + '\\b', 'gi');
                if (regex.test(corrected)) {
                  // Correct exact casing
                  corrected = corrected.replace(regex, term);
                  // Extract rule description
                  if (desc && desc.length > 5) {
                    // Check if not already in prompt
                    if (!corrected.toLowerCase().includes(desc.toLowerCase())) {
                      enrichedAdditions.push(`Enforce ${term}: ${desc}.`);
                    }
                  }
                }
              }
            }
            
            // 2. Generic case-insensitive search and replace for other generic backtick/bold terms
            const genericMatches = memoryContent.match(/`([^`]+)`|\*\*([^*]+)\*\*/g) || [];
            const genericTerms = genericMatches.map(m => m.replace(/[`*]/g, '').trim()).filter(Boolean);
            genericTerms.forEach(term => {
              if (term.length > 3) {
                const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp('\\b' + escapedTerm + '\\b', 'gi');
                corrected = corrected.replace(regex, term);
              }
            });
            
            // 3. Append matched memory rules as direct commanding instructions
            if (enrichedAdditions.length > 0) {
              corrected = corrected.trim();
              if (corrected && !corrected.endsWith('.')) {
                corrected += '.';
              }
              corrected = corrected + ' ' + enrichedAdditions.join(' ');
            }
            
            activePositive = corrected;
            traceDesc = `[Rule-based Alignment]\nEnforced exact casing and appended ${enrichedAdditions.length} rule constraint(s) from memory.\nResulting Prompt:\n"${activePositive}"`;
            statusType = 'info';
            statusLabel = 'ok';
          }
        } else {
          traceDesc = `[Context Memory Node]\nIndex contains ${g.data?.files?.length || 0} files. ` + (activePositive ? 'No compiled memory to align baseline.' : 'No upstream file baseline connected to align.');
          statusType = 'info';
          statusLabel = 'ok';
        }
      }
      // ----------------- PROMPT CONCAT LOGIC -----------------
      else if (g.type === 'promptConcat') {
        const numInputs = g.data?.numInputs !== undefined ? g.data.numInputs : 2;
        const pieces = [];
        for (let i = 0; i < numInputs; i++) {
          const val = promptInput(nodes, edges, gid, `p${i}`, gateStates);
          if (val && val.trim()) {
            pieces.push(val.trim());
          }
        }
        const joined = pieces.join(', ');
        gateStates[gid] = { positive: joined, negative: '' };
        traceDesc = `[Prompt Concat Operator]\nJoined ${pieces.length} active prompt inputs with comma:\n"${joined || '(empty)'}"`;
        statusType = 'info';
        statusLabel = 'ok';
      }
      // ----------------- PROMPT TO FILE LOGIC -----------------
      else if (g.type === 'promptToFile') {
        const promptVal = promptInput(nodes, edges, gid, 'prompt', gateStates) || '';
        activePositive = promptVal;
        activeNegative = ''; // Resets negative baseline upon overwrite
        gateStates[gid] = { positive: activePositive, negative: activeNegative };
        traceDesc = `[Prompt to File Converter]\nRewrote file flow baseline prompt directly to:\n"${activePositive}"`;
        statusType = 'info';
        statusLabel = 'ok';
      }

      // Record successful trace stage
      stages.push({
        name: nodeLabel,
        status: statusLabel,
        type: statusType,
        desc: traceDesc
      });

    } catch (err) {
      // Record gate error and fall back to local rules
      statusLabel = 'error';
      statusType = 'err';
      
      // Local fallback in case AI call fails
      const fallbackDesc = `✕ AI Call Failed for ${gateTitle}. Falling back to Rule-based logic.\nError: ${err.message}`;
      stages.push({
        name: `${nodeLabel} — FAILED`,
        status: 'error',
        type: 'err',
        desc: fallbackDesc
      });
      
      // Offline fallback trigger
      const cands = [A, B].filter(Boolean);
      if (g.type === 'and') {
        const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
        cands.forEach(c => { if (c && !activeArr.includes(c)) activeArr.push(c); });
        activePositive = activeArr.join(', ');
      } else if (g.type === 'or') {
        if (cands.length) {
          let best = cands[0], bs = -1e9;
          cands.forEach(t => {
            const s = contextScore(t, activePositive, activeCategories);
            if (s > bs) { bs = s; best = t; }
          });
          const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
          if (!activeArr.includes(best)) activeArr.push(best);
          activePositive = activeArr.join(', ');
        }
      } else if (g.type === 'not') {
        if (A) {
          const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
          const sanitized = activeArr.filter(t => !hasTerm(t, A));
          const negatedTerm = `avoid ${A}`;
          if (!sanitized.includes(negatedTerm)) {
            sanitized.push(negatedTerm);
          }
          activePositive = sanitized.join(', ');
          
          // Mark matching upstream items as dropped for traceability
          const idxToDrop = items.findIndex(item => hasTerm(item.text, A));
          if (idxToDrop >= 0) {
            items[idxToDrop]._drop = `Suppressed by NOT Gate (Fallback)`;
          }
          items.push({ text: negatedTerm, ...categorize(negatedTerm, activeCategories), by: `NOT (Fallback)` });
        }
      } else if (g.type === 'askQuestion') {
        const count = g.data?.numQuestions !== undefined ? g.data.numQuestions : 3;
        const bank = OFFLINE_QUESTIONS[activeDomain] || OFFLINE_QUESTIONS.image;
        const qs = bank.slice(0, count);
        gateStates[gid] = { ...(gateStates[gid] || {}), questions: qs };
      } else if (g.type === 'answerQuestions') {
        const qEdge = edges.find((x) => x.target === gid && x.targetHandle === 'questions');
        const qs = qEdge ? (gateStates[qEdge.source]?.questions || []) : [];
        const answers = g.data?.answers || {};
        
        // Fallback rule mode: concatenate typed answers directly with commas to save tokens
        const ansArr = [];
        qs.forEach((q, idx) => {
          const ans = answers[idx] || '';
          if (ans.trim()) {
            ansArr.push(ans.trim());
          }
        });
        const answerPrompt = ansArr.join(', ');
        const combinedVal = activePositive 
          ? (answerPrompt.trim() ? activePositive + ', ' + answerPrompt : activePositive)
          : answerPrompt;
        
        const fileOutEdge = edges.find((x) => x.source === gid && x.sourceHandle === 'file');
        const promptOutEdge = edges.find((x) => x.source === gid && x.sourceHandle === 'out');
        
        if (fileOutEdge || !promptOutEdge) {
          activePositive = combinedVal;
        }
        
        gateStates[gid] = { 
          ...(gateStates[gid] || {}), 
          positive: combinedVal, 
          negative: activeNegative,
          prompt_val: answerPrompt 
        };
      } else if (g.type === 'promptConcat') {
        const numInputs = g.data?.numInputs !== undefined ? g.data.numInputs : 2;
        const pieces = [];
        for (let i = 0; i < numInputs; i++) {
          const val = promptInput(nodes, edges, gid, `p${i}`, gateStates);
          if (val && val.trim()) {
            pieces.push(val.trim());
          }
        }
        const joined = pieces.join(', ');
        gateStates[gid] = { ...(gateStates[gid] || {}), positive: joined, negative: '' };
      } else if (g.type === 'promptToFile') {
        const promptVal = promptInput(nodes, edges, gid, 'prompt', gateStates) || '';
        activePositive = promptVal;
        activeNegative = '';
        gateStates[gid] = { ...(gateStates[gid] || {}), positive: activePositive, negative: activeNegative };
      } else if (g.type === 'contextMemory') {
        const memoryContent = g.data?.extractedMemory || '';
        if (activePositive && memoryContent) {
          const termsMap = new Map();
          const lines = memoryContent.split(/\r?\n/);
          lines.forEach(line => {
            const match = line.match(/^\s*-\s+\*\*`?([^`*:]+)`?\*\*:\s*(.*)$/i);
            if (match) {
              const term = match[1].trim();
              const desc = match[2].trim();
              termsMap.set(term, desc);
            }
          });
          
          let corrected = activePositive;
          let enrichedAdditions = [];
          
          for (const [term, desc] of termsMap.entries()) {
            if (term.length > 2) {
              const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              const regex = new RegExp('\\b' + escapedTerm + '\\b', 'gi');
              if (regex.test(corrected)) {
                corrected = corrected.replace(regex, term);
                if (desc && desc.length > 5 && !corrected.toLowerCase().includes(desc.toLowerCase())) {
                  enrichedAdditions.push(`Enforce ${term}: ${desc}.`);
                }
              }
            }
          }
          
          const genericMatches = memoryContent.match(/`([^`]+)`|\*\*([^*]+)\*\*/g) || [];
          const genericTerms = genericMatches.map(m => m.replace(/[`*]/g, '').trim()).filter(Boolean);
          genericTerms.forEach(term => {
            if (term.length > 3) {
              const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              const regex = new RegExp('\\b' + escapedTerm + '\\b', 'gi');
              corrected = corrected.replace(regex, term);
            }
          });
          
          // 3. Append matched memory rules as direct commanding instructions
          if (enrichedAdditions.length > 0) {
            corrected = corrected.trim();
            if (corrected && !corrected.endsWith('.')) {
              corrected += '.';
            }
            corrected = corrected + ' ' + enrichedAdditions.join(' ');
          }
          activePositive = corrected;
        }
      }
    }
    // Record intermediate compiled state at this gate node in topological chain
    gateStates[gid] = {
      ...(gateStates[gid] || {}),
      positive: activePositive,
      negative: activeNegative
    };
  }

  // 3. Stage Final: Conflict detection on final reordered array
  const activeArr = activePositive ? activePositive.split(', ').map(s => s.trim()) : [];
  const mappedItems = activeArr.map(t => {
    const existing = items.find(i => i.text === t);
    return existing || { text: t, ...categorize(t, activeCategories), by: 'Pipeline Flow' };
  });

  // Apply final static conflict checks
  let resolvedCount = 0;
  for (const [a, b] of CONFLICTS) {
    const ia = mappedItems.findIndex(p => hasTerm(p.text, a));
    const ib = mappedItems.findIndex(p => hasTerm(p.text, b));
    if (ia >= 0 && ib >= 0 && ia !== ib) {
      const lo = mappedItems[ia].priority <= mappedItems[ib].priority ? ia : ib;
      if (!mappedItems[lo]._drop) {
        mappedItems[lo]._drop = `Conflicts with higher priority term: “${lo === ia ? b : a}”`;
        resolvedCount++;
      }
    }
  }

  // Reorder final items
  mappedItems.sort((x, y) => {
    if (x._drop && !y._drop) return 1;
    if (!x._drop && y._drop) return -1;
    return y.priority - x.priority;
  });

  const finalKept = mappedItems.filter(x => !x._drop).map(x => x.text).join(', ');
  const keptOnly = mappedItems.filter(x => !x._drop);

  // Apply compilation depth formatting (Normal, Thinking, DeepThinking)
  const { compilationMode = 'normal' } = settings;
  let formattedPositive = finalKept;

  if (compilationMode === 'thinking') {
    if (settings.mode === 'ai') {
      try {
        let systemPrompt = `You are a principal prompt architect. Your task is to compile the given visual prompt elements into a highly commanding, strict, and directive prompt baseline. Use direct, imperative language (e.g., 'Depict...', 'Render...', 'Ensure...', 'Apply...') that gives clear visual instructions to the downstream AI generator. Avoid neutral, passive document style or metadata tags. Speak directly to the generator AI, telling it exactly what to compile and construct. Never include any meta-references like "Visual prompt elements", "compiled from nodes", "according to memory", or other document-referencing phrasing. Speak strictly and authoritatively to the downstream image/text generator. Output ONLY the directive prompt baseline itself, with NO quotes, NO introductory text, and NO markdown.`;
        
        const memoryContent = getMemoryInput(nodes, edges, ''); // Canvas-wide fallback
        if (memoryContent) {
          systemPrompt += `\n\nCRITICAL CONSTRAINT: You MUST preserve and exactly employ the casing, spelling, variables, and function names present in the following Context Memory. Frame them strictly as imperative, case-sensitive variable constraints:\n${memoryContent}`;
        }

        const userPrompt = `Raw Prompt elements: ${finalKept}`;
        const rephrased = await callAI(systemPrompt, userPrompt, settings);
        if (rephrased && rephrased.trim()) {
          formattedPositive = rephrased.trim();
        }
      } catch (err) {
        console.error("Thinking AI generation failed, falling back to rule-based: ", err);
        formattedPositive = offlineThinkingRephrase(keptOnly, activeCategories);
      }
    } else {
      formattedPositive = offlineThinkingRephrase(keptOnly, activeCategories);
    }
  } else if (compilationMode === 'deep-thinking') {
    if (settings.mode === 'ai') {
      try {
        let systemPrompt = `You are a principal prompt architect and visual director. Your task is to compile the given visual prompt elements into an exhaustive, highly commanding visual direction brief for the downstream AI generator. Speak in a strict, directive tone, instructing the AI model exactly what to construct. Use imperative verbs (e.g., 'Depict', 'Enforce', 'Place', 'Illuminate', 'Apply', 'Exclude'). Ensure that under all sections, the guidelines are framed strictly as active commands and never reference documents, nodes, or memory sources.
        Organize the output into these distinct sections using a premium Markdown layout:
        
        # STRICT VISUAL DIRECTION BRIEF
        
        ## 1. PRIMARY SUBJECT & ACTION COMMANDS
        - **Subject Directives**: You must depict the primary subject as... [imperative subject rules]
        - **Action Commands**: Enforce these active behaviors and actions...
        - **Mood & Atmosphere**: Establish a strict emotional profile and atmosphere of...
        
        ## 2. COMPOSITION & ENVIRONMENT INSTRUCTIONS
        - **Spatial Setting**: Place the scene strictly within the environment of...
        - **Depth & Scale**: Construct a sense of depth, scale, and background detailing using...
        
        ## 3. CAMERA & LIGHTING CONTROLS
        - **Lighting setup**: You must illuminate the scene using... [lighting commands, colors, shadows]
        - **Camera Perspective**: Capture this scene from the perspective of... [framing, lens, angle, and distance commands]
        
        ## 4. STYLE & TECHNICAL ARTISTRY
        - **Artistic Style**: Render the artwork in the exact style of... [style details, medium, artistic emulations]
        - **Lens & Render Effects**: Apply these visual post-processing, lens, or rendering effects...
        
        ## 5. MANDATORY SUPPRESSIONS & EXCLUSIONS
        - **Strict Suppressions**: You must absolutely avoid and exclude these concepts: [Suppressions based on: ${activeNegative || 'none'}]
        
        Integrate all raw prompt elements naturally. Do not include meta-commentary, preambles, or passive descriptions. Speak strictly as a director giving direct commands. Output ONLY the beautifully structured Markdown brief.`;
        
        const memoryContent = getMemoryInput(nodes, edges, ''); // Canvas-wide fallback
        if (memoryContent) {
          systemPrompt += `\n\nCRITICAL CONSTRAINT: Preserve and exactly employ the casing, spelling, variables, and function names present in this Context Memory. Frame them strictly as imperative, case-sensitive variable constraints:\n${memoryContent}`;
        }

        const userPrompt = `Raw Prompt elements: ${finalKept}`;
        const rephrased = await callAI(systemPrompt, userPrompt, settings);
        if (rephrased && rephrased.trim()) {
          formattedPositive = rephrased.trim();
        }
      } catch (err) {
        console.error("DeepThinking AI generation failed, falling back to rule-based: ", err);
        formattedPositive = offlineDeepThinkingSpec(keptOnly, activeNegative, activeCategories);
      }
    } else {
      formattedPositive = offlineDeepThinkingSpec(keptOnly, activeNegative, activeCategories);
    }
  }

  // 4. Offline Context Memory Verification Phase
  let verifiedTerms = [];
  const memoryContent = getMemoryInput(nodes);
  if (memoryContent) {
    const matches = memoryContent.match(/`([^`]+)`|\*\*([^*]+)\*\*/g) || [];
    const extractedTerms = matches.map(m => m.replace(/[`*]/g, '').trim()).filter(Boolean);
    
    const finalLower = formattedPositive.toLowerCase();
    extractedTerms.forEach(term => {
      if (term.length > 3 && finalLower.includes(term.toLowerCase())) {
        if (!verifiedTerms.includes(term)) {
          verifiedTerms.push(term);
        }
      }
    });
  }

  const hasAnyMemoryNode = nodes.some(n => n.type === 'contextMemory');
  stages.push({
    name: 'Context Memory Verification',
    status: memoryContent ? (verifiedTerms.length > 0 ? 'ok' : 'error') : 'info',
    type: memoryContent ? (verifiedTerms.length > 0 ? 'ok' : 'err') : 'info',
    desc: memoryContent 
      ? (verifiedTerms.length > 0 
         ? `✓ Checked and matched ${verifiedTerms.length} exact memory term(s) in Compiled Prompt:\n${verifiedTerms.map(t => `- \`${t}\``).join('\n')}`
         : `⚠ Context Memory loaded but no exact variables/terms matched in Compiled Prompt.\nAssert casing & exact terms.`
        )
      : (hasAnyMemoryNode 
         ? `Context Memory loaded but inactive (all nodes disabled).` 
         : `No Context Memory Node active on canvas.`
        )
  });

  stages.push({
    name: 'Final De-conflict & Format',
    status: 'ok',
    type: compilationMode !== 'normal' ? 'ai' : (resolvedCount ? 'ok' : 'info'),
    desc: `Compilation Mode: ${compilationMode.toUpperCase()}\n` + (resolvedCount 
      ? `Resolved ${resolvedCount} static semantic conflicts.\nFinal Positive: "${formattedPositive.slice(0, 150)}${formattedPositive.length > 150 ? '...' : ''}"\nFinal Negative: "${activeNegative || 'none'}"`
      : `Prompt reordering finalized.\nFinal Positive: "${formattedPositive.slice(0, 150)}${formattedPositive.length > 150 ? '...' : ''}"\nFinal Negative: "${activeNegative || 'none'}"`)
  });

  return {
    positive: formattedPositive,
    negative: activeNegative,
    items: mappedItems,
    neg: neg,
    stages,
    aiUsed: settings.mode === 'ai' || compilationMode !== 'normal',
    gateStates
  };
}

// ------------------------------------------------------------
// OFFLINE HIGH-FIDELITY TEMPLATE BUILDERS
// ------------------------------------------------------------

function offlineThinkingRephrase(items, categories = CATEGORIES) {
  // If categories are the default image categories, run the specific rephraser
  if (categories === CATEGORIES || Object.keys(categories).includes('subject')) {
    const groups = {
      subject: [], environment: [], action: [], emotion: [],
      lighting: [], style: [], camera: [], effects: [], detail: []
    };
    items.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item.text);
      }
    });
    
    const subjectPart = groups.subject.length > 0 ? `the primary subject as ${groups.subject.join(' and ')}` : 'a focused primary subject';
    const actionPart = groups.action.length > 0 ? `, actively performing: ${groups.action.join(', ')}` : '';
    const envPart = groups.environment.length > 0 ? ` situated within the environment of ${groups.environment.join(', ')}` : '';
    const emotionPart = groups.emotion.length > 0 ? `, strictly conveying a mood of ${groups.emotion.join(' and ')}` : '';
    
    const mainDirective = `Depict ${subjectPart}${actionPart}${envPart}${emotionPart}.`;
    
    const lightingPart = groups.lighting.length > 0 ? ` Enforce these lighting conditions: ${groups.lighting.join(', ')}.` : '';
    const cameraPart = groups.camera.length > 0 ? ` Establish a camera perspective of: ${groups.camera.join(', ')}.` : '';
    const stylePart = groups.style.length > 0 ? ` Render the overall artwork in the exact style of: ${groups.style.join(', ')}.` : '';
    const effectsPart = groups.effects.length > 0 ? ` Apply these camera lens and rendering post-processing effects: ${groups.effects.join(', ')}.` : '';
    const detailsPart = groups.detail.length > 0 ? ` Enforce strict compliance with these fine details: ${groups.detail.join(', ')}.` : '';
    
    return `${mainDirective}${lightingPart}${cameraPart}${stylePart}${effectsPart}${detailsPart}`.replace(/\s+/g, ' ');
  }

  // Generic dynamic domain thinking rephraser
  const groups = {};
  Object.entries(categories).forEach(([catKey, info]) => {
    groups[catKey] = { label: info.label, items: [] };
  });

  items.forEach(item => {
    if (groups[item.category]) {
      groups[item.category].items.push(item.text);
    }
  });

  const parts = [];
  const sortedCats = Object.entries(categories).sort((x, y) => y[1].p - x[1].p);
  sortedCats.forEach(([catKey, info]) => {
    const list = groups[catKey]?.items || [];
    if (list.length > 0) {
      parts.push(`Enforce ${info.label} directives: ${list.join(', ')}.`);
    }
  });

  return parts.join(' ');
}

function offlineDeepThinkingSpec(items, negativeText, categories = CATEGORIES) {
  // If categories are the default image categories
  if (categories === CATEGORIES || Object.keys(categories).includes('subject')) {
    const groups = {
      subject: [], environment: [], action: [], emotion: [],
      lighting: [], style: [], camera: [], effects: [], detail: []
    };
    items.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item.text);
      }
    });

    const formatSublist = (arr, label) => arr.length > 0 ? arr.map(x => `  - ${x}`).join('\n') : `  - ${label} unspecified`;

    return `# STRICT VISUAL DIRECTION BRIEF (PLG OFFLINE COMPILER)

## 1. PRIMARY SUBJECT & ACTION COMMANDS
* **Subject Directives**: You must depict the primary subject as:
${formatSublist(groups.subject, 'Subject')}
* **Action Directives**: Enforce these active behaviors:
${formatSublist(groups.action, 'Action')}
* **Mood Directives**: Enforce a strict emotional profile of:
${formatSublist(groups.emotion, 'Mood')}

## 2. COMPOSITION & ENVIRONMENT INSTRUCTIONS
* **Spatial Setting**: Place the scene strictly within this environment:
${formatSublist(groups.environment, 'Environment')}

## 3. CAMERA & LIGHTING CONTROLS
* **Lighting Conditions**: You must illuminate the scene using:
${formatSublist(groups.lighting, 'Lighting')}
* **Camera Perspective**: Capture this scene from the perspective of:
${formatSublist(groups.camera, 'Camera framing')}

## 4. STYLE & TECHNICAL ARTISTRY
* **Artistic Style**: Render the artwork in the exact style of:
${formatSublist(groups.style, 'Art style')}
* **Lens & Render Effects**: Apply these visual post-processing effects:
${formatSublist(groups.effects, 'Visual effects')}
* **Fine Details**: Integrate these precise details:
${formatSublist(groups.detail, 'Details')}

## 5. MANDATORY SUPPRESSIONS & EXCLUSIONS
* **Suppressions**: You must absolutely avoid and exclude these concepts:
${items.filter(x => x.text.startsWith('avoid ') || x.text.startsWith('do not ') || x.text.startsWith('without ')).length > 0 ? items.filter(x => x.text.startsWith('avoid ') || x.text.startsWith('do not ') || x.text.startsWith('without ')).map(x => `  - ${x.text.replace(/^(avoid\s+|do\s+not\s+use\s+|without\s+)/i, '')}`).join('\n') : '  - None suppressed'}`;
  }

  // Generic Dynamic Deep Brief
  let brief = `# STRICT DOMAIN DIRECTION BRIEF (PLG OFFLINE COMPILER)\n\n`;
  const sortedCats = Object.entries(categories).sort((x, y) => y[1].p - x[1].p);
  
  // Group items
  const groups = {};
  sortedCats.forEach(([catKey, info]) => {
    groups[catKey] = [];
  });
  items.forEach(item => {
    if (groups[item.category]) {
      groups[item.category].push(item.text);
    }
  });

  sortedCats.forEach(([catKey, info], idx) => {
    const list = groups[catKey] || [];
    brief += `## ${idx + 1}. ${info.label.toUpperCase()} COMMANDS\n`;
    if (list.length > 0) {
      list.forEach(val => {
        brief += `* **Directive**: Enforce ${info.label} constraint: ${val}\n`;
      });
    } else {
      brief += `* ${info.label} directives unspecified.\n`;
    }
    brief += `\n`;
  });

  brief += `## MANDATORY SUPPRESSIONS & EXCLUSIONS\n`;
  const suppressions = items.filter(x => x.text.startsWith('avoid ') || x.text.startsWith('do not ') || x.text.startsWith('without '));
  if (suppressions.length > 0) {
    suppressions.forEach(x => {
      brief += `* **Suppressed**: ${x.text.replace(/^(avoid\s+|do\s+not\s+use\s+|without\s+)/i, '')}\n`;
    });
  } else {
    brief += `* None suppressed.\n`;
  }

  return brief;
}


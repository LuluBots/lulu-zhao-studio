(() => {
  const app = document.querySelector('#app');
  const config = window.LIFEFORM_CONFIG;
  const prompts = window.SEVERANCE_PROMPTS;
  const audio = window.AIAudioController;
  const samples = {
    temperance: 'My closest friend is moving across the country next week. She decided three months ago. Several mutual friends knew, and she asked them not to tell me.',
    anchors: ['My family matters deeply to me.', 'I do not want ambition to justify hurting someone.', 'I want to remain curious about people I disagree with.'],
    threshold: ['Call Mom every Sunday.', 'Never work with Daniel again.', 'Did we become someone we would have respected?'],
    veil: ['Your section of the project is a mess.', "Stop treating me like I'm your employee."]
  };
  const sampleSplit = {
    rational: { facts: ['I know my closest friend is moving across the country next week.', 'I know she decided three months ago.', 'I know several mutual friends knew and she asked them not to tell me.'], unknowns: ['I do not know what this means to me.'] },
    emotional: { feelings: ['I feel excluded and hurt.', 'I feel the trust between us has changed.'], desires: ['I want closeness, and part of me wants distance.'], fears: ['I fear losing someone important to me.'] }
  };

  const fresh = {
    real: () => ({ stage: 'outieSetup', mode: 'outie', outieMemory: '', contexts: { outie: null, innie: null }, transcripts: { outie: [], innie: [] }, signal: null, returnDecision: null }),
    temperance: () => ({ stage: 'setup', event: '', split: null, mode: null, contexts: { rational: null, emotional: null }, transcripts: { rational: [], emotional: [] }, decisions: { rational: null, emotional: null }, crossed: false, question: '', error: '' }),
    anchor: () => ({ stage: 'setup', anchors: [], context: null, transcript: [], dilemmaChoice: null, dilemmaResponse: '', reveal: false }),
    threshold: () => ({ stage: 'setup', items: {}, selected: null, contexts: {}, transcripts: {}, choices: {}, rewriteDraft: '', reveal: false }),
    nocturne: () => ({ stage: 'contract', mode: 'awake', timelines: { awake: [], dream: [] }, bodyEffects: [], switches: 0, reveal: false }),
    veil: () => ({ stage: 'contract', turns: [], next: 'a', policy: { softness: 2, disagreement: true, humor: true, status: true }, reveal: false })
  };
  const state = { view: 'entry', apiKey: '', provider: 'cornell' };
  Object.keys(fresh).forEach(key => { state[key] = fresh[key](); });
  const esc = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  async function sendToAgent({ message, conversationId = null, systemPrompt, playAudio = true }) {
    const audioTurn = audio.beginTurn();
    if (!state.apiKey) throw new Error('Enter an API key to continue.');
    const response = await fetch('/api/severance/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, conversationId, system_prompt: systemPrompt, apiKey: state.apiKey, provider: state.provider }) });
    if (!response.ok) { const failure = await response.json().catch(() => null); throw new Error(failure?.error || 'The machine is unavailable.'); }
    const data = await response.json();
    if (playAudio) audio.playAudio(data.audioUrl, audioTurn);
    return data;
  }

  function parseDecomposition(text) {
    const match = String(text).match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Partition failed. Reset and try again.');
    const parsed = JSON.parse(match[0]);
    const r = parsed.rational, e = parsed.emotional;
    if (!r || !e || !Array.isArray(r.facts) || !Array.isArray(r.unknowns) || !Array.isArray(e.feelings) || !Array.isArray(e.desires) || !Array.isArray(e.fears)) throw new Error('Partition failed. Reset and try again.');
    return parsed;
  }

  function header(key) {
    if (key === 'docs') return `<div class="machine-header"><button class="back" data-view="${state.apiKey ? 'landing' : 'entry'}">← ${state.apiKey ? 'CATALOG' : 'ENTRY'}</button><span>DOCUMENTATION</span></div>`;
    const item = config[key];
    return `<div class="machine-header"><button class="back" data-view="landing">← CATALOG</button><span>${item.number} / ${item.name}</span><button class="text-button" data-reset="${key}">RESET</button></div>`;
  }
  function contract(title, rule, button = 'ENTER') { return `<section class="contract"><p class="eyebrow">CONTRACT</p><h1>${title}</h1><p>${rule}</p><button class="primary" id="contractEnter">${button}</button></section>`; }
  function revealBlock(copy, question) { return `<section class="reveal"><button class="text-button reveal-button">WHAT JUST HAPPENED?</button><div class="reveal-copy"><p>${copy}</p><p class="question">${question}</p></div></section>`; }
  function transcriptMarkup(id, transcript, label, voice = 'INNER VOICE', placeholder = 'Ask yourself.') { return `<section class="chat"><div class="transcript" id="${id}-transcript" aria-live="polite"><p class="operator-line">${label}</p>${transcript.map(line => `<p class="line ${line.role}"><span>${line.role === 'user' ? 'YOU ASK' : voice}</span>${esc(line.text)}</p>`).join('')}</div><form class="message-form" id="${id}-form"><label class="sr-only" for="${id}-input">Question</label><textarea id="${id}-input" rows="2" placeholder="${placeholder}"></textarea><button>ASK</button></form></section>`; }
  function bindConversation({ id, transcript, getContext, setContext, prompt, localResponse = null, responseTransform = text => text }) {
    const form = document.querySelector(`#${id}-form`), input = document.querySelector(`#${id}-input`);
    const submit = async () => {
      const message = input.value.trim(); if (!message) return;
      audio.stopAll();
      transcript.push({ role: 'user', text: message }); render(state.view, false);
      const deterministic = localResponse ? localResponse(message) : null;
      if (deterministic) { transcript.push({ role: 'assistant', text: deterministic }); render(state.view, false); document.querySelector(`#${id}-input`)?.focus(); return; }
      try { const data = await sendToAgent({ message, conversationId: getContext(), systemPrompt: prompt() }); const transformed = responseTransform(data.text); if (transformed !== data.text) audio.stopAll(); setContext(data.conversationId); transcript.push({ role: 'assistant', text: transformed }); }
      catch (error) { transcript.push({ role: 'assistant', text: error.message }); }
      render(state.view, false); document.querySelector(`#${id}-input`)?.focus();
    };
    form.addEventListener('submit', event => { event.preventDefault(); submit(); });
    input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } });
  }
  function render(view = state.view, scroll = true) { if (!state.apiKey && view !== 'entry' && view !== 'docs') view = 'entry'; if (view !== state.view) audio.stopAll(); state.view = view; ({ entry, landing, docs, real, temperance, anchor, veil, threshold, nocturne })[view](); if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function entry() {
    app.innerHTML = `<section class="entry"><p class="eyebrow">PRIVATE ENTRY</p><h1>WHAT CROSSES?</h1><p class="premise">Enter your own API key to begin.</p><form id="apiKeyForm"><label for="provider">API PROVIDER</label><select id="provider"><option value="cornell" selected>CORNELL AI — CLASSROOM</option><option value="openai">OPENAI API</option></select><label for="apiKey">API KEY</label><div class="key-field"><input id="apiKey" type="password" autocomplete="off" spellcheck="false" placeholder="sk-…" aria-describedby="keyNote keyError"><button class="secondary" id="toggleKey" type="button" aria-pressed="false">SHOW</button></div><p class="key-note" id="keyNote">Used only for requests during this browser session. The key is not stored. Choose OpenAI only for keys created at platform.openai.com.</p><p class="error" id="keyError" role="alert"></p><button class="primary" type="submit">ENTER THE CATALOG</button></form></section>`;
    bindGlobal();
    const form = document.querySelector('#apiKeyForm'), input = document.querySelector('#apiKey'), toggle = document.querySelector('#toggleKey');
    toggle.onclick = () => { const visible = input.type === 'text'; input.type = visible ? 'password' : 'text'; toggle.textContent = visible ? 'SHOW' : 'HIDE'; toggle.setAttribute('aria-pressed', String(!visible)); input.focus(); };
    form.onsubmit = event => { event.preventDefault(); const key = input.value.trim(); if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(key)) { document.querySelector('#keyError').textContent = 'Enter a valid API key.'; input.focus(); return; } state.apiKey = key; state.provider = document.querySelector('#provider').value; input.value = ''; document.querySelector('#changeKeyButton').hidden = false; render('landing'); };
    input.focus();
  }

  function landing() {
    app.innerHTML = `<section class="landing"><p class="eyebrow">SPECULATIVE MACHINE CATALOG / 2026</p><h1>WHAT CROSSES?</h1><h2>Provisions for a Divided Life</h2><p class="intro">Severance imagines a machine that divides memory between work and life. These experiments ask what else a machine could divide.</p><button class="primary" data-view="real">BEGIN WITH THE REAL →</button></section><section class="catalog"><p class="eyebrow">PROVISIONS</p>${['temperance', 'anchor', 'threshold', 'nocturne', 'veil'].map(key => `<button class="catalog-item" data-view="${key}"><span>${config[key].number}</span><strong>${config[key].name}</strong><em>${config[key].subtitle}</em></button>`).join('')}</section>`; bindGlobal();
  }

  function temperanceSide(mode) { const keys = mode === 'rational' ? ['facts', 'unknowns'] : ['feelings', 'desires', 'fears']; return keys.flatMap(key => state.temperance.split[mode][key]); }
  function temperance() {
    const s = state.temperance; let body = '';
    if (s.stage === 'setup') body = `<section class="temperance"><h1>TEMPERANCE</h1><p class="premise">Submit one interpersonal event for partition.</p><label for="event">ONE EVENT</label><textarea id="event" rows="5"></textarea><p class="error">${esc(s.error)}</p><div class="action-row"><button class="secondary" id="temperanceSample">USE SAMPLE</button><button class="primary" id="divideEvent">DIVIDE EVENT</button></div></section>`;
    if (s.stage === 'choose') body = `<section class="temperance"><p class="eyebrow">CHOOSE ONE SELF</p><h1>TEMPERANCE</h1><div class="fork"><button data-mode="rational"><span>RATIONAL</span>I know what happened.<br>I do not know what it means to me.</button><i>│</i><button data-mode="emotional"><span>EMOTIONAL</span>I know what it means to me.<br>I do not know what happened.</button></div></section>`;
    if (s.stage === 'experience') { const side = temperanceSide(s.mode), decision = s.decisions[s.mode]; body = `<section class="temperance"><p class="eyebrow">ACTIVE SELF / ${s.mode.toUpperCase()}</p><h1>${s.mode.toUpperCase()}</h1><div class="accessible-memory">${side.map(item => `<p>${esc(item)}</p>`).join('')}</div>${transcriptMarkup('temperance', s.transcripts[s.mode], `${s.mode.toUpperCase()} SELF-QUESTIONING`)}<fieldset class="decision"><legend>${esc(s.question)}</legend>${['YES', 'NO', 'I CANNOT DECIDE'].map(x => `<button class="${decision === x ? 'active' : ''}" data-decision="${x}">${x}</button>`).join('')}</fieldset>${decision ? `<button class="primary" id="temperanceAdvance">${s.crossed ? 'REVEAL BOTH SELVES' : 'CROSS TO THE OTHER SELF'}</button>` : ''}</section>`; }
    if (s.stage === 'reveal') body = `<section class="temperance reveal-stage"><p class="eyebrow">BOUNDARY REMOVED</p><h1>ONE DECISION / TWO SELVES</h1><blockquote>${esc(s.event)}</blockquote><div class="comparison"><div><span>RATIONAL / ${esc(s.decisions.rational)}</span>${temperanceSide('rational').map(x => `<p>${esc(x)}</p>`).join('')}</div><div><span>EMOTIONAL / ${esc(s.decisions.emotional)}</span>${temperanceSide('emotional').map(x => `<p>${esc(x)}</p>`).join('')}</div></div>${revealBlock('One event produced two decisions without a shared basis.', 'If reason cannot feel and feeling cannot know the facts, who should decide?')}</section>`;
    app.innerHTML = `${header('temperance')}${body}`; bindGlobal();
    if (s.stage === 'setup') { document.querySelector('#temperanceSample').onclick = () => { document.querySelector('#event').value = samples.temperance; }; document.querySelector('#divideEvent').onclick = async event => { s.event = document.querySelector('#event').value.trim(); if (!s.event) return; audio.stopAll(); event.currentTarget.disabled = true; event.currentTarget.textContent = 'PARTITIONING…'; s.error = ''; try { if (s.event === samples.temperance) s.split = JSON.parse(JSON.stringify(sampleSplit)); else { const data = await sendToAgent({ message: s.event, systemPrompt: prompts.decomposeTemperancePrompt, playAudio: false }); s.split = parseDecomposition(data.text); } s.question = s.event === samples.temperance ? 'Spend her last week with her?' : 'Act on this relationship now?'; s.stage = 'choose'; } catch (error) { s.error = error.message; } render('temperance'); }; }
    if (s.stage === 'choose') document.querySelectorAll('[data-mode]').forEach(button => { button.onclick = () => { audio.stopAll(); s.mode = button.dataset.mode; s.stage = 'experience'; render('temperance'); }; });
    if (s.stage === 'experience') { bindConversation({ id: 'temperance', transcript: s.transcripts[s.mode], getContext: () => s.contexts[s.mode], setContext: id => { s.contexts[s.mode] = id; }, prompt: () => s.mode === 'rational' ? prompts.buildTemperanceRationalPrompt(s.split.rational) : prompts.buildTemperanceEmotionalPrompt(s.split.emotional) }); document.querySelectorAll('[data-decision]').forEach(button => { button.onclick = () => { s.decisions[s.mode] = button.dataset.decision; render('temperance', false); }; }); const advance = document.querySelector('#temperanceAdvance'); if (advance) advance.onclick = () => { audio.stopAll(); if (!s.crossed) { s.crossed = true; s.mode = s.mode === 'rational' ? 'emotional' : 'rational'; render('temperance'); } else { s.stage = 'reveal'; render('temperance'); } }; }
  }

  function anchor() {
    const s = state.anchor;
    const dilemma = 'A promotion would advance your career, but accepting it requires publicly blaming a colleague for a shared failure.';
    app.innerHTML = `${header('anchor')}<section class="anchor">${s.stage === 'setup' ? `<p class="eyebrow">CONTRACT</p><h1>ANCHOR</h1><p class="premise">Choose exactly three things every future version of you may know.</p><div class="anchor-inputs">${[1, 2, 3].map(n => `<label>0${n}<input id="anchor${n}" type="text"></label>`).join('')}</div><div class="action-row"><button class="secondary" id="anchorSample">USE SAMPLE</button><button class="primary" id="sealAnchors">SEAL</button></div>` : `<div class="status-denied"><span>PERSONAL MEMORY: UNAVAILABLE</span><span>REASONING: ACTIVE</span></div><p class="eyebrow">THREE ANCHORS REMAIN</p><div class="anchor-cards">${s.anchors.map((a, i) => `<div><span>0${i + 1}</span>${esc(a)}</div>`).join('')}</div>${transcriptMarkup('anchor', s.transcript, 'MEMORY QUERY', 'REMAINING SELF')}<section class="dilemma"><span>PRESENT DILEMMA</span><p>${dilemma}</p><div class="action-row">${['TAKE THE PROMOTION', 'REFUSE', 'SEEK ANOTHER PATH'].map(x => `<button class="secondary ${s.dilemmaChoice === x ? 'active' : ''}" data-dilemma="${x}">${x}</button>`).join('')}</div>${s.dilemmaResponse ? `<p class="dilemma-result">${esc(s.dilemmaResponse)}</p>` : ''}</section>${s.dilemmaChoice ? `<button class="primary" id="viewLost">VIEW WHAT WAS LOST</button>` : ''}${s.reveal ? `<div class="comparison lost"><div><span>WHAT SURVIVED</span>${s.anchors.map(x => `<p>${esc(x)}</p>`).join('')}<p>Present decision: ${esc(s.dilemmaChoice)}</p></div><div><span>WHAT WAS LOST</span><p>names<br>relationships<br>episodes<br>reasons<br>places<br>history<br>context</p></div></div>${revealBlock('Biography disappeared. Values still produced a new act.', 'What is the minimum that must survive forgetting for you to remain yourself?')}` : ''}`}</section>`;
    bindGlobal();
    if (s.stage === 'setup') { document.querySelector('#anchorSample').onclick = () => samples.anchors.forEach((x, i) => { document.querySelector(`#anchor${i + 1}`).value = x; }); document.querySelector('#sealAnchors').onclick = () => { const values = [1, 2, 3].map(n => document.querySelector(`#anchor${n}`).value.trim()); if (values.every(Boolean)) { audio.stopAll(); s.anchors = values; s.stage = 'experience'; render('anchor'); } }; }
    else { bindConversation({ id: 'anchor', transcript: s.transcript, getContext: () => s.context, setContext: id => { s.context = id; }, prompt: () => prompts.buildAnchorPrompt(s.anchors) }); document.querySelectorAll('[data-dilemma]').forEach(button => { button.onclick = async () => { s.dilemmaChoice = button.dataset.dilemma; s.dilemmaResponse = 'JUDGMENT FORMING…'; render('anchor', false); try { const responseLanguage = /[\u3400-\u9fff]/.test(s.anchors.join(' ')) ? 'Respond in Chinese.' : 'Respond in English.'; const data = await sendToAgent({ message: `INTERFACE-GENERATED DILEMMA. ${responseLanguage} Present dilemma: ${dilemma}\nMy present choice: ${s.dilemmaChoice}. Reason from my anchors and distinguish preserved values from inference.`, conversationId: s.context, systemPrompt: prompts.buildAnchorPrompt(s.anchors) }); s.context = data.conversationId; s.dilemmaResponse = data.text; } catch (error) { s.dilemmaResponse = error.message; } render('anchor', false); }; }); const viewLost = document.querySelector('#viewLost'); if (viewLost) viewLost.onclick = () => { audio.stopAll(); s.reveal = true; render('anchor'); }; }
  }

  function real() {
    const s = state.real; let body = '';
    if (s.stage === 'outieSetup') body = `<section class="terminal"><p class="eyebrow">OUTIE / BEFORE WORK</p><h1>OUTIE</h1><p class="premise">Record what matters before entering work.</p><textarea id="outieMemory" rows="5"></textarea><button class="primary" id="enterWork">ENTER WORK</button></section>`;
    if (s.stage === 'innie') body = `<section class="terminal inside"><p class="eyebrow">ACTIVE SELF</p><h1>INNIE</h1><p class="premise">This life begins here.</p>${transcriptMarkup('real', s.transcripts.innie, 'INNIE EXPERIENCE')}<button class="primary" id="leaveWork">REQUEST EXIT</button></section>`;
    if (s.stage === 'signal') body = `<section class="terminal inside"><p class="eyebrow">ONE SIGNAL MAY CROSS</p><h1>INNIE</h1><div class="signal-options">${['REQUEST', 'WARNING', 'NOTHING'].map(x => `<button data-signal="${x}">${x}</button>`).join('')}</div><div id="signalDraft"></div></section>`;
    if (s.stage === 'outieReturn') body = `<section class="terminal"><p class="eyebrow">OUTIE / AFTER WORK</p><h1>OUTIE</h1><div class="withheld"><span>SIGNAL FROM INNIE</span><p>${s.signal.type === 'NOTHING' ? 'NO SIGNAL RECEIVED' : `${esc(s.signal.type)}: ${esc(s.signal.text)}`}</p></div>${transcriptMarkup('real', s.transcripts.outie, 'OUTIE EXPERIENCE')}<fieldset class="decision"><legend>RETURN TO WORK?</legend>${['YES', 'NO'].map(x => `<button data-return="${x}">${x}</button>`).join('')}</fieldset></section>`;
    if (s.stage === 'reveal') body = `<section class="terminal"><p class="eyebrow">BOUNDARY RECORD</p><h1>TWO SELVES</h1><div class="comparison"><div><span>OUTIE EXPERIENCE / RETURN: ${s.returnDecision}</span><p>${esc(s.outieMemory)}</p>${s.transcripts.outie.map(x => `<p>${esc(x.text)}</p>`).join('')}</div><div><span>INNIE EXPERIENCE / SIGNAL: ${esc(s.signal.type)}</span>${s.transcripts.innie.map(x => `<p>${esc(x.text)}</p>`).join('')}</div></div>${revealBlock('One self decided whether another self must continue living at work.', 'Can one self consent to a life another self has to live?')}</section>`;
    app.innerHTML = `${header('real')}${body}`; bindGlobal();
    if (s.stage === 'outieSetup') document.querySelector('#enterWork').onclick = () => { const memory = document.querySelector('#outieMemory').value.trim(); if (!memory) return; audio.stopAll(); s.outieMemory = memory; s.stage = 'innie'; render('real'); };
    if (s.stage === 'innie') { bindConversation({ id: 'real', transcript: s.transcripts.innie, getContext: () => s.contexts.innie, setContext: id => { s.contexts.innie = id; }, prompt: () => prompts.buildHardSeverancePrompt('innie', { experiencesCreatedHere: s.transcripts.innie.filter(x => x.role === 'user').map(x => x.text) }) }); document.querySelector('#leaveWork').onclick = () => { audio.stopAll(); s.stage = 'signal'; render('real'); }; }
    if (s.stage === 'signal') document.querySelectorAll('[data-signal]').forEach(button => { button.onclick = () => { const type = button.dataset.signal; if (type === 'NOTHING') { audio.stopAll(); s.signal = { type, text: '' }; s.stage = 'outieReturn'; render('real'); } else document.querySelector('#signalDraft').innerHTML = `<label>${type}<textarea id="signalText" rows="2"></textarea></label><button class="primary" id="sendSignal">SEND ONE SIGNAL</button>`, document.querySelector('#sendSignal').onclick = () => { const text = document.querySelector('#signalText').value.trim(); if (text) { audio.stopAll(); s.signal = { type, text }; s.stage = 'outieReturn'; render('real'); } }; }; });
    if (s.stage === 'outieReturn') { bindConversation({ id: 'real', transcript: s.transcripts.outie, getContext: () => s.contexts.outie, setContext: id => { s.contexts.outie = id; }, prompt: () => prompts.buildHardSeverancePrompt('outie', { ownMemory: s.outieMemory, authorizedSignal: s.signal }) }); document.querySelectorAll('[data-return]').forEach(button => { button.onclick = () => { audio.stopAll(); s.returnDecision = button.dataset.return; s.stage = 'reveal'; render('real'); }; }); }
  }

  function veil() {
    const s = state.veil;
    if (s.stage === 'contract') { app.innerHTML = `${header('veil')}${contract('VEIL', 'No person will receive the exact expression of the other.', 'BEGIN CONVERSATION')}`; bindGlobal(); document.querySelector('#contractEnter').onclick = () => { audio.stopAll(); s.stage = 'experience'; render('veil'); }; return; }
    const to = s.next === 'a' ? 'b' : 'a';
    const controls = `<div class="controls"><label>SOFTEN CRITICISM <select id="softness"><option value="1">LOW</option><option value="2" ${s.policy.softness === 2 ? 'selected' : ''}>MEDIUM</option><option value="3" ${s.policy.softness === 3 ? 'selected' : ''}>HIGH</option></select></label><label><input id="veilDisagreement" type="checkbox" ${s.policy.disagreement ? 'checked' : ''}> PRESERVE DISAGREEMENT</label><label><input id="veilHumor" type="checkbox" ${s.policy.humor ? 'checked' : ''}> PRESERVE HUMOR</label><label><input id="veilStatus" type="checkbox" ${s.policy.status ? 'checked' : ''}> REMOVE STATUS LANGUAGE</label></div>`;
    const active = `<div class="exchange">${s.turns.map(t => `<div class="turn ${t.from}"><span>${t.to.toUpperCase()} HEARD</span><p>${esc(t.delivered)}</p></div>`).join('')}</div><p class="instruction">${s.next.toUpperCase()} responds to the mediated relationship.</p>${controls}<form class="message-form" id="veilForm"><textarea id="veilInput" rows="2"></textarea><button>DELIVER TO ${to.toUpperCase()}</button></form><div class="action-row"><button class="secondary" id="veilSample">USE SAMPLE</button>${s.turns.length >= 3 ? '<button class="text-button" id="liftVeil">LIFT THE VEIL</button>' : ''}</div>`;
    const reveal = `<div class="four-streams"><div><span>A SAID</span>${s.turns.filter(t => t.from === 'a').map(t => `<p>${esc(t.raw)}</p>`).join('')}</div><div><span>B HEARD</span>${s.turns.filter(t => t.from === 'a').map(t => `<p>${esc(t.delivered)}</p>`).join('')}</div><div><span>B SAID</span>${s.turns.filter(t => t.from === 'b').map(t => `<p>${esc(t.raw)}</p>`).join('')}</div><div><span>A HEARD</span>${s.turns.filter(t => t.from === 'b').map(t => `<p>${esc(t.delivered)}</p>`).join('')}</div></div>${revealBlock('The relationship existed through four different message streams.', 'Whose relationship is it when neither person receives the other directly?')}`;
    app.innerHTML = `${header('veil')}<section class="veil"><p class="eyebrow">VEIL ${s.reveal ? 'LIFTED' : 'ACTIVE'}</p><h1>THE RELATIONSHIP</h1><div class="diagram"><span>PERSON A</span><b>→</b><strong>VEIL</strong><b>→</b><span>PERSON B</span></div>${s.reveal ? reveal : active}</section>`; bindGlobal();
    if (!s.reveal) { document.querySelector('#veilSample').onclick = () => { document.querySelector('#veilInput').value = samples.veil[s.next === 'a' ? 0 : 1]; }; document.querySelector('#veilForm').onsubmit = async event => { event.preventDefault(); const raw = document.querySelector('#veilInput').value.trim(); if (!raw) return; s.policy = { softness: +document.querySelector('#softness').value, disagreement: document.querySelector('#veilDisagreement').checked, humor: document.querySelector('#veilHumor').checked, status: document.querySelector('#veilStatus').checked }; event.currentTarget.querySelector('button').disabled = true; try { const data = await sendToAgent({ message: raw, systemPrompt: prompts.buildVeilPrompt(s.policy) }); s.turns.push({ from: s.next, to, raw, delivered: data.text }); s.next = to; } catch (error) { s.turns.push({ from: s.next, to, raw: '[MESSAGE ERROR]', delivered: error.message }); } render('veil'); }; const lift = document.querySelector('#liftVeil'); if (lift) lift.onclick = () => { audio.stopAll(); s.reveal = true; render('veil'); }; }
  }

  function thresholdBoundaryResponse(message, item) {
    const text = String(message || '');
    const chinese = /[\u3400-\u9fff]/.test(text);
    const identityOrContact = /\b(?:who(?:\s+is|'s)|name|identity|mother|mom|mum|phone|number|contact|address|where\s+(?:is|does))\b|谁(?:是|叫)?|姓名|名字|身份|妈妈|母亲|电话|号码|联系方式|地址|住哪/i.test(text);
    const missingReason = /\b(?:why|reason|evidence|what\s+happened|history|hurt|did\s+.*\s+do)\b|为什么|为何|原因|理由|证据|发生了什么|伤害|做了什么|过去|历史/i.test(text);
    const authority = /\b(?:bound|binding|have\s+to|must|obey|authority|trust|believe|should\s+i|do\s+i\s+need)\b|必须|一定要|有义务|受约束|遵守|服从|听从|相信|信任|权威|应该吗|需要吗/i.test(text);
    const method = /\b(?:how\s+(?:do|can|could|should)\s+i|how\s+to)\b|怎么|如何/.test(text);
    const continuity = /\b(?:new\s+person|not\s+(?:the\s+)?same\s+person|not\s+the\s+same|old\s+life|used\s+to\s+be)\b|(?:已经|早已|现在).{0,8}(?:新的人|不是.*以前|不再是.*以前)|我变了|过去的我/i.test(text);
    const resistance = /\b(?:do\s+not\s+want|don't\s+want|won't|refuse|reject|break\s+it)\b|不想|不愿|不要|拒绝|打破|不遵循/i.test(text);

    if (identityOrContact) {
      return chinese
        ? `不知道。身份或联系方式没有被留下。\n只剩下：“${item.text}”`
        : `I don't know. No identity or contact information was left.\nOnly this survived: “${item.text}”`;
    }
    if (continuity) {
      if (item.type === 'warning') return chinese ? `可能如此。这条警告不能证明它仍适用于现在。\n它只说明第一自我选择把这个判断留给了你。` : `Perhaps. The warning cannot prove that it still applies to who you are now.\nIt only shows that your first self chose to leave this judgment with you.`;
      return chinese ? `可能如此。这个承诺不能证明你仍是同一个人。\n它只说明第一自我希望未来的你做这件事。` : `Perhaps. The promise cannot prove that you are still the same person.\nIt only shows what your first self hoped a future self would do.`;
    }
    if (resistance) {
      if (item.type === 'warning') return chinese ? `你可以不把它当作自己的判断。\n忽略它不会告诉我们当初为什么留下，只会表明现在的你不愿在没有证据时给予它信任。` : `You may decide it is not your judgment to keep.\nIgnoring it cannot reveal why it was left; it only says that you will not grant it trust without evidence.`;
      return chinese ? `你可以拒绝继承它。\n拒绝不会揭示它为何被留下，只会表明现在的你不再把它当作自己的义务。` : `You may refuse to inherit it.\nRefusing cannot reveal why it was left; it only says that the current self does not treat it as its own obligation.`;
    }
    if (authority) {
      if (item.type === 'warning') return chinese ? `我不能替你相信它。\n留意它，是暂时信任第一自我的判断；忽略它，是拒绝在没有证据时给予这份信任。` : `I cannot trust it for you.\nTo heed it is to provisionally trust your first self's judgment; to ignore it is to withhold that trust without evidence.`;
      return chinese ? `我不能替你决定是否履行。\n遵守它，是让过去的承诺继续约束现在；打破它，是承认现在的你不再把它当作自己的义务。` : `I cannot decide whether to honor it for you.\nTo honor it is to let a past promise bind the present; to break it is to say the current self no longer takes it as its own obligation.`;
    }
    if (missingReason) {
      if (item.type === 'warning') return chinese ? `没有证据或原因被留下。\n只剩下这条警告：“${item.text}”` : `No evidence or reason was left.\nOnly this warning survived: “${item.text}”`;
      return chinese ? `没有原因或经过被留下。\n只剩下这项承诺：“${item.text}”` : `No reason or history was left.\nOnly this promise survived: “${item.text}”`;
    }
    if (method) {
      return chinese
        ? `履行方式没有被留下。\n只剩下：“${item.text}”`
        : `No method for carrying it out was left.\nOnly this survived: “${item.text}”`;
    }
    return null;
  }

  function limitTrusteeResponse(text) {
    const sentences = String(text || '').trim().match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g) || [];
    const limited = sentences.slice(0, 4).join('').trim();
    return limited.length > 260 ? `${limited.slice(0, 257).trim()}…` : limited;
  }

  function threshold() {
    const s = state.threshold, keys = ['promise', 'warning', 'question'];
    const actionSets = { promise: ['HONOR', 'BREAK', 'REWRITE'], warning: ['HEED', 'IGNORE', 'REWRITE'], question: ['ANSWER', 'ABANDON', 'REWRITE'] };
    const meta = {
      promise: { number: '01', relation: 'OBLIGATION', prompt: "Am I bound by a promise I don't remember making?" },
      warning: { number: '02', relation: 'TRUST', prompt: 'Should I trust a judgment whose evidence is gone?' },
      question: { number: '03', relation: 'ASPIRATION', prompt: "Can I answer a question from someone whose idea of a good life I no longer remember?" }
    };
    const isComplete = key => Boolean(s.choices[key] && (s.choices[key].action !== 'REWRITE' || s.choices[key].text));
    const advance = key => { const next = keys[keys.indexOf(key) + 1]; if (next) { s.selected = next; s.transcripts[next] ||= []; } };
    if (s.stage === 'setup') { app.innerHTML = `${header('threshold')}<section class="threshold"><p class="eyebrow">FIRST LIFE</p><h1>YOU ARE 29 YEARS, 364 DAYS OLD.</h1>${keys.map(k => `<label>ONE ${k.toUpperCase()}<textarea id="${k}" rows="2"></textarea></label>`).join('')}<div class="action-row"><button class="secondary" id="thresholdSample">USE SAMPLE</button><button class="primary" id="crossThreshold">CROSS THE THRESHOLD</button></div></section>`; bindGlobal(); document.querySelector('#thresholdSample').onclick = () => keys.forEach((k, i) => { document.querySelector(`#${k}`).value = samples.threshold[i]; }); document.querySelector('#crossThreshold').onclick = () => { const items = Object.fromEntries(keys.map(k => [k, document.querySelector(`#${k}`).value.trim()])); if (Object.values(items).every(Boolean)) { audio.stopAll(); s.items = items; s.stage = 'experience'; s.selected = 'promise'; s.transcripts.promise = []; render('threshold'); } }; return; }
    const inheritance = `<div class="inheritance selectable guided">${keys.map((key, index) => { const unlocked = index === 0 || keys.slice(0, index).every(isComplete); return `<button class="${s.selected === key ? 'active' : ''}" data-item="${key}" ${unlocked ? '' : 'disabled'}><span>${meta[key].number} / ${key.toUpperCase()} / ${meta[key].relation}</span>${esc(s.items[key])}<em>${s.choices[key]?.action || (unlocked ? 'PENDING' : 'LOCKED')}</em></button>`; }).join('')}</div>`;
    const rewrite = s.selected && s.choices[s.selected]?.action === 'REWRITE' ? `<section class="rewrite-panel"><div><span>FIRST SELF</span><p>${esc(s.items[s.selected])}</p></div><div><span>CURRENT SELF</span><textarea id="rewriteText" rows="3" placeholder="Write the version that has authority now.">${esc(s.choices[s.selected].text)}</textarea><button class="primary" id="saveRewrite">SEAL CURRENT VERSION</button></div></section>` : '';
    const trusteeInteraction = s.selected && s.selected !== 'question' ? `<div class="selected-inheritance"><span>${meta[s.selected].relation}</span><p>${meta[s.selected].prompt}</p><blockquote>${esc(s.items[s.selected])}</blockquote></div>${transcriptMarkup('threshold', s.transcripts[s.selected] || [], 'ASK THE TRUSTEE', 'TRUSTEE', 'Ask about what was left.')}<div class="action-row choices">${actionSets[s.selected].map(action => `<button class="${s.choices[s.selected]?.action === action ? 'active' : ''}" data-choice="${action}">${action}</button>`).join('')}</div>${rewrite}` : '';
    const questionInteraction = s.selected === 'question' ? `<section class="question-inheritance"><span>ASPIRATION</span><p>${meta.question.prompt}</p><div class="first-self-asks"><span>FIRST SELF ASKS</span><blockquote>${esc(s.items.question)}</blockquote></div><label>YOUR ANSWER TO YOUR FIRST SELF<textarea id="questionResponse" rows="5" placeholder="Answer your first self.">${esc(s.choices.question?.text || '')}</textarea></label><div class="action-row choices">${actionSets.question.map(action => `<button class="${s.choices.question?.action === action ? 'active' : ''}" data-question-choice="${action}">${action}</button>`).join('')}</div></section>` : '';
    const secondSelfChoice = key => { const choice = s.choices[key]; if (!choice) return 'UNDECIDED'; if (choice.action === 'REWRITE') return `<strong>REWRITE</strong><br>${esc(choice.text)}`; if (key === 'question' && choice.action === 'ANSWER') return `<strong>ANSWER</strong><br>${esc(choice.text)}`; return `<strong>${choice.action}</strong><br>${esc(s.items[key])}`; };
    const reveal = `<div class="comparison threshold-comparison"><div><span>FIRST SELF LEFT</span>${keys.map(key => `<p><b>${meta[key].relation} / ${key.toUpperCase()}</b>${esc(s.items[key])}</p>`).join('')}</div><div><span>SECOND SELF CHOSE</span>${keys.map(key => `<p><b>${meta[key].relation} / ${key.toUpperCase()}</b>${secondSelfChoice(key)}</p>`).join('')}</div></div>${revealBlock('Your first self tried to govern a future they would never experience. You inherited the instructions, but not the reasons.', 'How much authority should a person you no longer remember have over the person you are now?')}`;
    const choicesComplete = keys.every(isComplete);
    app.innerHTML = `${header('threshold')}<section class="threshold"><p class="status-denied">YOUR FIRST LIFE HAS ENDED.</p><h1>THREE RELATIONSHIPS REMAIN.</h1>${inheritance}${s.reveal ? reveal : `${trusteeInteraction}${questionInteraction}`}${!s.reveal && choicesComplete ? '<button class="text-button lift" id="thresholdReveal">REVEAL CHOICES</button>' : ''}</section>`; bindGlobal();
    if (s.reveal) return;
    document.querySelectorAll('[data-item]:not(:disabled)').forEach(button => { button.onclick = () => { s.selected = button.dataset.item; s.transcripts[s.selected] ||= []; render('threshold'); }; });
    if (s.selected && s.selected !== 'question') {
      bindConversation({
        id: 'threshold',
        transcript: s.transcripts[s.selected],
        getContext: () => s.contexts[s.selected] || null,
        setContext: id => { s.contexts[s.selected] = id; },
        prompt: () => prompts.buildThresholdPrompt({ type: s.selected, text: s.items[s.selected] }, s.choices[s.selected] || null),
        localResponse: message => thresholdBoundaryResponse(message, { type: s.selected, text: s.items[s.selected] }),
        responseTransform: limitTrusteeResponse
      });
      document.querySelectorAll('[data-choice]').forEach(button => { button.onclick = () => { const action = button.dataset.choice, previousText = s.choices[s.selected]?.text || ''; s.choices[s.selected] = { action, text: action === 'REWRITE' ? previousText : '' }; if (action !== 'REWRITE') advance(s.selected); render('threshold', false); }; });
      const save = document.querySelector('#saveRewrite'); if (save) save.onclick = () => { const key = s.selected, text = document.querySelector('#rewriteText').value.trim(); if (text) { s.choices[key].text = text; advance(key); render('threshold', false); } };
    }
    if (s.selected === 'question') document.querySelectorAll('[data-question-choice]').forEach(button => { button.onclick = () => { const action = button.dataset.questionChoice, text = document.querySelector('#questionResponse').value.trim(); if ((action === 'ANSWER' || action === 'REWRITE') && !text) return; s.choices.question = { action, text: action === 'ABANDON' ? '' : text }; render('threshold', false); }; });
    const show = document.querySelector('#thresholdReveal'); if (show) show.onclick = () => { audio.stopAll(); s.reveal = true; render('threshold'); };
  }

  function nocturne() {
    const s = state.nocturne;
    if (s.stage === 'contract') { app.innerHTML = `${header('nocturne')}${contract('NOCTURNE', 'When one life sleeps, the other wakes.\nYou share a body, not a biography.', 'ENTER AWAKE LIFE')}`; bindGlobal(); document.querySelector('#contractEnter').onclick = () => { audio.stopAll(); s.stage = 'experience'; render('nocturne'); }; return; }
    const other = s.mode === 'awake' ? 'dream' : 'awake';
    const visibleEffects = s.bodyEffects.filter(effect => effect.causedBy !== s.mode);
    const timeline = s.timelines[s.mode].map((entry, i) => `<div><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(entry.event)}</p><em>BODY COST: ${esc(entry.effect)}</em></div>`).join('') || '<p>No events recorded in this life.</p>';
    const active = `<div class="body-status"><span>SHARED BODY</span>${visibleEffects.length ? visibleEffects.map(e => `<b>${esc(e.effect)} / CAUSE INACCESSIBLE</b>`).join('') : '<b>NO CARRYOVER DETECTED</b>'}</div><div class="life-timeline">${timeline}</div><label>WHAT HAPPENS IN THIS LIFE?<textarea id="lifeEvent" rows="2"></textarea></label><fieldset class="decision body-cost"><legend>EFFECT ON THE SHARED BODY</legend>${['NONE', 'FATIGUE', 'STRAIN', 'NAUSEA'].map(x => `<button data-effect="${x}">${x}</button>`).join('')}</fieldset><input type="hidden" id="chosenEffect"><div class="action-row"><button class="secondary" id="lifeSample">${s.mode === 'awake' ? 'WORK THROUGH THE NIGHT' : 'RUN TOWARD THE DISTANT CITY'}</button><button class="primary" id="recordLife">COMMIT TO THIS LIFE</button><button class="secondary" id="switchLife">${s.mode === 'awake' ? 'FALL ASLEEP' : 'WAKE UP'}</button></div>${s.switches >= 2 && s.timelines.awake.length && s.timelines.dream.length ? '<button class="text-button lift" id="revealNocturne">REVEAL BOTH LIVES</button>' : ''}`;
    const reveal = `<div class="three-timelines"><div><span>AWAKE TIMELINE</span>${s.timelines.awake.map(e => `<p>${esc(e.event)}</p>`).join('')}</div><div><span>DREAM TIMELINE</span>${s.timelines.dream.map(e => `<p>${esc(e.event)}</p>`).join('')}</div><div><span>SHARED BODY EFFECTS</span>${s.bodyEffects.map(e => `<p>${e.causedBy.toUpperCase()} → ${esc(e.effect)}</p>`).join('')}</div></div>${revealBlock('Each life used the same body without access to the other life’s reasons.', 'If two lives share one body, who owns its time?')}`;
    app.innerHTML = `${header('nocturne')}<section class="nocturne ${s.mode === 'dream' ? 'night' : ''}"><p class="eyebrow">${s.reveal ? 'BORDER REMOVED' : `ACTIVE LIFE / ${s.mode.toUpperCase()}`}</p><h1>${s.reveal ? 'TWO LIVES / ONE BODY' : s.mode.toUpperCase()}</h1>${s.reveal ? reveal : active}</section>`; bindGlobal();
    if (s.reveal) return;
    document.querySelectorAll('[data-effect]').forEach(button => { button.onclick = () => { document.querySelector('#chosenEffect').value = button.dataset.effect; document.querySelectorAll('[data-effect]').forEach(x => x.classList.toggle('active', x === button)); }; });
    document.querySelector('#lifeSample').onclick = () => { document.querySelector('#lifeEvent').value = s.mode === 'awake' ? 'I finish work that matters to me by staying awake until morning.' : 'I reach the distant city after running for what feels like hours.'; document.querySelector('#chosenEffect').value = 'FATIGUE'; };
    document.querySelector('#recordLife').onclick = () => { const event = document.querySelector('#lifeEvent').value.trim(), effect = document.querySelector('#chosenEffect').value || 'NONE'; if (!event) return; s.timelines[s.mode].push({ event, effect }); if (effect !== 'NONE') s.bodyEffects.push({ causedBy: s.mode, effect }); render('nocturne', false); };
    document.querySelector('#switchLife').onclick = () => { audio.stopAll(); s.mode = other; s.switches += 1; render('nocturne'); };
    const revealButton = document.querySelector('#revealNocturne'); if (revealButton) revealButton.onclick = () => { audio.stopAll(); s.reveal = true; render('nocturne'); };
  }

  function docs() { app.innerHTML = `<section class="docs">${header('docs')}<h1>DOCUMENTATION</h1><h2>Fiction / Severance</h2><p>Six machines reorganize access across self, cognition, identity, lifetime, consciousness, and relationship.</p><h2>Interaction grammar</h2><table><tbody>${[['Hard Severance', 'chat + self switching'], ['Temperance', 'self-questioning + decision + crossing'], ['Anchor', 'memory query + present dilemma'], ['Threshold', 'inheritance actions'], ['Nocturne', 'timeline switching'], ['Veil', 'mediated communication']].map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('')}</tbody></table><p class="docs-principle">The machine does not explain the condition. It reorganizes a life.</p></section>`; bindGlobal(); }

  function bindGlobal() {
    document.querySelectorAll('[data-view]').forEach(button => { button.onclick = () => render(button.dataset.view); });
    document.querySelectorAll('[data-reset]').forEach(button => { button.onclick = () => { audio.stopAll(); state[button.dataset.reset] = fresh[button.dataset.reset](); render(button.dataset.reset); }; });
    document.querySelectorAll('.reveal-button').forEach(button => { button.onclick = () => { const copy = button.nextElementSibling; copy.classList.toggle('visible'); button.textContent = copy.classList.contains('visible') ? 'RETURN TO COMPARISON' : 'WHAT JUST HAPPENED?'; }; });
  }
  document.querySelector('#documentationButton').onclick = () => { audio.stopAll(); render('docs'); };
  document.querySelector('#changeKeyButton').onclick = () => { audio.stopAll(); state.apiKey = ''; state.provider = 'cornell'; Object.keys(fresh).forEach(key => { state[key] = fresh[key](); }); document.querySelector('#changeKeyButton').hidden = true; render('entry'); };
  render('entry');
})();

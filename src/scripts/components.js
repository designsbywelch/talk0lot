/* ========== HOME ========== */
export function Home(){
  return `
    <section class="home">
      <div>
        <p class="muted">Welcome to VENTLine. Tap <a href="#/compose">Compose</a> to start a vent.</p>
      </div>
    </section>
  `;
}

/* ========== COMPOSE ========== */
export function Compose(){
  return `
    <section class="compose">
      <div class="compose-frame">
        <div class="compose-header">
          <div class="chat-badge" aria-hidden="true">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" role="img">
              <rect x="6" y="6" width="60" height="44" rx="12" stroke="currentColor" stroke-width="4"/>
              <path d="M24 48 L24 62 L36 52" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="28" cy="26" r="3.2" fill="currentColor"/>
              <circle cx="44" cy="26" r="3.2" fill="currentColor"/>
              <path d="M28 34 C32 38, 40 38, 44 34" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
          <h2>Compose</h2>
          <div class="spacer"></div>
        </div>

        <form id="vent-form" class="compose-body">
          <textarea id="vent-text" rows="6" maxlength="500"
            placeholder="Really need to vent right now. Was hoping to speak with a Gen Z male about family, relationship, co-worker problems. I prefer video or voice over email."></textarea>
        </form>

        <div class="compose-footer">
          <div class="prefs">
            <label><input type="checkbox" id="prefVideo" checked> Video</label>
            <label><input type="checkbox" id="prefVoice"> Voice</label>
            <label><input type="checkbox" id="prefText"> Text</label>
            <select id="prefMatch" aria-label="Match preference">
              <option value="">No preference</option>
              <option value="genz-male">Gen Z male</option>
              <option value="genz-female">Gen Z female</option>
              <option value="veteran">Veteran</option>
            </select>
          </div>

          <div class="send-wrap">
            <span id="charCount" class="charcount">0/500</span>
            <button type="button" id="clear-vent" class="btn btn-outline">Clear</button>
            <button type="submit" form="vent-form" id="sendBtn" class="btn btn-primary">SEND</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ========== INBOX ========== */
export function Inbox(vents = []){
  const items = vents.map(v => `
    <article class="card">
      <time>${new Date(v.ts).toLocaleString()}</time>
      <p>${escapeHtml(v.text)}</p>
    </article>
  `).join("") || `<p class="muted">No vents yet. <a href="#/compose">Compose one</a>.</p>`;

  return `
    <section class="inbox">
      <h2>Inbox</h2>
      <div class="list">${items}</div>
    </section>
  `;
}

/* ========== SETTINGS ========== */
export function Settings(hasPass){
  return `
    <section class="settings">
      <h2>Settings</h2>

      ${!hasPass ? `
        <h3>Create Passcode</h3>
        <form id="set-pass">
          <input id="first-pass" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit passcode" required />
          <input id="first-pass-2" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm passcode" required />
          <button class="btn btn-primary" type="submit">Set Passcode</button>
        </form>
      ` : `
        <h3>Change Passcode</h3>
        <form id="change-pass">
          <input id="current-pass" type="password" inputmode="numeric" maxlength="4" placeholder="Current passcode" required />
          <input id="new-pass" type="password" inputmode="numeric" maxlength="4" placeholder="New passcode" required />
          <input id="new-pass-2" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm new passcode" required />
          <button class="btn btn-primary" type="submit">Change Passcode</button>
        </form>
        <button id="lock-now" class="btn btn-outline">Lock Now</button>
      `}
    </section>
  `;
}

/* ========== LOCK ========== */
export function Lock(needsCreate, digits=0){
  if (needsCreate){
    return `
      <section class="lock">
        <h2>Create Passcode</h2>
        <form id="create-pass-form">
          <input id="create-pass-1" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit passcode" required />
          <input id="create-pass-2" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm passcode" required />
          <button class="btn btn-primary" type="submit">Save</button>
        </form>
      </section>
    `;
  }

  const dots = Array.from({length:4}, (_,i)=> `<span class="dot ${i < digits ? 'fill' : ''}"></span>`).join("");

  return `
    <section class="lock">
      <h2>Unlock</h2>
      <div class="dots">${dots}</div>
      <div class="keypad">
        ${["1","2","3","4","5","6","7","8","9","←","0","✓"].map(k =>
          `<div class="key" data-key="${k}">${k}</div>`).join("")}
      </div>
    </section>
  `;
}

/* util */
function escapeHtml(s=""){
  return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c] ));
}

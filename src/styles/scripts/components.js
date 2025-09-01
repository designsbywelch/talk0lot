// ----- SCREENS (HTML as strings) -----
export const Home = () => `
  <section class="card screen">
    <h2>Home</h2>
    <p>Welcome to VENTLine. Tap <strong>Compose</strong> to draft a vent, or <strong>Inbox</strong> to see saved vents.</p>
  </section>
`;

export const Compose = () => `
  <section class="card screen">
    <h2>Compose Vent</h2>
    <form id="vent-form">
      <textarea id="vent-text" rows="6" placeholder="Get it off your chest…" style="width:100%;"></textarea>
      <div class="form-row">
        <button type="submit" id="save-vent">Save</button>
        <button type="button" id="clear-vent">Clear</button>
      </div>
    </form>
  </section>
`;

export const Inbox = (items=[]) => `
  <section class="card screen">
    <h2>Inbox</h2>
    ${items.length === 0 ? `<p>No vents yet.</p>` : `
      <ul>
        ${items.map((v,i)=>`<li style="margin:10px 0;"><strong>#${i+1}</strong> — ${v.text}</li>`).join("")}
      </ul>
    `}
  </section>
`;

export const Settings = (hasPass) => `
  <section class="card screen">
    <h2>Settings</h2>
    <p>Security</p>
    <div style="margin-top:10px;">
      ${hasPass ? `
        <form id="change-pass">
          <input type="password" id="current-pass" placeholder="Current passcode" />
          <div class="form-row">
            <input type="password" id="new-pass" placeholder="New passcode" />
            <input type="password" id="new-pass-2" placeholder="Confirm new passcode" />
          </div>
          <div class="form-row">
            <button type="submit">Change Passcode</button>
            <button type="button" id="lock-now">Lock Now</button>
          </div>
        </form>
      ` : `
        <form id="set-pass">
          <input type="password" id="first-pass" placeholder="Create a passcode" />
          <div class="form-row">
            <input type="password" id="first-pass-2" placeholder="Confirm passcode" />
            <button type="submit">Set Passcode</button>
          </div>
        </form>
      `}
      <p class="small">Stored locally on this device. Don’t rely on this for sensitive secrets.</p>
    </div>
  </section>
`;

export const Lock = (needsCreate=false, digits=0) => `
  <section class="card screen lock-wrap">
    <h2>${needsCreate ? "Create Passcode" : "Enter Passcode"}</h2>
    ${needsCreate ? `
      <form id="create-pass-form" style="margin-top:12px;">
        <input type="password" id="create-pass-1" placeholder="Passcode" />
        <div class="form-row">
          <input type="password" id="create-pass-2" placeholder="Confirm" />
          <button type="submit">Save</button>
        </div>
      </form>
    ` : `
      <div class="pin-dots">
        ${[0,1,2,3].map(i => `<div class="pin-dot ${i < digits ? "filled":""}"></div>`).join("")}
      </div>
      <div class="keypad">
        ${[1,2,3,4,5,6,7,8,9,"←",0,"✓"].map(k => `
          <button type="button" class="key" data-key="${k}">${k}</button>
        `).join("")}
      </div>
      <p class="small">Tip: Use Settings → Change Passcode anytime.</p>
    `}
  </section>
`;

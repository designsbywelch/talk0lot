import { Home, Compose, Inbox, Settings, Lock } from "./components.js";

export class Router {
  constructor(mountEl){
    this.mountEl = mountEl;
    this.routes = {
      "/": () => Home(),
      "/compose": () => Compose(),
      "/inbox": () => Inbox(this.getVents()),
      "/settings": () => Settings(this.hasPasscode()),
      "/lock": () => this.renderLock(),
    };
  }

  // ---- Auth helpers ----
  hasPasscode(){ return !!localStorage.getItem("vl_pass"); }
  isAuthed(){ return sessionStorage.getItem("vl_authed") === "1"; }
  setAuthed(v){ v ? sessionStorage.setItem("vl_authed","1") : sessionStorage.removeItem("vl_authed"); }

  // ---- Vents storage ----
  getVents(){
    try { return JSON.parse(localStorage.getItem("vents") || "[]"); }
    catch { return []; }
  }
  saveVents(list){ localStorage.setItem("vents", JSON.stringify(list)); }

  start(){
    window.addEventListener("hashchange", () => this.render());
    // On first load, route to lock if passcode exists and not authed
    if (this.hasPasscode() && !this.isAuthed()) location.hash = "#/lock";
    this.render();
  }

  getPath(){
    const hash = location.hash.replace(/^#/, "");
    return hash || "/";
  }

  render(){
    const path = this.getPath();

    // Gate all routes behind lock when passcode exists
    if (this.hasPasscode() && !this.isAuthed() && path !== "/lock"){
      location.hash = "#/lock";
      return;
    }

    const view = this.routes[path] ? this.routes[path]() : Home();
    // Special case lock since it needs dynamic digits
    if (path !== "/lock") this.mountEl.innerHTML = view;
    this.wireActions(path);
  }

  renderLock(){
    // If no pass set, show create form
    const needsCreate = !this.hasPasscode();
    this.mountEl.innerHTML = Lock(needsCreate, 0);
    return "";
  }

  navigate(path){ location.hash = `#${path}`; }

  wireActions(path){
    // Compose form
    if (path === "/compose"){
      const form = document.getElementById("vent-form");
      const textarea = document.getElementById("vent-text");
      const clearBtn = document.getElementById("clear-vent");
      form?.addEventListener("submit", (e)=>{
        e.preventDefault();
        const text = (textarea?.value || "").trim();
        if(!text) return alert("Type something first, chief.");
        const list = this.getVents();
        list.unshift({ text, ts: Date.now() });
        this.saveVents(list);
        textarea.value = "";
        this.navigate("/inbox");
      });
      clearBtn?.addEventListener("click", ()=> textarea && (textarea.value = ""));
    }

    // Settings: set/change/lock
    if (path === "/settings"){
      const $ = id => document.getElementById(id);

      const setForm = $("set-pass");
      setForm?.addEventListener("submit", (e)=>{
        e.preventDefault();
        const a = $("first-pass")?.value || "";
        const b = $("first-pass-2")?.value || "";
        if (!a || a !== b) return alert("Passcodes must match.");
        localStorage.setItem("vl_pass", a);
        alert("Passcode set.");
        this.navigate("/lock"); // demonstrate lock
      });

      const changeForm = $("change-pass");
      changeForm?.addEventListener("submit", (e)=>{
        e.preventDefault();
        const cur = $("current-pass")?.value || "";
        const saved = localStorage.getItem("vl_pass") || "";
        if (cur !== saved) return alert("Current passcode is incorrect.");
        const n1 = $("new-pass")?.value || "";
        const n2 = $("new-pass-2")?.value || "";
        if (!n1 || n1 !== n2) return alert("New passcodes must match.");
        localStorage.setItem("vl_pass", n1);
        alert("Passcode changed.");
      });

      $("lock-now")?.addEventListener("click", ()=>{
        this.setAuthed(false);
        this.navigate("/lock");
      });
    }

    // Lock screen: create or enter
    if (path === "/lock"){
      // Create flow
      const createForm = document.getElementById("create-pass-form");
      if (createForm){
        createForm.addEventListener("submit", (e)=>{
          e.preventDefault();
          const a = document.getElementById("create-pass-1")?.value || "";
          const b = document.getElementById("create-pass-2")?.value || "";
          if (!a || a !== b) return alert("Passcodes must match.");
          localStorage.setItem("vl_pass", a);
          this.setAuthed(true);
          this.navigate("/");
        });
        return;
      }

      // Enter flow (keypad)
      const saved = localStorage.getItem("vl_pass") || "";
      let entry = "";
      const updateDots = ()=>{
        this.mountEl.innerHTML = Lock(false, entry.length);
        wireKeys();
      };
      const wireKeys = ()=>{
        document.querySelectorAll(".key").forEach(btn=>{
          btn.addEventListener("click", ()=>{
            const k = btn.dataset.key;
            if (k === "←") { entry = entry.slice(0,-1); updateDots(); }
            else if (k === "✓") {
              if (entry === saved){
                this.setAuthed(true);
                this.navigate("/");
              } else {
                entry = ""; updateDots();
                alert("Wrong passcode.");
              }
            } else {
              if (entry.length < 4) { entry += String(k); updateDots(); }
            }
          });
        });
      };
      updateDots();
    }
  }
}

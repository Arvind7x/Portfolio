/* LIVE backend — Firestore realtime database (no Storage needed: images ride inside the doc).
   Site: newest data wins (live > browser > file), updates appear without refresh.
   Admin: Save publishes worldwide in seconds. No push ever (for data). */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBsvLn-t1RvJ1sTpHo6_nwU0lqb4uz64RI",
  authDomain: "leabert-portfolio.firebaseapp.com",
  projectId: "leabert-portfolio",
  storageBucket: "leabert-portfolio.firebasestorage.app",
  messagingSenderId: "392006082082",
  appId: "1:392006082082:web:e16fb037dd386391dcb47b"
};
window.WRITE_TOKEN = "void-live-write-4821-xq97";

window.LiveDB = (function () {
  var db = null, started = false;
  function init() {
    if (started) return !!db;
    started = true;
    try {
      if (!window.firebase || !window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey) return false;
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      db = firebase.firestore();
      return true;
    } catch (e) { return false; }
  }
  function ref() { return db.collection("site").doc("content"); }
  // One-shot read with timeout (null = offline / not configured / empty).
  function loadLive(ms) {
    if (!init()) return Promise.resolve(null);
    var done = false;
    return new Promise(function (res) {
      var timer = setTimeout(function () { if (!done) { done = true; res(null); } }, ms || 7000);
      ref().get().then(function (s) {
        if (done) return; done = true; clearTimeout(timer);
        res(s && s.exists ? (s.data() || null) : null);
      }).catch(function () { if (!done) { done = true; clearTimeout(timer); res(null); } });
    });
  }
  // Realtime: fires immediately with current data, again on every change.
  // Returns an unsubscribe function (no-op when unavailable).
  function subscribe(cb) {
    if (!init()) return function () {};
    try {
      return ref().onSnapshot(function (s) {
        try { cb(s && s.exists ? s.data() : null); } catch (e) {}
      }, function () {});
    } catch (e) { return function () {}; }
  }
  // Publish whole site doc. Stamps updatedAt + write token (rules enforce it).
  function saveLive(data) {
    if (!init()) return Promise.reject(new Error("no-db"));
    var payload = {};
    try { payload = JSON.parse(JSON.stringify(data)); } catch (e) { payload = data; }
    payload.updatedAt = Date.now();
    payload.writeToken = window.WRITE_TOKEN;
    return ref().set(payload).then(function () { return payload.updatedAt; });
  }
  return { loadLive: loadLive, subscribe: subscribe, saveLive: saveLive };
})();

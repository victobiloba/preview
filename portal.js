/**
 * EagleView Help Center
 *
 * Renders the guides in guides-data.js (generated from guides/*.md by
 * scripts/build-portal.js) as a Notion Help Center style portal.
 * Edit the Markdown, rebuild, and the portal follows. Never edit guides-data.js by hand.
 */
(function () {
  'use strict';

  const APP_URL = 'http://216.126.239.188:3000/login';

  // Optional: a form (e.g. Microsoft Forms) that collects "Was this resource helpful?" votes.
  // When set, the vote buttons open it with ?guide=<id>&vote=up|down. Left empty, the widget is hidden.
  const FEEDBACK_FORM_URL = '';

  // One entry per guides/ folder, in display order. A new folder without an entry still
  // appears, titled from its guides' `category` frontmatter. `tint` picks one of Notion's
  // tinted card colours; `featured` puts the card in the header's Guides menu.
  const CATEGORIES = [
    { folder: '00-getting-started', slug: 'getting-started', title: 'Getting started', role: 'Everyone', icon: 'compass', tint: 'teal', illo: 'start',
      blurb: 'Sign in, find your role, change your password and see how the year works.',
      description: 'Sign in, find your way around, see what your role can do, manage your account and learn how cycles, ratings and statuses work. Start here, whatever your role.' },
    { folder: '01-staff', slug: 'staff', title: 'Staff & officers', role: 'Staff & officers', icon: 'user', tint: 'red', illo: 'staff', featured: true,
      blurb: 'KPI contract, self-appraisal, sign-off, check-ins and 360° feedback.',
      description: 'What every EagleView user does: KPI contract, self-appraisal, sign-off and disputes, check-ins, 360° feedback, PIPs, appeals, rewards and promotion.' },
    { folder: '02-line-managers', slug: 'managers', title: 'Line managers', role: 'Line managers', icon: 'users', tint: 'green', illo: 'managers', featured: true,
      blurb: 'Division Heads and above: KPIs, appraisals, PIPs and the 9-Box grid.',
      description: 'For Division Heads, Directors, Group Directors, Executive Directors, the Executive Chairman and Admin: Manager View and accreditation, approving and cascading team KPIs, reviewing appraisals, check-ins and PIPs, 360° panels, the 9-Box Talent Grid and Reports & Insights.' },
    { folder: '03-executives', slug: 'executives', title: 'Executive governance', card: 'Executives', role: 'Executives', icon: 'landmark', tint: 'yellow', illo: 'executives', featured: true,
      blurb: 'Revenue, bonus eligibility, regional impact and talent risk.',
      description: 'For Executive Directors, the Executive Chairman and Admin. The Executive Command Center: bonus eligibility pulse, revenue performance, regional impact, talent risk and strategic business units.' },
    { folder: '04-system-administration', slug: 'administration', title: 'Administration', role: 'Administrators', icon: 'sliders', tint: 'purple', illo: 'admin',
      blurb: 'Cycles, calibration, promotions, users and system settings.',
      description: 'For the Executive Chairman and Admin: national goals and performance cycles, HR calibration and PIP reviews, promotion exercises and upgrading, users, roles and accreditation, bonus rules, help content and global settings.' },
  ];

  const POPULAR = [
    { id: 'your-role-in-eagleview', title: 'Your role', desc: 'See your pages, whose work you review and which guides are for you.', icon: 'users' },
    { id: 'kpi-contract-and-goals', title: 'KPI contract', desc: 'Draft your Performance Contract and submit it for approval.', icon: 'target' },
    { id: 'self-appraisal', title: 'Self-appraisal', desc: 'Record your KPI results with evidence, then rate your competencies.', icon: 'clipboard' },
    { id: 'appraisal-results-and-sign-off', title: 'Sign-off & disputes', desc: 'Agree with your evaluation, add evidence or raise a dispute.', icon: 'checkSquare' },
    { id: 'check-ins', title: 'Check-ins', desc: 'Log 1-on-1s with goal status, blockers and action items.', icon: 'trending' },
    { id: '360-feedback', title: '360° feedback', desc: 'Nominate your panel, give feedback and rate your manager.', icon: 'message' },
  ];

  const PILLS = [
    { id: 'signing-in-and-finding-your-way', label: 'Signing in' },
    { id: 'account-password-and-help', label: 'Change password' },
    { id: 'rewards-and-promotion-passport', label: 'Rewards & bonus' },
    { id: 'appeals', label: 'Appeals' },
    { id: 'the-performance-year', label: 'Performance year' },
  ];

  // Line icons (Lucide-style paths, ISC licence).
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.75-1.4"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r=".8"/><circle cx="4" cy="12" r=".8"/><circle cx="4" cy="18" r=".8"/>',
    panelClose: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18m7-6-3-3 3-3"/>',
    panelOpen: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18m5-12 3 3-3 3"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    landmark: '<path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2.5 10h19L12 3z"/>',
    sliders: '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    checkSquare: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    trending: '<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    lifebuoy: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24m0-14.14-4.24 4.24m-5.66 5.66-4.24 4.24"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  };

  function icon(name, size = 16, strokeWidth = 1.75) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.book}</svg>`;
  }

  // ---------- Illustrations (original, drawn in the style of Notion's feature cards) ----------
  function frame(x, y, w, h) {
    return `<rect class="i-solid" x="${x + 5}" y="${y + 5}" width="${w}" height="${h}" rx="4"/>` +
      `<rect class="i-paper" x="${x}" y="${y}" width="${w}" height="${h}" rx="4" stroke-width="3"/>` +
      `<path class="i-line" d="M${x} ${y + 14}h${w}" stroke-width="3"/>` +
      [9, 16, 23].map(d => `<circle class="i-solid" cx="${x + d}" cy="${y + 7}" r="2"/>`).join('');
  }
  const gearTeeth = (cx, cy) => [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const t = a * Math.PI / 180;
    return `M${(cx + 10 * Math.cos(t)).toFixed(1)} ${(cy + 10 * Math.sin(t)).toFixed(1)}L${(cx + 14 * Math.cos(t)).toFixed(1)} ${(cy + 14 * Math.sin(t)).toFixed(1)}`;
  }).join('');
  const ILLOS = {
    start: () => frame(30, 12, 150, 96) +
      '<rect class="i-paper" x="46" y="38" width="88" height="14" rx="3" stroke-width="2"/>' +
      '<rect class="i-paper" x="46" y="58" width="88" height="14" rx="3" stroke-width="2"/>' +
      '<path class="i-line" d="M52 45h28M52 65h18" stroke-width="2"/>' +
      '<rect class="i-acc" x="46" y="80" width="52" height="16" rx="4" fill="#2a9d99" stroke-width="2"/>' +
      '<circle class="i-acc" cx="180" cy="86" r="22" fill="#bde6e4" stroke-width="3"/>' +
      '<circle class="i-dark" cx="172" cy="86" r="7" fill="#ffffff" stroke-width="2.5"/>' +
      '<path class="i-dark" d="M179 86h15m-5 0v6m5-6v5" fill="none" stroke-width="2.5"/>',
    staff: () => frame(30, 12, 150, 96) +
      [[40, 70], [60, 46], [80, 84]].map(([y, w]) =>
        `<rect class="i-paper" x="44" y="${y}" width="100" height="10" rx="5" stroke-width="2"/>` +
        `<rect class="i-acc" x="44" y="${y}" width="${w}" height="10" rx="5" fill="#f2837c" stroke-width="2"/>`).join('') +
      '<circle class="i-paper" cx="182" cy="32" r="22" stroke-width="3"/>' +
      '<circle class="i-acc" cx="182" cy="32" r="13" fill="#fbc4c0" stroke-width="2"/>' +
      '<circle class="i-acc" cx="182" cy="32" r="5" fill="#d6312b" stroke-width="2"/>' +
      '<path class="i-line" d="M186 28l14-14m-7 0h7v7" stroke-width="3"/>',
    managers: () => frame(30, 12, 150, 96) +
      [38, 58, 78].map((y, i) =>
        `<rect class="i-paper" x="44" y="${y}" width="12" height="12" rx="2" stroke-width="2"/>` +
        (i < 2 ? `<path class="i-line" d="M47 ${y + 6}l3 3 6-6" stroke-width="2.5"/>` : '') +
        `<path class="i-line" d="M64 ${y + 6}h${[60, 44, 52][i]}" stroke-width="3"/>`).join('') +
      '<rect class="i-acc" x="158" y="72" width="42" height="42" rx="6" fill="#f64932" stroke-width="3"/>' +
      '<path class="i-white" d="M168 93l8 8 16-17" stroke-width="4"/>',
    executives: () => frame(30, 12, 150, 96) +
      '<path class="i-line" d="M44 98h112" stroke-width="2.5"/>' +
      [[50, 18], [72, 32], [94, 24], [116, 44], [138, 58]].map(([x, h], i) =>
        `<rect class="i-acc" x="${x}" y="${98 - h}" width="14" height="${h}" rx="2" fill="${i === 4 ? '#ffb110' : '#ffd786'}" stroke-width="2"/>`).join('') +
      '<circle class="i-paper" cx="182" cy="32" r="22" stroke-width="3"/>' +
      '<path class="i-line" d="M170 44h24M172 41V30m6 11V30m6 11V30m6 11V30M169 27h26l-13-9z" stroke-width="2.2"/>',
    admin: () => frame(30, 12, 150, 96) +
      [[38, true], [58, false], [78, true]].map(([y, on]) =>
        `<rect class="${on ? 'i-acc' : 'i-paper'}" x="44" y="${y}" width="28" height="14" rx="7"${on ? ' fill="#ad6ded"' : ''} stroke-width="2"/>` +
        `<circle class="i-paper" cx="${on ? 65 : 51}" cy="${y + 7}" r="4.5" stroke-width="2"/>` +
        `<path class="i-line" d="M82 ${y + 7}h50" stroke-width="3"/>`).join('') +
      '<circle class="i-acc" cx="180" cy="86" r="22" fill="#eadbfa" stroke-width="3"/>' +
      `<path class="i-dark" d="${gearTeeth(180, 86)}" fill="none" stroke-width="3.5"/>` +
      '<circle class="i-dark" cx="180" cy="86" r="8" fill="#ffffff" stroke-width="2.5"/>',
  };
  const illo = kind => `<svg class="illo" viewBox="0 0 220 126" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${(ILLOS[kind] || ILLOS.start)()}</svg>`;

  function bannerArt() {
    const base = 'M104 196h200l16 18H88z';
    return `<svg class="illo" viewBox="0 0 394 244" aria-hidden="true">
      <defs><pattern id="nrsDots" width="6" height="6" patternUnits="userSpaceOnUse"><circle class="i-solid" cx="3" cy="3" r="1.15"/></pattern></defs>
      <path class="i-line" d="M16 214h362" stroke-width="3"/>
      <path class="i-acc" d="M44 214l7-36h34l7 36z" fill="#ffd786" stroke-width="3"/>
      <path class="i-acc" d="M68 178c-24-8-32-38-26-58 18 10 28 32 26 58z" fill="#abe5b8" stroke-width="2.5"/>
      <path class="i-acc" d="M68 178c14-18 32-26 44-50 6 22-10 42-44 50z" fill="#68ce7e" stroke-width="2.5"/>
      <path class="i-acc" d="M84 46l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="#ffc95e" stroke-width="2"/>
      <rect class="i-solid" x="121" y="83" width="176" height="118" rx="6"/>
      <rect class="i-paper" x="116" y="78" width="176" height="118" rx="6" stroke-width="3"/>
      <path class="i-line" d="M116 96h176" stroke-width="3"/>
      <circle class="i-solid" cx="127" cy="87" r="2.5"/><circle class="i-solid" cx="136" cy="87" r="2.5"/><circle class="i-solid" cx="145" cy="87" r="2.5"/>
      <rect class="i-acc" x="132" y="150" width="16" height="28" rx="2" fill="#fbc4c0" stroke-width="2"/>
      <rect class="i-acc" x="156" y="134" width="16" height="44" rx="2" fill="#f2837c" stroke-width="2"/>
      <rect class="i-acc" x="180" y="142" width="16" height="36" rx="2" fill="#fbc4c0" stroke-width="2"/>
      <rect class="i-acc" x="204" y="122" width="16" height="56" rx="2" fill="#d6312b" stroke-width="2"/>
      <path class="i-line" d="M128 178h100" stroke-width="2"/>
      <path class="i-line" d="M238 122h40M238 136h30M238 150h36M238 164h22" stroke-width="3"/>
      <path class="i-paper" d="${base}" stroke-width="3"/>
      <path d="${base}" fill="url(#nrsDots)"/>
      <path class="i-line" d="${base}" stroke-width="3"/>
      <rect class="i-solid" x="291" y="25" width="78" height="50" rx="6"/>
      <rect class="i-paper" x="286" y="20" width="78" height="50" rx="6" stroke-width="3"/>
      <circle class="i-acc" cx="306" cy="45" r="11" fill="#ffd786" stroke-width="2.5"/>
      <path class="i-line" d="M300 45l4 4 8-9" stroke-width="2.5"/>
      <path class="i-line" d="M324 39h28M324 51h20" stroke-width="3"/>
      <rect class="i-acc" x="330" y="176" width="30" height="38" rx="4" fill="#ff8b7c" stroke-width="3"/>
      <path class="i-line" d="M360 184c11 0 11 20 0 20" stroke-width="3"/>
      <path class="i-line" d="M338 166c-6-8 6-12 0-20m14 20c-6-8 6-12 0-20" stroke-width="2.5"/>
    </svg>`;
  }

  // ---------- Data ----------
  const GUIDES = Array.isArray(window.NRS_GUIDES) ? window.NRS_GUIDES : [];

  const categories = CATEGORIES.map(c => ({ ...c, guides: GUIDES.filter(g => g.folder === c.folder) }));
  for (const g of GUIDES) {
    if (!categories.some(c => c.folder === g.folder)) {
      const title = g.category || g.folder.replace(/^\d+-/, '').replace(/-/g, ' ');
      categories.push({ folder: g.folder, slug: g.folder.replace(/^\d+-/, ''), title, role: title, icon: 'book', tint: 'green', illo: 'start', blurb: '', description: '', guides: GUIDES.filter(x => x.folder === g.folder) });
    }
  }
  categories.sort((a, b) => a.folder.localeCompare(b.folder));
  const categoryOf = g => categories.find(c => c.folder === g.folder);
  const shownCategories = () => categories.filter(c => c.guides.length);

  // ---------- Storage (may be unavailable in private windows) ----------
  function storageGet(area, key) { try { return window[area].getItem(key); } catch (e) { return null; } }
  function storageSet(area, key, value) { try { window[area].setItem(key, value); } catch (e) { /* ignore */ } }
  function storageRemove(area, key) { try { window[area].removeItem(key); } catch (e) { /* ignore */ } }

  // ---------- Executive (stealth) guides ----------
  // Guides with `stealth: true` ship encrypted (see scripts/build-portal.js) and stay out
  // of navigation and search until their PIN decrypts them. A 4-digit PIN slows a
  // determined reader down but cannot stop one; host the portal privately for real protection.
  const PIN_STORE = 'nrs_exec_pins';
  const rendered = new Map();
  let searchIndex = null;

  const isVisible = g => !g.stealth || typeof g.body === 'string';
  const visibleGuides = c => c.guides.filter(isVisible);
  const isLockedCategory = c => c.guides.length > 0 && visibleGuides(c).length === 0;
  const hasStealth = GUIDES.some(g => g.stealth);
  const hasLocked = () => GUIDES.some(g => !isVisible(g));
  const vaultLabel = () => (hasLocked() ? 'Executive access' : 'Lock executive guides');
  const fromBase64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const savedPins = () => { try { return JSON.parse(storageGet('sessionStorage', PIN_STORE) || '[]'); } catch (e) { return []; } };

  async function unlockWith(pin) {
    if (!(window.crypto && window.crypto.subtle)) throw new Error('insecure-context');
    const groups = new Map();
    for (const g of GUIDES) {
      if (!g.stealth || isVisible(g) || !g.locked) continue;
      const k = `${g.locked.salt}|${g.locked.iterations}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(g);
    }
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
    let opened = 0;
    for (const list of groups.values()) {
      const { salt, iterations } = list[0].locked;
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: fromBase64(salt), iterations, hash: 'SHA-256' },
        material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      for (const g of list) {
        let plain;
        try { plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(g.locked.iv) }, key, fromBase64(g.locked.data)); }
        catch (e) { break; } // wrong PIN for this group
        Object.assign(g, JSON.parse(new TextDecoder().decode(plain)));
        rendered.delete(g.id);
        opened++;
      }
    }
    if (opened) {
      searchIndex = null;
      const pins = savedPins();
      if (!pins.includes(pin)) storageSet('sessionStorage', PIN_STORE, JSON.stringify([...pins, pin]));
    }
    return opened;
  }

  function lockAll() {
    for (const g of GUIDES) {
      if (!g.stealth) continue;
      delete g.title; delete g.category; delete g.role; delete g.body;
      rendered.delete(g.id);
    }
    searchIndex = null;
    storageRemove('sessionStorage', PIN_STORE);
  }

  // ---------- Text helpers ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function htmlToText(html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }
  function truncate(s, n) { return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; }
  function stripMd(s) {
    return s.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  }
  function slugify(s) {
    return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
  }
  function formatDate(s) {
    const d = new Date(`${s}T00:00:00Z`);
    return isNaN(d) ? s : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }

  // ---------- Markdown ----------
  const RE = {
    fence: /^\s*```\s*([\w-]*)\s*$/,
    fenceClose: /^\s*```\s*$/,
    heading: /^(#{1,6})\s+(.+?)\s*#*\s*$/,
    hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
    quote: /^\s*>/,
    list: /^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/,
    // ![[SS-XXX: Description]] or the Obsidian image form ![[SS-XXX.png|Description]]
    placeholder: /^\s*!\[\[(SS-[A-Z]+-\d+)(?:\.(png|jpe?g|webp|gif))?\s*(?:[:|]\s*([^\]]+?))?\s*\]\]\s*$/i,
    tableRow: /^\s*\|/,
    tableDivider: /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/,
  };
  const indentOf = l => l.match(/^[ \t]*/)[0].replace(/\t/g, '    ').length;

  function startsBlock(line, next) {
    return RE.fence.test(line) || RE.heading.test(line) || RE.hr.test(line) || RE.quote.test(line) ||
      RE.placeholder.test(line) || RE.list.test(line) ||
      (RE.tableRow.test(line) && next !== undefined && RE.tableDivider.test(next));
  }

  function inline(text) {
    const codes = [];
    let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
    s = escapeHtml(s);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const external = /^https?:\/\//i.test(href);
      const safe = external || /^(#|mailto:|\.{0,2}\/)/i.test(href) ? href : '#';
      return `<a href="${safe}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    });
    s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, '$1<em>$2</em>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codes[+i])}</code>`);
  }

  function newContext() {
    return { depth: 0, titleSkipped: false, seenH2: false, prologue: null, headings: [], ids: new Map() };
  }
  const childContext = ctx => Object.assign(Object.create(ctx), { depth: ctx.depth + 1 });

  function headingId(text, ctx) {
    const base = 'h-' + (slugify(stripMd(text)) || 'section');
    const n = ctx.ids.get(base) || 0;
    ctx.ids.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  }

  const CALLOUTS = {
    NOTE: ['💡', ''], INFO: ['💡', ''], TIP: ['💡', ''], IMPORTANT: ['📌', ''],
    WARNING: ['⚠️', 'is-warning'], CAUTION: ['🛑', 'is-caution'], DANGER: ['🛑', 'is-caution'],
  };
  function callout(type, inner) {
    const [emoji, cls] = CALLOUTS[type] || CALLOUTS.NOTE;
    return `<div class="callout ${cls}"><span class="callout-icon" aria-hidden="true">${emoji}</span><div class="callout-body">${inner}</div></div>`;
  }

  function screenshot(tag, desc, ext) {
    const d = escapeHtml(desc);
    return `<figure class="media" data-tag="${tag}" data-ext="${escapeHtml(ext)}">` +
      `<img alt="${d || tag}" hidden>` +
      `<button type="button" class="media-placeholder" data-copy="${d ? `![[${tag}: ${d}]]` : `![[${tag}]]`}" data-tag="${tag}" title="Copy the placeholder tag">` +
      `${icon('camera', 26, 1.5)}<span class="ph-tag">${tag}</span>${d ? `<span class="ph-desc">${d}</span>` : ''}<span class="ph-hint">Screenshot pending</span>` +
      `</button></figure>`;
  }

  function table(rows) {
    const cells = r => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    const head = cells(rows[0]).map(c => `<th>${inline(c)}</th>`).join('');
    const body = rows.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
    return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function parseList(lines, start, ctx) {
    const first = lines[start].match(RE.list);
    const base = indentOf(lines[start]);
    const ordered = /\d/.test(first[2]);
    const startNumber = ordered ? parseInt(first[2], 10) : 1;
    const items = [];
    let i = start;
    while (i < lines.length) {
      let j = i;
      while (j < lines.length && !lines[j].trim()) j++;
      const m = j < lines.length ? lines[j].match(RE.list) : null;
      if (!m || indentOf(lines[j]) !== base || /\d/.test(m[2]) !== ordered) break;
      i = j;
      const contentColumn = lines[i].length - m[3].length;
      const body = [m[3]];
      for (i++; i < lines.length; i++) {
        const l = lines[i];
        if (!l.trim()) {
          let k = i + 1;
          while (k < lines.length && !lines[k].trim()) k++;
          if (k < lines.length && indentOf(lines[k]) > base) { body.push(''); continue; }
          break;
        }
        const ind = indentOf(l);
        if (ind <= base) break;
        body.push(l.slice(Math.min(ind, contentColumn)));
      }
      items.push(body);
    }
    const tag = ordered ? 'ol' : 'ul';
    const startAttr = ordered && startNumber !== 1 ? ` start="${startNumber}"` : '';
    const lis = items.map(body => {
      let inner = parseBlocks(body, childContext(ctx));
      const single = inner.match(/^<p>([\s\S]*)<\/p>$/);
      if (single && !single[1].includes('<p>')) inner = single[1];
      return `<li>${inner}</li>`;
    }).join('');
    return { html: `<${tag}${startAttr}>${lis}</${tag}>`, next: i };
  }

  function parseBlocks(lines, ctx) {
    let html = '';
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;

      if ((m = line.match(RE.fence))) {
        const lang = m[1].toLowerCase();
        const buf = [];
        for (i++; i < lines.length && !RE.fenceClose.test(lines[i]); i++) buf.push(lines[i]);
        i++;
        const pad = Math.min(...buf.filter(l => l.trim()).map(indentOf), Infinity);
        const code = buf.map(l => l.slice(isFinite(pad) ? pad : 0)).join('\n');
        html += lang === 'mermaid'
          ? `<div class="diagram"><pre class="mermaid">${escapeHtml(code)}</pre></div>`
          : `<pre><code>${escapeHtml(code)}</code></pre>`;
        continue;
      }

      if ((m = line.match(RE.heading))) {
        i++;
        const level = m[1].length;
        // The page title comes from frontmatter, so the guide's own H1 is skipped.
        if (level === 1 && ctx.depth === 0 && !ctx.titleSkipped) { ctx.titleSkipped = true; continue; }
        const id = headingId(m[2], ctx);
        const tag = `h${Math.min(Math.max(level, 2), 4)}`;
        if (ctx.depth === 0 && tag === 'h2') {
          ctx.seenH2 = true;
          ctx.headings.push({ id, text: escapeHtml(stripMd(m[2])) });
        }
        html += `<${tag} id="${id}">${inline(m[2])}</${tag}>`;
        continue;
      }

      // Section rules are dropped: Notion separates sections with heading spacing.
      if (RE.hr.test(line)) { i++; continue; }

      if (RE.quote.test(line)) {
        const buf = [];
        while (i < lines.length && RE.quote.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
        const cm = buf[0].match(/^\[!(\w+)\][+-]?\s*(.*)$/);
        if (cm) {
          const body = cm[2] ? [cm[2], ...buf.slice(1)] : buf.slice(1);
          html += callout(cm[1].toUpperCase(), parseBlocks(body, childContext(ctx)));
        } else {
          html += `<blockquote>${parseBlocks(buf, childContext(ctx))}</blockquote>`;
        }
        continue;
      }

      if ((m = line.match(RE.placeholder))) { i++; html += screenshot(m[1].toUpperCase(), m[3] || '', (m[2] || 'png').toLowerCase()); continue; }

      if (RE.tableRow.test(line) && i + 1 < lines.length && RE.tableDivider.test(lines[i + 1])) {
        const rows = [line];
        for (i += 2; i < lines.length && RE.tableRow.test(lines[i]); i++) rows.push(lines[i]);
        html += table(rows);
        continue;
      }

      if (RE.list.test(line)) {
        const r = parseList(lines, i, ctx);
        html += r.html;
        i = r.next;
        continue;
      }

      const buf = [line];
      for (i++; i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1]); i++) buf.push(lines[i]);
      const para = buf.map((l, k) => inline(l.trim()) + (k < buf.length - 1 ? (/ {2,}$/.test(l) ? '<br>' : ' ') : '')).join('');
      // The first paragraph before any section becomes the "In this guide" summary.
      if (ctx.depth === 0 && ctx.prologue === null && !ctx.seenH2) { ctx.prologue = para; continue; }
      html += `<p>${para}</p>`;
    }
    return html;
  }

  function renderGuide(g) {
    if (!rendered.has(g.id)) {
      const ctx = newContext();
      const html = parseBlocks(g.body.split('\n'), ctx);
      rendered.set(g.id, { html, headings: ctx.headings, prologue: ctx.prologue, excerpt: ctx.prologue ? htmlToText(ctx.prologue) : '' });
    }
    return rendered.get(g.id);
  }

  // ---------- Search ----------
  function plainText(md) {
    return md
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[\[SS-[A-Z]+-\d+(?:\.\w+)?\s*(?:[:|]\s*([^\]]+?))?\s*\]\]/gi, '$1')
      .replace(/^\s*>\s?(\[!\w+\])?/gm, '')
      .replace(/^\s*([-*+]|\d{1,3}[.)])\s+/gm, '')
      .replace(/^\s*\|?\s*:?-{3,}.*$/gm, '')
      .replace(/^\s*-{3,}\s*$/gm, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`|#]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Mirrors parseBlocks' heading ids so results can deep-link to a section.
  function sectionsOf(g) {
    const ctx = newContext();
    const sections = [{ id: null, heading: '', lines: [] }];
    let inFence = false;
    for (const line of g.body.split('\n')) {
      if (/^\s*```/.test(line)) inFence = !inFence;
      const m = !inFence && line.match(RE.heading);
      if (m) {
        if (m[1].length === 1 && !ctx.titleSkipped) { ctx.titleSkipped = true; continue; }
        sections.push({ id: headingId(m[2], ctx), heading: stripMd(m[2]), lines: [] });
        continue;
      }
      sections[sections.length - 1].lines.push(line);
    }
    return sections
      .map(s => { const text = plainText(s.lines.join('\n')); return { id: s.id, heading: s.heading, text, lower: `${s.heading} ${text}`.toLowerCase() }; })
      .filter(s => s.text || s.heading);
  }

  function getIndex() {
    if (!searchIndex) {
      searchIndex = GUIDES.filter(isVisible).map(g => {
        const category = categoryOf(g);
        const sections = sectionsOf(g);
        return { guide: g, category, sections, lower: [g.title, category.title, g.role, ...sections.map(s => s.lower)].join(' ').toLowerCase() };
      });
    }
    return searchIndex;
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    const terms = [...new Set(q.split(/\s+/).filter(Boolean))];
    const results = [];
    for (const entry of getIndex()) {
      if (!terms.every(t => entry.lower.includes(t))) continue;
      const title = entry.guide.title.toLowerCase();
      let score = title.includes(q) ? 50 : 0;
      for (const t of terms) {
        if (title.includes(t)) score += 12;
        if (entry.category.title.toLowerCase().includes(t)) score += 4;
      }
      let best = entry.sections[0] || null;
      let bestScore = -1;
      for (const s of entry.sections) {
        const head = s.heading.toLowerCase();
        let sc = s.lower.includes(q) ? 10 : 0;
        for (const t of terms) {
          if (head.includes(t)) sc += 6;
          if (s.lower.includes(t)) sc += 2;
        }
        if (sc > bestScore) { bestScore = sc; best = s; }
      }
      results.push({ entry, section: best, score: score + bestScore });
    }
    return { terms, q, items: results.sort((a, b) => b.score - a.score).slice(0, 20) };
  }

  function highlight(text, terms) {
    if (!terms.length) return escapeHtml(text);
    const re = new RegExp(`(${terms.map(escapeRe).sort((a, b) => b.length - a.length).join('|')})`, 'gi');
    return text.split(re).map((part, i) => (i % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part))).join('');
  }

  function snippet(text, q, terms) {
    const lower = text.toLowerCase();
    let at = lower.indexOf(q);
    if (at < 0) at = Math.min(...terms.map(t => { const k = lower.indexOf(t); return k < 0 ? Infinity : k; }));
    if (!isFinite(at)) at = 0;
    const start = Math.max(0, at - 50);
    const end = Math.min(text.length, at + 150);
    return highlight(`${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`, terms);
  }

  // ---------- DOM ----------
  const $ = id => document.getElementById(id);
  const content = $('content');
  const nav = $('nav');
  const menuBtn = $('menuBtn');
  const mobileMenu = $('mobileMenu');
  const searchOverlay = $('searchOverlay');
  const searchInput = $('searchInput');
  const searchResults = $('searchResults');
  const vaultOverlay = $('vaultOverlay');
  const vaultForm = $('vaultForm');
  const vaultInput = $('vaultInput');
  const vaultError = $('vaultError');
  const vaultSubmit = vaultForm.querySelector('[type="submit"]');
  const lightbox = $('lightbox');
  const toastEl = $('toast');

  let lastFocus = null;
  let toastTimer = 0;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')); } catch (e) { reject(e); } finally { ta.remove(); }
    });
  }

  const syncScrollLock = () => document.body.classList.toggle('is-locked-scroll',
    !searchOverlay.hidden || !vaultOverlay.hidden || !lightbox.hidden || !mobileMenu.hidden);

  function breadcrumbs(items) {
    return `<nav aria-label="Breadcrumb"><ol class="breadcrumbs">${items.map(it =>
      `<li>${it.href ? `<a href="${it.href}">${escapeHtml(it.label)}</a>` : `<span>${escapeHtml(it.label)}</span>`}</li>`).join('')}</ol></nav>`;
  }
  const mobileSearchButton = () => `<button type="button" class="mobile-search" data-action="search">${icon('search', 16)} Search</button>`;

  function tintCard(c, row = false) {
    const locked = isLockedCategory(c);
    const inner = `<span class="tint-media">${illo(c.illo)}</span>` +
      `<span class="tint-text"><span class="tint-title">${escapeHtml(c.card || c.title)}${locked ? icon('lock', 16) : ''}</span>` +
      `${c.blurb ? `<span class="tint-desc">${escapeHtml(c.blurb)}</span>` : ''}</span>`;
    const cls = `tint-card tint-${c.tint}${row ? ' is-row' : ''}`;
    return locked
      ? `<button type="button" class="${cls}" data-action="vault" aria-label="Unlock ${escapeHtml(c.title)}">${inner}</button>`
      : `<a class="${cls}" href="#/category/${c.slug}">${inner}</a>`;
  }

  function articleRow(g) {
    return `<li class="article-row">
      <a class="card-anchor" href="#/article/${g.id}" aria-label="${escapeHtml(g.title)}"></a>
      <div>
        <div class="article-row-title">${escapeHtml(g.title)}</div>
        <p class="article-row-desc">${escapeHtml(truncate(renderGuide(g).excerpt, 170))}</p>
      </div>
      <span class="arrow">${icon('arrow', 16)}</span>
    </li>`;
  }

  // ---------- Pages ----------
  function renderHome() {
    document.title = 'EagleView Help Center';
    const byId = id => GUIDES.find(g => g.id === id && isVisible(g));
    const pills = PILLS.filter(p => byId(p.id)).map(p => `<a class="pill" href="#/article/${p.id}">${escapeHtml(p.label)}</a>`).join('');
    const topics = POPULAR.filter(t => byId(t.id)).map(t => `
      <div class="topic-card">
        <a class="card-anchor" href="#/article/${t.id}" aria-label="${escapeHtml(t.title)}"></a>
        <div class="topic-title">${escapeHtml(t.title)}</div>
        <p class="topic-desc">${escapeHtml(t.desc)}</p>
        <div class="topic-image">${icon(t.icon, 56, 1.15)}</div>
      </div>`).join('');

    // "Recently updated": newest guides, one per role, skipping the getting-started basics.
    const recent = [];
    const seen = new Set();
    for (const g of GUIDES.filter(isVisible).slice().sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''))) {
      const c = categoryOf(g);
      if (seen.has(c.folder) || c.slug === 'getting-started') continue;
      seen.add(c.folder);
      recent.push(g);
      if (recent.length === 2) break;
    }
    const recentCards = recent.map(g => {
      const c = categoryOf(g);
      return `<div class="wn-card">
        <a class="card-anchor" href="#/article/${g.id}" aria-label="${escapeHtml(g.title)}"></a>
        <div class="wn-image tint-${c.tint}">${illo(c.illo)}</div>
        <div class="wn-title">${escapeHtml(g.title)}</div>
        <p class="wn-desc">${escapeHtml(truncate(renderGuide(g).excerpt, 130))}</p>
      </div>`;
    }).join('');

    const exec = categories.find(c => c.guides.some(g => g.stealth));
    const execOption = !exec ? '' : hasLocked()
      ? `<button type="button" class="contact-option" data-action="vault"><span class="contact-icon">${icon('lock', 30, 1.5)}</span>
          <span class="option-title">Executive access</span><span class="option-desc">Unlock the restricted executive guides</span></button>`
      : `<a class="contact-option" href="#/category/${exec.slug}"><span class="contact-icon">${icon('unlock', 30, 1.5)}</span>
          <span class="option-title">Executive guides</span><span class="option-desc">Open the executive governance guides</span></a>`;

    content.className = 'content';
    content.innerHTML = `
      <section class="hero">
        <h1>Hi, how can we <span class="accent">help</span> you?</h1>
        <div class="hero-search">
          <label class="hero-search-box">
            ${icon('search', 24, 1.75)}
            <span class="visually-hidden">Search the Help Center</span>
            <input type="text" id="heroSearch" readonly data-action="search" placeholder="Search for anything…" autocomplete="off">
          </label>
        </div>
        <div class="pills">${pills}</div>
      </section>
      <section class="section">
        <h2 class="section-title">Popular topics</h2>
        <div class="topics-grid">${topics}</div>
      </section>
      <section class="section">
        <h2 class="section-title">Browse by role</h2>
        <div class="roles-grid">${shownCategories().map(c => tintCard(c)).join('')}</div>
      </section>
      <section class="section">
        <div class="banner">
          <div>
            <h2>Eagle<span class="accent">View</span> Essentials</h2>
            <p>New to EagleView? Learn the performance year end to end, from setting KPIs and check-ins to appraisals, calibration and promotion.</p>
            <a class="btn btn-primary" href="#/article/the-performance-year">Start learning</a>
          </div>
          <div class="banner-art">${bannerArt()}</div>
        </div>
      </section>
      ${recentCards ? `
      <section class="section">
        <div class="wn-header">
          <h2 class="section-title">Recently updated</h2>
          <a class="btn btn-secondary" href="#/guides">View all</a>
        </div>
        <div class="wn-grid">${recentCards}</div>
      </section>` : ''}
      <section class="contact">
        <h2 class="contact-title">Still have questions?</h2>
        <div class="contact-grid">
          <a class="contact-option" href="${APP_URL}" target="_blank" rel="noopener noreferrer"><span class="contact-icon">${icon('external', 30, 1.5)}</span>
            <span class="option-title">Open EagleView</span><span class="option-desc">Sign in to the live E-PMS app</span></a>
          <a class="contact-option" href="#/article/signing-in-and-finding-your-way"><span class="contact-icon">${icon('lifebuoy', 30, 1.5)}</span>
            <span class="option-title">Trouble signing in</span><span class="option-desc">Reset a forgotten password</span></a>
          ${execOption}
        </div>
      </section>`;
    afterRender();
    return { home: true };
  }

  function renderCategory(slug) {
    const c = categories.find(x => x.slug === slug);
    if (!c || !c.guides.length) return renderNotFound();
    if (isLockedCategory(c)) return renderLocked();
    document.title = `${c.title} – EagleView Help Center`;
    content.className = 'content';
    content.innerHTML = `
      ${mobileSearchButton()}
      ${breadcrumbs([{ label: 'Help Center', href: '#/' }, { label: c.title }])}
      <h1 class="article-title">${escapeHtml(c.title)}</h1>
      ${c.description ? `<p class="category-desc">${escapeHtml(c.description)}</p>` : ''}
      <ul class="article-list">${visibleGuides(c).map(articleRow).join('')}</ul>`;
    afterRender();
    return { category: c };
  }

  function renderAllGuides() {
    document.title = 'All guides – EagleView Help Center';
    const groups = shownCategories().map(c => (isLockedCategory(c)
      ? `<section class="all-group"><h2>${icon('lock', 20)} ${escapeHtml(c.title)}</h2>
          <p class="article-row-desc">Restricted to Executive Management.</p>
          <button type="button" class="btn btn-secondary btn-sm" data-action="vault" style="margin-top:12px">Unlock</button></section>`
      : `<section class="all-group"><h2><a href="#/category/${c.slug}">${escapeHtml(c.title)}</a></h2>
          <ul class="article-list">${visibleGuides(c).map(articleRow).join('')}</ul></section>`)).join('');
    content.className = 'content';
    content.innerHTML = `
      ${mobileSearchButton()}
      ${breadcrumbs([{ label: 'Help Center', href: '#/' }, { label: 'All guides' }])}
      <h1 class="article-title">All guides</h1>
      <p class="category-desc">Every EagleView guide, grouped by who it’s for.</p>
      ${groups}`;
    afterRender();
    return { all: true };
  }

  function nextGuide(g) {
    const order = categories.flatMap(visibleGuides);
    const i = order.findIndex(x => x.id === g.id);
    return i >= 0 && i < order.length - 1 ? order[i + 1] : null;
  }

  function renderArticle(id, sectionId) {
    const g = GUIDES.find(x => x.id === id);
    if (!g) return renderNotFound();
    if (!isVisible(g)) return renderLocked();
    const c = categoryOf(g);
    document.title = `${g.title} – EagleView Help Center`;

    const r = renderGuide(g);
    const next = nextGuide(g);
    let feedback = '';
    if (FEEDBACK_FORM_URL) {
      const vote = v => { const u = new URL(FEEDBACK_FORM_URL); u.searchParams.set('guide', g.id); u.searchParams.set('vote', v); return escapeHtml(u.href); };
      feedback = `<section class="rating"><span class="smallcaps">Give feedback</span><h3>Was this resource helpful?</h3>
        <div class="rating-buttons"><a class="rating-btn" href="${vote('up')}" target="_blank" rel="noopener noreferrer" aria-label="Yes">👍</a><a class="rating-btn" href="${vote('down')}" target="_blank" rel="noopener noreferrer" aria-label="No">👎</a></div></section>`;
    }

    content.className = 'content';
    content.innerHTML = `
      ${mobileSearchButton()}
      <div class="article-topbar">
        ${breadcrumbs([{ label: 'Help Center', href: '#/' }, { label: c.title, href: `#/category/${c.slug}` }])}
        ${r.headings.length ? `<button type="button" class="btn btn-secondary btn-sm toc-toggle" data-action="toggle-toc" aria-controls="tocDrawer" aria-expanded="false">${icon('list', 16)} Contents</button>` : ''}
      </div>
      <article class="article-body">
        <header class="article-hero">
          <h1 class="article-title">${escapeHtml(g.title)}</h1>
          <div class="article-meta">
            ${g.role ? `<span class="role-chip">${escapeHtml(g.role)}</span>` : ''}
            ${g.lastUpdated ? `<span>Updated ${escapeHtml(formatDate(g.lastUpdated))}</span>` : ''}
            ${g.stealth ? `<span>${icon('lock', 14)} Restricted</span>` : ''}
          </div>
        </header>
        ${r.prologue ? `
        <section class="prologue">
          <span class="smallcaps">In this guide</span>
          <p class="prologue-copy">${r.prologue}</p>
        </section>
        <hr class="article-divider">` : ''}
        <div class="rt">${r.html}</div>
        ${feedback}
        ${next ? `
        <section class="up-next">
          <span class="smallcaps">Up next</span>
          <h3>${escapeHtml(next.title)}</h3>
          <p>${escapeHtml(truncate(renderGuide(next).excerpt, 150))}</p>
          <a class="btn btn-tertiary" href="#/article/${next.id}">Read more <span class="arrow">${icon('arrow', 16)}</span></a>
        </section>` : ''}
      </article>`;
    setToc(r.headings.map(h => `<li class="toc-item" data-toc="${h.id}"><a class="toc-link" href="#/article/${g.id}/${h.id}" data-section="${h.id}">${h.text}</a></li>`));
    afterRender(sectionId);
    return { category: c, guideId: g.id };
  }

  function renderLocked() {
    document.title = 'Restricted – EagleView Help Center';
    content.className = 'content';
    content.innerHTML = `
      ${breadcrumbs([{ label: 'Help Center', href: '#/' }])}
      <div class="locked-panel">
        <div class="lock-icon">${icon('lock', 32, 1.5)}</div>
        <h1 class="article-title">Restricted guide</h1>
        <p class="category-desc">This guide is only available to Executive Management. Enter your executive PIN to continue.</p>
        <button type="button" class="btn btn-primary" data-action="vault">Unlock executive guides</button>
      </div>`;
    afterRender();
    return {};
  }

  function renderNotFound() {
    document.title = 'Not found – EagleView Help Center';
    content.className = 'content';
    content.innerHTML = `
      ${breadcrumbs([{ label: 'Help Center', href: '#/' }])}
      <div class="locked-panel">
        <h1 class="article-title">We couldn’t find that page</h1>
        <p class="category-desc">The guide may have moved or been renamed. Try searching, or go back to the Help Center.</p>
        <a class="btn btn-primary" href="#/">Back to Help Center</a>
      </div>`;
    afterRender();
    return {};
  }

  function renderEmpty() {
    content.className = 'content';
    content.innerHTML = `<div class="locked-panel"><h1 class="article-title">No guides found</h1>
      <p class="category-desc">guides-data.js is missing or empty. Run <code>node scripts/build-portal.js</code> in the project folder, then reload.</p></div>`;
  }

  // ---------- After render: screenshots, diagrams ----------
  function hydrateMedia(root) {
    root.querySelectorAll('figure.media[data-tag]').forEach(fig => {
      const probe = new Image();
      probe.onload = () => {
        const img = fig.querySelector('img');
        img.src = probe.src;
        img.hidden = false;
        fig.querySelector('.media-placeholder').hidden = true;
      };
      probe.src = `assets/${fig.dataset.tag}.${fig.dataset.ext || 'png'}`;
    });
  }

  let mermaidLoad = null;
  function renderDiagrams(root) {
    const nodes = [...root.querySelectorAll('pre.mermaid')];
    if (!nodes.length) return;
    nodes.forEach(n => {
      if (n.dataset.src === undefined) n.dataset.src = n.textContent;
      else { n.textContent = n.dataset.src; n.removeAttribute('data-processed'); n.classList.remove('is-fallback'); }
    });
    mermaidLoad = mermaidLoad || new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
      s.onload = () => (window.mermaid ? resolve(window.mermaid) : reject(new Error('mermaid missing')));
      s.onerror = reject;
      document.head.appendChild(s);
    });
    mermaidLoad.then(mermaid => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: currentTheme() === 'dark' ? 'dark' : 'neutral', fontFamily: 'NotionInter, Inter, sans-serif' });
      return mermaid.run({ nodes: nodes.filter(n => n.isConnected) });
    }).catch(() => nodes.forEach(n => n.classList.add('is-fallback')));
  }

  function afterRender(sectionId) {
    hydrateMedia(content);
    renderDiagrams(content);
    const target = sectionId && document.getElementById(sectionId);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  // ---------- Contents side panel (hidden until the reader opens it) ----------
  let tocWanted = false;
  let tocAvailable = false;
  let stopTocTracking = null;

  function applyToc() {
    const open = tocWanted && tocAvailable;
    document.body.classList.toggle('toc-open', open);
    $('tocDrawer').setAttribute('aria-hidden', String(!open));
    document.querySelectorAll('.toc-toggle').forEach(b => b.setAttribute('aria-expanded', String(open)));
  }
  function toggleToc(force) {
    tocWanted = typeof force === 'boolean' ? force : !tocWanted;
    applyToc();
  }
  function setToc(items) {
    tocAvailable = items.length > 0;
    $('tocNav').innerHTML = tocAvailable ? `<ul class="toc-list">${items.join('')}</ul>` : '';
    applyToc();
    trackToc();
  }

  function trackToc() {
    if (stopTocTracking) stopTocTracking();
    stopTocTracking = null;
    const items = [...$('tocNav').querySelectorAll('.toc-item')];
    if (!items.length) return;
    const heads = items.map(li => document.getElementById(li.dataset.toc)).filter(Boolean);
    const update = () => {
      let current = heads[0];
      for (const h of heads) if (h.getBoundingClientRect().top < 140) current = h;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = heads[heads.length - 1];
      items.forEach(li => li.classList.toggle('is-active', !!current && li.dataset.toc === current.id));
    };
    let frameId = 0;
    const onScroll = () => { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    stopTocTracking = () => window.removeEventListener('scroll', onScroll);
  }

  // ---------- Chrome: sidebar, header menus, mobile menu, footer ----------
  const openToggles = new Set();
  let mobileTreeOpen = false;

  function sidebarTree(current) {
    return shownCategories().map(c => {
      const locked = isLockedCategory(c);
      const label = `<span class="toggle-label">${locked ? icon('lock', 14) : ''}${escapeHtml(c.title)}</span><span class="toggle-icon">${icon('chevron', 14, 2)}</span>`;
      if (locked) {
        return `<li class="toggle"><button type="button" class="toggle-btn" data-action="vault" title="Unlock ${escapeHtml(c.title)}">${label}</button></li>`;
      }
      const open = openToggles.has(c.folder);
      const links = visibleGuides(c).map(g => `<li><a href="#/article/${g.id}"${g.id === current.guideId ? ' class="is-active" aria-current="page"' : ''}>${escapeHtml(g.title)}</a></li>`).join('');
      return `<li class="toggle${open ? ' is-open' : ''}">
        <button type="button" class="toggle-btn" data-toggle="${c.folder}" aria-expanded="${open}">${label}</button>
        <ul class="toggle-list">${links}<li class="see-all-item"><a href="#/category/${c.slug}"${current.category === c && !current.guideId ? ' class="is-active"' : ''}>See all</a></li></ul>
      </li>`;
    }).join('');
  }

  function renderChrome(current) {
    // Like Notion, only the section you're in starts expanded.
    openToggles.clear();
    if (current.category) openToggles.add(current.category.folder);
    const shown = shownCategories();
    const popular = POPULAR.filter(t => GUIDES.some(g => g.id === t.id && isVisible(g)));
    const label = vaultLabel();
    const vaultItem = cls => (hasStealth ? `<li><button type="button" class="${cls}" data-action="vault" data-vault-label>${label}</button></li>` : '');

    $('sidebarNav').innerHTML = `
      <ul class="side-section"><li><span class="nav-heading">Help Center</span></li>${sidebarTree(current)}</ul>
      <ul class="side-section">
        <li><span class="nav-heading">Learn</span></li>
        <li><a class="side-link" href="#/article/the-performance-year">Start with the basics</a></li>
        <li><a class="side-link" href="#/guides">All guides</a></li>
      </ul>
      <ul class="side-section">
        <li><span class="nav-heading">Support</span></li>
        <li><a class="side-link" href="${APP_URL}" target="_blank" rel="noopener noreferrer">Open the E-PMS app ${icon('external', 14)}</a></li>
        <li><a class="side-link" href="#/article/signing-in-and-finding-your-way">Trouble signing in</a></li>
        ${vaultItem('side-link')}
      </ul>`;

    // Header "Guides" menu: Notion's tinted feature cards plus the footer band.
    const featured = shown.filter(c => c.featured);
    const start = shown.find(c => c.slug === 'getting-started');
    const admin = shown.find(c => c.slug === 'administration');
    $('ddGuides').innerHTML = `
      <div class="dd-head"><span class="dd-heading">Guides by role</span><a class="see-all" href="#/guides">See all guides ${icon('arrow', 12, 2)}</a></div>
      <div class="dd-grid">${featured.map(c => tintCard(c)).join('')}</div>
      <div class="dd-foot">
        ${start ? `<span>${icon('compass', 14)} New to EagleView? <a href="#/category/${start.slug}">Getting started ${icon('arrow', 12, 2)}</a></span>` : ''}
        ${admin ? `<span>${icon('sliders', 14)} Administrators: <a href="#/category/${admin.slug}">Administration guides ${icon('arrow', 12, 2)}</a></span>` : ''}
      </div>`;

    $('ddResources').innerHTML = `
      <div class="res-grid">
        <div class="res-col"><span class="res-heading">Guides for</span><ul class="res-big">${shown.map(c => `<li>${isLockedCategory(c)
          ? `<button type="button" data-action="vault">${escapeHtml(c.role)} ${icon('lock', 16)}</button>`
          : `<a href="#/category/${c.slug}">${escapeHtml(c.role)}</a>`}</li>`).join('')}</ul></div>
        <div class="res-col"><span class="res-heading">Popular</span><ul class="res-small">${popular.map(t => `<li><a href="#/article/${t.id}">${escapeHtml(t.title)}</a></li>`).join('')}</ul></div>
        <div class="res-col"><span class="res-heading">Help</span><ul class="res-small">
          <li><a href="${APP_URL}" target="_blank" rel="noopener noreferrer">Open the E-PMS app ${icon('external', 12)}</a></li>
          <li><a href="#/article/signing-in-and-finding-your-way">Trouble signing in</a></li>
          <li><a href="#/article/account-password-and-help">Change your password</a></li>
          <li><a href="#/guides">All guides</a></li>
          ${vaultItem('')}
        </ul></div>
      </div>`;

    // Phone and tablet menu (Notion's full-screen sheet).
    mobileMenu.innerHTML = `
      <div class="mm-scroll">
        <button type="button" class="mm-search" data-action="search">${icon('search', 18)} Search guides</button>
        <div class="mm-cards">${featured.map(c => tintCard(c, true)).join('')}</div>
        <a class="see-all" href="#/guides">See all guides ${icon('arrow', 12, 2)}</a>
        <div class="mm-links">
          ${start ? `<a class="mm-link" href="#/category/${start.slug}">Getting started</a>` : ''}
          ${admin && !isLockedCategory(admin) ? `<a class="mm-link" href="#/category/${admin.slug}">Administration</a>` : ''}
          <button type="button" class="mm-link" data-mm-tree aria-expanded="${mobileTreeOpen}">Browse every guide <span class="chev">${icon('chevronDown', 18, 2)}</span></button>
          <ul class="side-section mm-tree"${mobileTreeOpen ? '' : ' hidden'}>${sidebarTree(current)}</ul>
          <button type="button" class="mm-link" data-action="theme"><span data-theme-label>Dark mode</span><span data-theme-icon></span></button>
        </div>
      </div>
      <div class="mm-foot">
        <a class="btn btn-primary btn-block" href="${APP_URL}" target="_blank" rel="noopener noreferrer">Open E-PMS</a>
        ${hasStealth ? `<button type="button" class="btn btn-soft btn-block" data-action="vault" data-vault-label>${label}</button>` : ''}
      </div>`;

    $('footer').innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand">
          <a class="footer-logo" href="#/" aria-label="EagleView Help Center home">
            <span class="logo-badge" aria-hidden="true"><img src="assets/brand/nrs-logo.png" alt="" width="42" height="15"></span>
            <span><span class="footer-word">Eagle<span class="logo-accent">View</span></span><span class="footer-tag">Nigeria Revenue Service</span></span>
          </a>
          <blockquote class="footer-quote">
            <p>“Clear goals, fair reviews,<br>and room to grow for every officer.”</p>
            <cite>EagleView E-PMS · Nigeria Revenue Service</cite>
          </blockquote>
        </div>
        <nav class="footer-cols" aria-label="Footer">
          <div><span class="footer-heading">Guides</span><ul>${shown.filter(c => !isLockedCategory(c)).map(c => `<li><a href="#/category/${c.slug}">${escapeHtml(c.title)}</a></li>`).join('')}<li><a href="#/guides">All guides</a></li></ul></div>
          <div><span class="footer-heading">Popular</span><ul>${popular.map(t => `<li><a href="#/article/${t.id}">${escapeHtml(t.title)}</a></li>`).join('')}</ul></div>
          <div><span class="footer-heading">Support</span><ul>
            <li><a href="${APP_URL}" target="_blank" rel="noopener noreferrer">Open the E-PMS app</a></li>
            <li><a href="#/article/signing-in-and-finding-your-way">Trouble signing in</a></li>
            <li><a href="#/article/account-password-and-help">Change your password</a></li>
            ${vaultItem('')}
          </ul></div>
        </nav>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Nigeria Revenue Service</span>
          <a href="#/guides">All guides</a>
          <button type="button" class="theme-pill" data-action="theme"><span data-theme-icon></span><span data-theme-label>Dark mode</span></button>
        </div>
      </div>`;

    document.querySelectorAll('.nav-text-link[data-vault-label]').forEach(el => { el.hidden = !hasStealth; el.textContent = label; });
    document.querySelectorAll('.nav-links a.nav-link').forEach(a => a.classList.toggle('is-active', location.hash === a.getAttribute('href')));
    updateThemeControls();
  }

  function toggleCategory(btn) {
    const open = !btn.closest('.toggle').classList.contains('is-open');
    document.querySelectorAll(`[data-toggle="${btn.dataset.toggle}"]`).forEach(b => {
      b.closest('.toggle').classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', String(open));
    });
    if (open) openToggles.add(btn.dataset.toggle); else openToggles.delete(btn.dataset.toggle);
  }

  // ---------- Header dropdowns ----------
  const ddTriggers = [...document.querySelectorAll('.nav-dd-trigger')];
  const ddPanels = [...document.querySelectorAll('.dd-panel')];
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let ddTimer = 0;

  function setDropdown(name) {
    clearTimeout(ddTimer);
    ddTriggers.forEach(t => t.setAttribute('aria-expanded', String(t.dataset.dd === name)));
    ddPanels.forEach(p => { p.hidden = p.dataset.dd !== name; });
  }
  const closeDropdowns = () => setDropdown(null);
  const scheduleClose = () => { clearTimeout(ddTimer); ddTimer = setTimeout(closeDropdowns, 180); };
  const openDropdown = () => ddTriggers.find(t => t.getAttribute('aria-expanded') === 'true');

  ddTriggers.forEach(t => {
    t.addEventListener('mouseenter', () => { if (canHover.matches) setDropdown(t.dataset.dd); });
    t.addEventListener('mouseleave', () => { if (canHover.matches) scheduleClose(); });
    t.addEventListener('click', () => {
      const isOpen = t.getAttribute('aria-expanded') === 'true';
      setDropdown(isOpen && !canHover.matches ? null : t.dataset.dd);
    });
  });
  ddPanels.forEach(p => {
    p.addEventListener('mouseenter', () => clearTimeout(ddTimer));
    p.addEventListener('mouseleave', () => { if (canHover.matches) scheduleClose(); });
  });

  // ---------- Mobile menu ----------
  function setMenuIcon(open) {
    menuBtn.innerHTML = icon(open ? 'close' : 'menu', 22, 2);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function openMenu() {
    closeDropdowns();
    mobileMenu.hidden = false;
    document.body.classList.add('menu-open');
    setMenuIcon(true);
    syncScrollLock();
  }
  function closeMenu() {
    if (mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
    setMenuIcon(false);
    syncScrollLock();
  }
  menuBtn.addEventListener('click', () => (mobileMenu.hidden ? openMenu() : closeMenu()));
  const wide = window.matchMedia('(min-width: 1200px)');
  const onWide = () => { if (wide.matches) closeMenu(); };
  if (wide.addEventListener) wide.addEventListener('change', onWide);

  // ---------- Router ----------
  function route() {
    if (!GUIDES.length) { renderEmpty(); return; }
    const [kind, id, section] = location.hash.replace(/^#\/?/, '').split('/').map(p => { try { return decodeURIComponent(p); } catch (e) { return p; } });
    closeMenu();
    closeDropdowns();
    tocAvailable = false;
    let current;
    if (kind === 'article' && id) current = renderArticle(id, section);
    else if (kind === 'category' && id) current = renderCategory(id);
    else if (kind === 'guides') current = renderAllGuides();
    else current = renderHome();
    if (kind !== 'article') setToc([]);
    document.body.classList.toggle('is-home', !!(current && current.home));
    renderChrome(current || {});
  }

  function go(href) {
    if (location.hash === href) route();
    else location.hash = href;
  }

  function scrollToSection(id, href) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (href) history.replaceState(null, '', href);
    if (window.innerWidth < 768) toggleToc(false);
  }

  // ---------- Search UI ----------
  let activeResult = 0;

  function openSearch(initial) {
    closeMenu();
    closeDropdowns();
    if (searchOverlay.hidden) lastFocus = document.activeElement;
    searchOverlay.hidden = false;
    if (typeof initial === 'string') searchInput.value = initial;
    activeResult = 0;
    renderResults();
    syncScrollLock();
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
  }

  function closeSearch() {
    if (searchOverlay.hidden) return;
    searchOverlay.hidden = true;
    syncScrollLock();
    if (lastFocus && lastFocus.isConnected && lastFocus.id !== 'heroSearch') lastFocus.focus();
  }

  function resultItem(href, crumb, title, snip, index) {
    return `<li role="presentation"><a class="search-result${index === activeResult ? ' is-active' : ''}" href="${href}" role="option" aria-selected="${index === activeResult}">
      <span class="sr-crumb">${crumb}</span><span class="sr-title">${title}</span>${snip ? `<span class="sr-snippet">${snip}</span>` : ''}</a></li>`;
  }

  function renderResults() {
    const query = searchInput.value;
    if (!query.trim()) {
      const suggested = POPULAR.map(t => GUIDES.find(g => g.id === t.id && isVisible(g))).filter(Boolean);
      searchResults.innerHTML = `<li class="search-group" role="presentation"><span class="smallcaps">Suggested</span></li>` +
        suggested.map((g, i) => resultItem(`#/article/${g.id}`, escapeHtml(categoryOf(g).title), escapeHtml(g.title), '', i)).join('');
      return;
    }
    const { items, terms, q } = search(query);
    if (!items.length) {
      searchResults.innerHTML = `<li class="search-empty" role="presentation">No results for “${escapeHtml(query.trim())}”. Try fewer or different words.</li>`;
      return;
    }
    activeResult = Math.min(activeResult, items.length - 1);
    searchResults.innerHTML = items.map((r, i) => {
      const g = r.entry.guide;
      const s = r.section;
      const href = `#/article/${g.id}${s && s.id ? `/${s.id}` : ''}`;
      const crumb = escapeHtml(r.entry.category.title) + (s && s.heading ? ` › ${escapeHtml(s.heading)}` : '');
      return resultItem(href, crumb, highlight(g.title, terms), s ? snippet(s.text, q, terms) : '', i);
    }).join('');
  }

  function moveActive(delta) {
    const links = [...searchResults.querySelectorAll('.search-result')];
    if (!links.length) return;
    activeResult = (activeResult + delta + links.length) % links.length;
    links.forEach((a, i) => { a.classList.toggle('is-active', i === activeResult); a.setAttribute('aria-selected', String(i === activeResult)); });
    links[activeResult].scrollIntoView({ block: 'nearest' });
  }

  searchInput.addEventListener('input', () => { activeResult = 0; renderResults(); });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    else if (e.key === 'Enter') {
      const a = searchResults.querySelectorAll('.search-result')[activeResult];
      if (a) { e.preventDefault(); closeSearch(); go(a.getAttribute('href')); }
    }
  });

  // ---------- Executive access dialog ----------
  function openVault() {
    closeMenu();
    closeDropdowns();
    lastFocus = document.activeElement;
    vaultOverlay.hidden = false;
    vaultError.hidden = true;
    vaultInput.value = '';
    syncScrollLock();
    vaultInput.focus();
  }

  function closeVault() {
    if (vaultOverlay.hidden) return;
    vaultOverlay.hidden = true;
    syncScrollLock();
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }

  function vaultAction() {
    if (hasLocked()) { openVault(); return; }
    if (!hasStealth) return;
    closeMenu();
    lockAll();
    toast('Executive guides locked');
    route();
  }

  vaultForm.addEventListener('submit', async e => {
    e.preventDefault();
    const pin = vaultInput.value.trim();
    if (!pin) { vaultInput.focus(); return; }
    vaultSubmit.disabled = true;
    vaultSubmit.textContent = 'Unlocking…';
    let opened = 0;
    let message = 'That PIN didn’t work. Try again.';
    try {
      opened = await unlockWith(pin);
    } catch (err) {
      message = 'Your browser blocked decryption here. Open the Help Center over https, or from the file on your computer.';
    }
    vaultSubmit.disabled = false;
    vaultSubmit.textContent = 'Unlock';
    if (!opened) {
      vaultError.textContent = message;
      vaultError.hidden = false;
      vaultInput.select();
      return;
    }
    closeVault();
    toast('Executive guides unlocked');
    route();
  });

  // ---------- Collapsible sidebar (desktop; phones use the menu) ----------
  const sidebarBtn = $('sidebarBtn');
  const sidebarCollapsed = () => document.documentElement.classList.contains('sidebar-collapsed');
  function updateSidebarButton() {
    const collapsed = sidebarCollapsed();
    const label = collapsed ? 'Show sidebar' : 'Hide sidebar';
    sidebarBtn.innerHTML = icon(collapsed ? 'panelOpen' : 'panelClose', 18);
    sidebarBtn.setAttribute('aria-expanded', String(!collapsed));
    sidebarBtn.setAttribute('aria-label', label);
    sidebarBtn.title = `${label} (Ctrl + \\)`;
  }
  function toggleSidebar() {
    const collapsed = !sidebarCollapsed();
    document.documentElement.classList.toggle('sidebar-collapsed', collapsed);
    storageSet('localStorage', 'nrs_sidebar', collapsed ? 'collapsed' : 'open');
    updateSidebarButton();
  }

  // ---------- Lightbox and theme ----------
  function openLightbox(img) {
    const big = lightbox.querySelector('img');
    big.src = img.src;
    big.alt = img.alt;
    lightbox.hidden = false;
    syncScrollLock();
  }
  function closeLightbox() { lightbox.hidden = true; syncScrollLock(); }

  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || (darkQuery.matches ? 'dark' : 'light');
  }
  function updateThemeControls() {
    const dark = currentTheme() === 'dark';
    const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    document.querySelectorAll('[data-theme-icon]').forEach(el => { el.innerHTML = icon(dark ? 'sun' : 'moon', 18); });
    document.querySelectorAll('[data-theme-label]').forEach(el => { el.textContent = dark ? 'Light mode' : 'Dark mode'; });
    document.querySelectorAll('[data-action="theme"]').forEach(el => { el.setAttribute('aria-label', label); el.title = label; });
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#191918' : '#ffffff'));
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    storageSet('localStorage', 'nrs_theme', next);
    updateThemeControls();
    renderDiagrams(content);
  }
  const onSystemTheme = () => {
    if (document.documentElement.hasAttribute('data-theme')) return;
    updateThemeControls();
    renderDiagrams(content);
  };
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', onSystemTheme);

  // ---------- Global events ----------
  document.addEventListener('click', e => {
    const t = e.target;
    if (!t.closest('.nav')) closeDropdowns();
    const action = t.closest('[data-action]');
    if (action) {
      const name = action.dataset.action;
      if (name === 'search') { e.preventDefault(); openSearch(''); return; }
      if (name === 'close-search') { closeSearch(); return; }
      if (name === 'vault') { e.preventDefault(); vaultAction(); return; }
      if (name === 'close-vault') { closeVault(); return; }
      if (name === 'theme') { toggleTheme(); return; }
      if (name === 'toggle-toc') { toggleToc(); return; }
      if (name === 'toggle-sidebar') { toggleSidebar(); return; }
    }
    const tree = t.closest('[data-mm-tree]');
    if (tree) {
      mobileTreeOpen = tree.getAttribute('aria-expanded') !== 'true';
      tree.setAttribute('aria-expanded', String(mobileTreeOpen));
      mobileMenu.querySelector('.mm-tree').hidden = !mobileTreeOpen;
      return;
    }
    const toggle = t.closest('[data-toggle]');
    if (toggle) { toggleCategory(toggle); return; }
    const section = t.closest('[data-section]');
    if (section) { e.preventDefault(); scrollToSection(section.dataset.section, section.getAttribute('href')); return; }
    const copy = t.closest('[data-copy]');
    if (copy) {
      copyText(copy.dataset.copy).then(() => toast(`Copied ${copy.dataset.tag} placeholder`), () => toast('Couldn’t copy to the clipboard'));
      return;
    }
    const result = t.closest('.search-result');
    if (result) { e.preventDefault(); closeSearch(); go(result.getAttribute('href')); return; }
    const img = t.closest('figure.media img');
    if (img) { openLightbox(img); return; }
    if (t.closest('#lightbox')) { closeLightbox(); return; }
    const link = t.closest('a[href^="#"]');
    if (link && (link.closest('#mobileMenu') || link.closest('.dd-panel')) && location.hash === link.getAttribute('href')) {
      closeMenu();
      closeDropdowns();
    }
    if (t === searchOverlay) closeSearch();
    else if (t === vaultOverlay) closeVault();
    else if (t.id === 'scrim') toggleToc(false);
  });

  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && !e.target.readOnly;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchOverlay.hidden) openSearch(''); else closeSearch();
      return;
    }
    // Ctrl/Cmd + \ toggles the sidebar, as in Notion.
    if ((e.ctrlKey || e.metaKey) && e.key === '\\' && window.innerWidth >= 1080) {
      e.preventDefault();
      toggleSidebar();
      return;
    }
    if (e.key === 'Escape') {
      if (!lightbox.hidden) closeLightbox();
      else if (!vaultOverlay.hidden) closeVault();
      else if (!searchOverlay.hidden) closeSearch();
      else if (openDropdown()) { const t = openDropdown(); closeDropdowns(); t.focus(); }
      else if (!mobileMenu.hidden) { closeMenu(); menuBtn.focus(); }
      else if (document.body.classList.contains('toc-open') && window.innerWidth < 1280) toggleToc(false);
      return;
    }
    // Typing into the hero search box opens search with that character.
    if (e.target.id === 'heroSearch') {
      if (e.key === 'Enter') { e.preventDefault(); openSearch(''); }
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); openSearch(e.key); }
      return;
    }
    if (e.key === '/' && !typing && searchOverlay.hidden && vaultOverlay.hidden) { e.preventDefault(); openSearch(''); }
  });

  window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 0), { passive: true });
  window.addEventListener('hashchange', route);

  // ---------- Init ----------
  document.querySelectorAll('.app-href').forEach(a => { a.href = APP_URL; });
  document.querySelectorAll('[data-icon]').forEach(el => {
    const size = el.matches('.dialog-icon') ? 28 : el.matches('.search-close, .search-field-icon') ? 20 : 16;
    el.innerHTML = icon(el.dataset.icon, size, el.matches('.chev') ? 2 : 1.75);
  });
  setMenuIcon(false);
  updateSidebarButton();
  updateThemeControls();

  // Re-open guides unlocked earlier in this browser session before the first render.
  const pins = hasStealth ? savedPins() : [];
  if (pins.length) {
    pins.reduce((p, pin) => p.then(() => unlockWith(pin)).catch(() => 0), Promise.resolve()).finally(route);
  } else {
    route();
  }
})();

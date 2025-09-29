/* Simple client-side filtering + sorting for the Project Corpus */
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const search = $('#search');
  const sort = $('#sort');
  const status = $('#status');
  const clear = $('#clear');
  const grid = $('#grid');
  const cards = $$('.card', grid);
  const count = $('#count');
  // Tag dropdown elements
  const tagFilterBtn = $('#tagFilterBtn');
  const tagDropdown = $('#tagDropdown');
  const tagSearchInput = $('#tagSearch');
  const tagClearBtn = $('#clearTags');
  const tagCloseBtn = $('#closeTagDropdown');
  const tagCheckboxes = $$('.tag-checkbox');
  const selectedTagsWrap = $('#selectedTags');

  const selectedTags = new Set();

  function normalize(s) {
    return (s || '').toLowerCase();
  }

  function applyFilters() {
    const q = normalize(search.value);
    const st = normalize(status.value);

    let visible = 0;
    cards.forEach((card) => {
      const title = card.dataset.title;
      const summary = card.dataset.summary;
      const tags = (card.dataset.tags || '').split(',').filter(Boolean);
      const cstatus = card.dataset.status;

      // text match
      const textMatch = !q || title.includes(q) || summary.includes(q) || tags.some(t => t.includes(q));

      // status match
      const statusMatch = !st || cstatus === st;

      // tag match: ensure all selected tags are present
      const tagMatch = selectedTags.size === 0 || Array.from(selectedTags).every(t => tags.includes(t));

      const show = textMatch && statusMatch && tagMatch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    count.textContent = `${visible} project${visible === 1 ? '' : 's'}`;
  }

  function applySort() {
    const mode = sort.value;
    const items = cards.slice().filter(c => c.style.display !== 'none');
    const others = cards.slice().filter(c => c.style.display === 'none');

    if (mode === 'title') {
      items.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    } else {
      // recent: date desc
      items.sort((a, b) => (parseInt(b.dataset.date, 10) || 0) - (parseInt(a.dataset.date, 10) || 0));
    }

    // Re-append visible in order, then hidden to keep DOM minimal
    items.concat(others).forEach(el => grid.appendChild(el));
  }

  function updateTagButtonLabel() {
    if (!tagFilterBtn) return;
    const n = selectedTags.size;
    tagFilterBtn.textContent = n > 0 ? `Tags (${n})` : 'Tags';
  }

  function renderSelectedTags() {
    if (!selectedTagsWrap) return;
    selectedTagsWrap.innerHTML = '';
    selectedTags.forEach((t) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = `${t} <button type="button" aria-label="Remove tag ${t}">×</button>`;
      chip.querySelector('button').addEventListener('click', () => {
        setTagSelection(t, false);
      });
      selectedTagsWrap.appendChild(chip);
    });
  }

  function setTagSelection(tag, checked) {
    const value = normalize(tag);
    const cb = tagCheckboxes.find(x => x.value === value);
    if (checked) selectedTags.add(value); else selectedTags.delete(value);
    if (cb) cb.checked = checked;
    updateTagButtonLabel();
    renderSelectedTags();
    applyFilters();
    applySort();
  }

  function openTagDropdown() {
    if (!tagDropdown || !tagFilterBtn) return;
    tagDropdown.hidden = false;
    tagFilterBtn.classList.add('active');
    tagFilterBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => tagSearchInput && tagSearchInput.focus());
    document.addEventListener('click', onDocClickClose, { capture: true });
    document.addEventListener('keydown', onEscClose);
  }

  function closeTagDropdown() {
    if (!tagDropdown || !tagFilterBtn) return;
    tagDropdown.hidden = true;
    tagFilterBtn.classList.remove('active');
    tagFilterBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClickClose, { capture: true });
    document.removeEventListener('keydown', onEscClose);
  }

  function onDocClickClose(e) {
    if (!tagDropdown || tagDropdown.hidden) return;
    if (tagDropdown.contains(e.target) || tagFilterBtn.contains(e.target)) return;
    closeTagDropdown();
  }

  function onEscClose(e) {
    if (e.key === 'Escape') closeTagDropdown();
  }

  // Wire up events
  if (search) search.addEventListener('input', () => { applyFilters(); applySort(); });
  if (sort) sort.addEventListener('change', () => applySort());
  if (status) status.addEventListener('change', () => { applyFilters(); applySort(); });
  if (clear) clear.addEventListener('click', () => {
    search.value = '';
    status.value = '';
    selectedTags.clear();
    if (tagCheckboxes) tagCheckboxes.forEach(cb => (cb.checked = false));
    updateTagButtonLabel();
    renderSelectedTags();
    applyFilters();
    applySort();
  });

  // Tag dropdown wiring
  if (tagFilterBtn) tagFilterBtn.addEventListener('click', () => {
    if (tagDropdown.hidden) openTagDropdown(); else closeTagDropdown();
  });
  if (tagCloseBtn) tagCloseBtn.addEventListener('click', closeTagDropdown);
  if (tagClearBtn) tagClearBtn.addEventListener('click', () => {
    selectedTags.clear();
    if (tagCheckboxes) tagCheckboxes.forEach(cb => (cb.checked = false));
    updateTagButtonLabel();
    renderSelectedTags();
    applyFilters();
    applySort();
  });
  if (tagCheckboxes) tagCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => setTagSelection(cb.value, cb.checked));
  });
  if (tagSearchInput) tagSearchInput.addEventListener('input', () => {
    const q = normalize(tagSearchInput.value);
    $$('.tag-list li').forEach(li => {
      const label = $('span', li);
      const text = normalize(label ? label.textContent : '');
      li.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });

  // Initial render
  updateTagButtonLabel();
  renderSelectedTags();
  applyFilters();
  applySort();
})();

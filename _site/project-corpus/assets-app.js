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
  const tagButtons = $$('.tag');

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

  function toggleTag(btn) {
    const tag = normalize(btn.dataset.tag);
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
      btn.classList.remove('active');
    } else {
      selectedTags.add(tag);
      btn.classList.add('active');
    }
    applyFilters();
    applySort();
  }

  // Wire up events
  if (search) search.addEventListener('input', () => { applyFilters(); applySort(); });
  if (sort) sort.addEventListener('change', () => applySort());
  if (status) status.addEventListener('change', () => { applyFilters(); applySort(); });
  if (clear) clear.addEventListener('click', () => {
    search.value = '';
    status.value = '';
    selectedTags.clear();
    tagButtons.forEach(b => b.classList.remove('active'));
    applyFilters();
    applySort();
  });
  tagButtons.forEach(btn => btn.addEventListener('click', () => toggleTag(btn)));

  // Initial render
  applyFilters();
  applySort();
})();


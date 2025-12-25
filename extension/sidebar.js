
function showPanel(id) {
  for (const el of document.querySelectorAll('.cx-panel')) el.classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}

document.getElementById('btn-tabs').addEventListener('click', async () => {
  showPanel('view-tabs');
  chrome.runtime.sendMessage({ type: 'GET_TABS' }, (resp) => {
    const hostColors = {};
    const el = document.getElementById('view-tabs');
    el.innerHTML = '';
    if (resp && resp.ok) {
      for (const t of resp.tabs) {
        const div = document.createElement('div');
        const url = t.url || '';
        const host = url.split('/')[2] || '';
        const key = `tab-color-${t.id}`;
        div.className = 'cx-note';
        div.innerHTML = `<strong>${t.title || 'بدون عنوان'}</strong><br><span class="tags">${url}</span>`;
        const pinBtn = document.createElement('button'); pinBtn.className = 'cx-btn'; pinBtn.textContent = 'تثبيت';
        pinBtn.onclick = () => chrome.runtime.sendMessage({ type:'PIN_TAB', tabId: t.id });
        const colorBtn = document.createElement('button'); colorBtn.className = 'cx-btn'; colorBtn.textContent = 'لون';
        colorBtn.onclick = () => chrome.runtime.sendMessage({ type:'COLORIZE_TAB', tabId: t.id, color: '#00BFA5' });
        div.appendChild(pinBtn); div.appendChild(colorBtn);
        el.appendChild(div);
      }
    } else {
      el.textContent = 'تعذر جلب التبويبات.';
    }
  });
});

document.getElementById('btn-notes').addEventListener('click', async () => {
  showPanel('view-notes');
  chrome.runtime.sendMessage({ type: 'LIST_NOTES' }, (resp) => {
    const list = document.getElementById('notes-list');
    list.innerHTML = '';
    if (resp && resp.ok) {
      for (const n of resp.notes) {
        const div = document.createElement('div');
        div.className = 'cx-note';
        const tagStr = (n.tags||[]).join(', ');
        const when = new Date(n.ts||Date.now()).toLocaleString('ar');
        div.innerHTML = `<div>${n.text}</div><div class="tags">${tagStr} • ${when}</div>`;
        list.appendChild(div);
      }
    }
  });
});

document.getElementById('btn-suggest').addEventListener('click', async () => {
  const text = document.getElementById('note-text').value || '';
  chrome.runtime.sendMessage({ type: 'SUGGEST_TAGS', text }, (resp) => {
    if (resp && resp.ok) {
      const tags = resp.suggestions.join(', ');
      const input = document.getElementById('note-tags');
      input.value = input.value ? (input.value + ', ' + tags) : tags;
    }
  });
});

document.getElementById('btn-save').addEventListener('click', async () => {
  const text = document.getElementById('note-text').value.trim();
  const tags = (document.getElementById('note-tags').value || '').split(',').map(t=>t.trim()).filter(Boolean);
  const url = location.href;
  if (!text) return alert('اكتب الملاحظة أولاً');
  chrome.runtime.sendMessage({ type:'SAVE_NOTE', text, tags, url }, (resp) => {
    if (resp && resp.ok) {
      document.getElementById('note-text').value = '';
      document.getElementById('note-tags').value = '';
      document.getElementById('btn-notes').click();
    }
  });
});

document.getElementById('btn-github').addEventListener('click', () => showPanel('view-github'));

document.getElementById('btn-import').addEventListener('click', async () => {
  chrome.runtime.sendMessage({ type: 'IMPORT_GITHUB' }, (resp) => {
    const pre = document.getElementById('gh-result');
    pre.textContent = JSON.stringify(resp, null, 2);
  });
});

document.getElementById('btn-options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// عرض افتراضي
showPanel('view-tabs');

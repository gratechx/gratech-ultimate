
(async function(){
  const els = {
    ghToken: document.getElementById('ghToken'),
    ghRepo: document.getElementById('ghRepo'),
    save: document.getElementById('save')
  };
  const current = await chrome.storage.local.get(['ghToken','ghRepo']);
  els.ghToken.value = current.ghToken || '';
  els.ghRepo.value = current.ghRepo || '';
  els.save.onclick = async () => {
    await chrome.storage.local.set({ ghToken: els.ghToken.value, ghRepo: els.ghRepo.value });
    alert('تم الحفظ');
  };
})();

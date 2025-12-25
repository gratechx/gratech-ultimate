
// Comet X Ultimate v4 - Service Worker (MV3)
// مسؤول عن: إدارة التبويبات، مزامنة الخلفية، استيراد GitHub، والوسوم الذكية.

chrome.runtime.onInstalled.addListener(() => {
  console.log('[CometX] Installed v4.0.0');
});

// فتح الـ Side Panel عند الضغط على أيقونة الإضافة
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
    await chrome.sidePanel.setOptions({ tabId: tab.id, path: 'sidebar.html' });
  } catch (e) {
    console.warn('SidePanel not supported in this browser/version', e);
  }
});

// قناة رسائل عامة بين الـ sidebar والـ background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === 'GET_TABS') {
      const tabs = await chrome.tabs.query({});
      sendResponse({ ok: true, tabs });
    }
    else if (msg.type === 'PIN_TAB') {
      try {
        await chrome.tabs.update(msg.tabId, { pinned: true });
        sendResponse({ ok: true });
      } catch (e) { sendResponse({ ok: false, error: String(e) }); }
    }
    else if (msg.type === 'COLORIZE_TAB') {
      // ملاحظة: لا يوجد API لتلوين التبويب مباشرة، نستخدم عنوان مخصص أو علامة.
      const key = `tab-color-${msg.tabId}`;
      await chrome.storage.local.set({ [key]: msg.color || '#00BFA5' });
      sendResponse({ ok: true });
    }
    else if (msg.type === 'SAVE_NOTE') {
      const notes = (await chrome.storage.local.get(['notes'])).notes || [];
      notes.push({ text: msg.text, tags: msg.tags || [], url: msg.url || '', ts: Date.now() });
      await chrome.storage.local.set({ notes });
      sendResponse({ ok: true, count: notes.length });
    }
    else if (msg.type === 'LIST_NOTES') {
      const notes = (await chrome.storage.local.get(['notes'])).notes || [];
      sendResponse({ ok: true, notes });
    }
    else if (msg.type === 'SUGGEST_TAGS') {
      const text = (msg.text || '').toLowerCase();
      // اقتراحات بسيطة مبنية على كلمات عربية/إنجليزية شائعة (Placeholder للذكاء الحقيقي)
      const suggestions = [];
      if (text.includes('azure') || text.includes('docker')) suggestions.push('DevOps');
      if (text.includes('github') || text.includes('issue')) suggestions.push('GitHub');
      if (text.includes('رياض') || text.includes('السعودية')) suggestions.push('سعودية');
      if (text.includes('ذكاء') || text.includes('ai')) suggestions.push('ذكاء اصطناعي');
      if (text.includes('متطلبات') || text.includes('requirements')) suggestions.push('متطلبات');
      sendResponse({ ok: true, suggestions });
    }
    else if (msg.type === 'IMPORT_GITHUB') {
      // Placeholder: سنقرأ من api.github.com إن توفرت صلاحيات/Token عبر options.
      // في MV3 لا يُسمح بالـ fetch للـ GitHub إلا بتمكين المضيف في manifest (تم) واستخدام token من storage.
      const { ghToken, ghRepo } = await chrome.storage.local.get(['ghToken', 'ghRepo']);
      if (!ghToken || !ghRepo) {
        sendResponse({ ok: false, error: 'يرجى ضبط ghToken و ghRepo في الإعدادات.' });
        return;
      }
      // لن نجري الاتصال فعليًا هنا حفاظًا على بيئة الأوفلاين. نرجع نموذج.
      sendResponse({ ok: true, sample: { issues: [], pull_requests: [] } });
    }
  })();
  return true; // سنستخدم sendResponse async
});

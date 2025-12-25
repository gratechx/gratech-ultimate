
# Comet X Ultimate v4 - المتطلبات النهائية (نسخة مبسطة)

## الميزات الأساسية
- Sidebar دائم فيروزي، متوافق مع Side Panel API.
- ملاحظات + وسوم ذكية + فهرسة عربية لاحقة.
- إدارة التبويبات (تثبيت، وسم لون افتراضي).
- استيراد GitHub (Issues/PRs) لاحقًا مع إعداد ghToken/ghRepo.
- مزامنة سحابة اختيارية لاحقًا.
- ذكاء سياقي وروابط ذات صلة (Placeholder في content.js).

## التقنية
- Chrome MV3 (manifest_version: 3).
- Background Service Worker + Side Panel.
- Storage محلي.
- Options Page لإدخال الإعدادات.

## الخطوات القادمة
- توصيل فعلي لـ GitHub API باستخدام fetch مع PAT.
- إضافة فهرسة نصية عربية (TF-IDF أو Embeddings) للوسوم الذكية.
- مزامنة مع خادم (gratech.sa) عبر OAuth/OIDC.
- تحسين واجهة المستخدم ودعم الوضعيات المختلفة.

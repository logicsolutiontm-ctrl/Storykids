import { useState, useEffect, useRef } from 'react'
import { API_BASE } from './api'
import { useNavigate } from 'react-router-dom'

const T = {
  English: {
    nav: ['How It Works', 'Features', 'Our Work', 'Reviews', 'FAQ'],
    heroTag: '✨ Personalized Children\'s Books',
    heroQuestion: 'Who is the hero of our next story?',
    heroTitleDefault: 'A Magical Story Starring Your Child',
    heroSub: 'We craft unique, beautifully illustrated storybooks where your child is the hero — teaching real values through the power of storytelling.',
    heroCta: '🚀 Order Your Story',
    heroNote: '• Delivered to your door',
    statsOrders: 'Happy Families', statsLangs: 'Languages',
    statsValues: 'Values Taught', statsDelivery: 'Day Delivery',
    howTitle: 'How It Works', howSub: 'From form to front door in 4 simple steps',
    steps: [
      { icon: '📝', title: 'Fill the Form', desc: 'Tell us your child\'s name, age, interests, favorite heroes and the values you want to teach.' },
      { icon: '✍️', title: 'We Write the Story', desc: 'Our team crafts a unique, personalized story where your child is the main hero.' },
      { icon: '🎨', title: 'We Illustrate It', desc: 'Your child\'s photo is transformed into a beautiful 3D cartoon character for the book.' },
      { icon: '📦', title: 'We Ship It', desc: 'A premium printed hardcover book arrives at your door, ready to be gifted.' },
    ],
    featTitle: 'Why StoryKid?', featSub: 'Every detail is designed to make it magical',
    features: [
      { icon: '🌍', title: '6 Languages', desc: 'Stories written in English, Arabic, French, Turkish, Spanish or Russian.' },
      { icon: '💎', title: 'Values-Based', desc: 'Each story naturally teaches bravery, honesty, kindness and more.' },
      { icon: '📸', title: '3D Cartoon Character', desc: "Your child's photo becomes a stunning cartoon hero in the story." },
      { icon: '📖', title: 'Premium Hardcover', desc: 'Beautifully printed, durable hardcover book built to last a lifetime.' },
      { icon: '🚀', title: 'Fast Delivery', desc: 'Receive your book within days, anywhere in the world.' },
      { icon: '🎁', title: 'Perfect Gift', desc: 'The most unique and meaningful gift any child could receive.' },
    ],
    ourWorkTitle: 'Our Magical Library', ourWorkSub: 'Real stories we\'ve brought to life for real families',
    ourWorkCta: 'Order Your Story', viewAll: 'View All Stories',
    testiTitle: 'Loved by Parents', testiSub: 'See what families are saying',
    testimonials: [
      { name: 'Sarah M.', text: 'My daughter literally cried tears of joy when she saw herself as the brave knight. Best gift ever!', rating: 5 },
      { name: 'David L.', text: 'The quality of the hardcover is outstanding. Feels like a premium bookstore book, but personalized.', rating: 5 },
      { name: 'Amina K.', text: 'I love that I could choose Arabic and focus the story on kindness. Truly a meaningful keepsake.', rating: 5 },
    ],
    faqTitle: 'Questions & Answers',
    faqs: [
      { q: 'How long does delivery take?', a: 'Typically 7-14 business days depending on your location. We ship worldwide.' },
      { q: 'What age is this for?', a: 'Our stories are crafted for children aged 2-12, tailored to each age group.' },
      { q: 'Can I choose the values in the story?', a: 'Yes! You select up to 3 values — bravery, loyalty, honesty, kindness, and more.' },
      { q: 'What if I don\'t upload a photo?', a: 'No problem — we\'ll create a beautiful illustrated character based on your description.' },
      { q: 'Can I order for multiple children?', a: 'Absolutely! Place a separate order for each child for a fully unique story.' },
    ],
    footerTagline: 'Making every child the hero of their own story.',
    ctaTitle: 'Ready to Create the Magic?',
    ctaSub: 'Join hundreds of families who gave their child the most unique gift ever.',
    ctaBtn: '🚀 Order My Story Now',
  },
  French: {
    nav: ['Comment ça marche', 'Fonctionnalités', 'Nos Œuvres', 'Avis', 'FAQ'],
    heroTag: '✨ Livres Personnalisés pour Enfants',
    heroQuestion: 'Qui est le héros de notre prochaine histoire ?',
    heroTitleDefault: 'Une Histoire Magique avec Votre Enfant',
    heroSub: 'Nous créons des livres illustrés uniques où votre enfant est le héros.',
    heroCta: '🚀 Commander mon histoire', heroNote: '• Livré chez vous',
    statsOrders: 'Familles', statsLangs: 'Langues', statsValues: 'Valeurs', statsDelivery: 'Jours',
    howTitle: 'Comment ça marche', howSub: '4 étapes simples',
    steps: [
      { icon: '📝', title: 'Formulaire', desc: 'Nom, âge, intérêts et valeurs.' },
      { icon: '✍️', title: 'On écrit', desc: 'Histoire unique avec votre enfant.' },
      { icon: '🎨', title: 'On illustre', desc: 'Photo → personnage 3D cartoon.' },
      { icon: '📦', title: 'On livre', desc: 'Livre cartonné premium.' },
    ],
    featTitle: 'Pourquoi StoryKid?', featSub: 'Chaque détail est magique',
    features: [
      { icon: '🌍', title: '6 Langues', desc: 'Anglais, arabe, français, turc et plus.' },
      { icon: '💎', title: 'Valeurs', desc: 'Courage, honnêteté, gentillesse.' },
      { icon: '📸', title: 'Personnage 3D', desc: 'Photo → héros cartoon.' },
      { icon: '📖', title: 'Couverture rigide', desc: 'Livre durable toute une vie.' },
      { icon: '🚀', title: 'Livraison rapide', desc: 'En quelques jours.' },
      { icon: '🎁', title: 'Cadeau parfait', desc: 'Unique et significatif.' },
    ],
    ourWorkTitle: 'Notre Bibliothèque', ourWorkSub: 'Histoires créées pour de vraies familles',
    ourWorkCta: 'Commander', viewAll: 'Voir tout',
    testiTitle: 'Aimé par les parents', testiSub: 'Ce que disent les familles',
    testimonials: [
      { name: 'Sarah M.', text: 'Ma fille a pleuré de joie. Le meilleur cadeau !', rating: 5 },
      { name: 'David L.', text: 'Qualité exceptionnelle, personnalisé pour mon fils.', rating: 5 },
      { name: 'Amina K.', text: 'J\'ai choisi les valeurs. Un vrai souvenir.', rating: 5 },
    ],
    faqTitle: 'Questions Fréquentes',
    faqs: [
      { q: 'Délai de livraison?', a: '7-14 jours ouvrables.' },
      { q: 'Pour quel âge?', a: '2 à 12 ans.' },
      { q: 'Choisir les valeurs?', a: 'Oui, jusqu\'à 3.' },
      { q: 'Sans photo?', a: 'On crée sur description.' },
      { q: 'Plusieurs enfants?', a: 'Une commande par enfant.' },
    ],
    footerTagline: 'Chaque enfant est le héros de sa propre histoire.',
    ctaTitle: 'Prêt à Créer la Magie?', ctaSub: 'Rejoignez des centaines de familles.',
    ctaBtn: '🚀 Commander Mon Histoire',
  },
  Turkish: {
    nav: ['Nasıl Çalışır', 'Özellikler', 'Çalışmalar', 'Yorumlar', 'SSS'],
    heroTag: '✨ Kişiselleştirilmiş Çocuk Kitapları',
    heroQuestion: 'Sıradaki hikayemizin kahramanı kim?',
    heroTitleDefault: 'Çocuğunuzun Başrolde Olduğu Büyülü Hikaye',
    heroSub: 'Çocuğunuzun kahraman olduğu benzersiz hikâye kitapları yaratıyoruz.',
    heroCta: '🚀 Hikayemi Sipariş Et', heroNote: '• Kapınıza teslim',
    statsOrders: 'Mutlu Aile', statsLangs: 'Dil', statsValues: 'Değer', statsDelivery: 'Gün',
    howTitle: 'Nasıl Çalışır', howSub: '4 adımda formdan kapınıza',
    steps: [
      { icon: '📝', title: 'Form', desc: 'Ad, yaş, ilgi ve değerleri girin.' },
      { icon: '✍️', title: 'Yazıyoruz', desc: 'Benzersiz hikaye yazılır.' },
      { icon: '🎨', title: 'İllüstrasyon', desc: 'Fotoğraf 3D karaktere dönüşür.' },
      { icon: '📦', title: 'Gönderiyoruz', desc: 'Premium kitap kapınıza gelir.' },
    ],
    featTitle: 'Neden StoryKid?', featSub: 'Her detay sihri yaratmak için',
    features: [
      { icon: '🌍', title: '6 Dil', desc: 'Türkçe, Arapça, Fransızca ve daha fazlası.' },
      { icon: '💎', title: 'Değer Tabanlı', desc: 'Cesaret, dürüstlük, nezaket öğretir.' },
      { icon: '📸', title: '3D Karikatür', desc: 'Fotoğraf kahramana dönüşür.' },
      { icon: '📖', title: 'Premium Ciltli', desc: 'Ömür boyu sürecek kitap.' },
      { icon: '🚀', title: 'Hızlı Teslimat', desc: 'Günler içinde teslim.' },
      { icon: '🎁', title: 'Mükemmel Hediye', desc: 'En benzersiz hediye.' },
    ],
    ourWorkTitle: 'Sihirli Kütüphanemiz', ourWorkSub: 'Gerçek aileler için hikayeler',
    ourWorkCta: 'Sipariş Et', viewAll: 'Tümünü Gör',
    testiTitle: 'Ebeveynlerin Tercihi', testiSub: 'Aileler ne diyor?',
    testimonials: [
      { name: 'Sarah M.', text: 'Kızım mutluluktan ağladı. En iyi hediye!', rating: 5 },
      { name: 'David L.', text: 'Kalitesi olağanüstü, oğluma özel.', rating: 5 },
      { name: 'Amina K.', text: 'Değerleri seçebildim. Gerçekten anlamlı.', rating: 5 },
    ],
    faqTitle: 'Sıkça Sorulan Sorular',
    faqs: [
      { q: 'Teslimat süresi?', a: '7-14 iş günü.' },
      { q: 'Hangi yaş için?', a: '2-12 yaş arası.' },
      { q: 'Değer seçimi?', a: 'Evet, en fazla 3.' },
      { q: 'Fotoğrafsız?', a: 'Açıklamadan karakter oluştururuz.' },
      { q: 'Birden fazla çocuk?', a: 'Her çocuk için ayrı sipariş.' },
    ],
    footerTagline: 'Her çocuğu kendi hikayesinin kahramanı yapıyoruz.',
    ctaTitle: 'Sihri Yaratmaya Hazır mısınız?', ctaSub: 'Yüzlerce aileye katılın.',
    ctaBtn: '🚀 Hikayemi Şimdi Sipariş Et',
  },
  Arabic: {
    nav: ['كيف يعمل', 'الميزات', 'أعمالنا', 'التعليقات', 'الأسئلة'],
    heroTag: '✨ كتب الأطفال المخصصة',
    heroQuestion: 'من هو بطل قصتنا التالية؟',
    heroTitleDefault: 'قصة سحرية لطفلك كبطل',
    heroSub: 'نصنع كتب قصص فريدة حيث يكون طفلك البطل.',
    heroCta: '🚀 اطلب قصتك', heroNote: '• التوصيل إلى الباب',
    statsOrders: 'عائلة', statsLangs: 'لغة', statsValues: 'قيمة', statsDelivery: 'يوم توصيل',
    howTitle: 'كيف يعمل', howSub: '4 خطوات بسيطة',
    steps: [
      { icon: '📝', title: 'النموذج', desc: 'الاسم والاهتمامات والقيم.' },
      { icon: '✍️', title: 'نكتب', desc: 'قصة فريدة لطفلك.' },
      { icon: '🎨', title: 'نوضّح', desc: 'صورة → شخصية 3D.' },
      { icon: '📦', title: 'نُشحن', desc: 'كتاب فاخر لبابك.' },
    ],
    featTitle: 'لماذا StoryKid؟', featSub: 'كل تفصيل صُمم ليكون ساحرًا',
    features: [
      { icon: '🌍', title: '6 لغات', desc: 'عربية وإنجليزية وفرنسية وأخرى.' },
      { icon: '💎', title: 'قائم على القيم', desc: 'الشجاعة والأمانة واللطف.' },
      { icon: '📸', title: 'شخصية 3D', desc: 'صورة طفلك بطل كرتوني.' },
      { icon: '📖', title: 'غلاف صلب', desc: 'كتاب متين يدوم طويلاً.' },
      { icon: '🚀', title: 'توصيل سريع', desc: 'خلال أيام.' },
      { icon: '🎁', title: 'هدية مثالية', desc: 'أروع هدية لأي طفل.' },
    ],
    ourWorkTitle: 'مكتبتنا السحرية', ourWorkSub: 'قصص حقيقية لعائلات حقيقية',
    ourWorkCta: 'اطلب قصتك', viewAll: 'عرض الكل',
    testiTitle: 'محبوب من الآباء', testiSub: 'ماذا يقول الآباء؟',
    testimonials: [
      { name: 'سارة م.', text: 'ابنتي بكت من الفرح. أفضل هدية!', rating: 5 },
      { name: 'ديفيد ل.', text: 'جودة ممتازة ومخصص لابني.', rating: 5 },
      { name: 'أمينة ك.', text: 'اخترت القيم والقصة كانت رائعة.', rating: 5 },
    ],
    faqTitle: 'الأسئلة المتكررة',
    faqs: [
      { q: 'مدة التوصيل؟', a: '7-14 يوم عمل.' },
      { q: 'لأي عمر؟', a: '2-12 سنة.' },
      { q: 'اختيار القيم؟', a: 'نعم، حتى 3 قيم.' },
      { q: 'بدون صورة؟', a: 'ننشئ شخصية من وصفك.' },
      { q: 'لعدة أطفال؟', a: 'طلب منفصل لكل طفل.' },
    ],
    footerTagline: 'نجعل كل طفل هو بطل قصته.',
    ctaTitle: 'هل أنت مستعد لخلق السحر؟', ctaSub: 'انضم إلى مئات العائلات.',
    ctaBtn: '🚀 اطلب قصتي الآن',
  }
}

const LANGUAGES = [
  { code: 'English', flag: '🇬🇧', label: 'English' },
  { code: 'French',  flag: '🇫🇷', label: 'Français' },
  { code: 'Turkish', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'Arabic',  flag: '🇸🇦', label: 'العربية' },
]

const BOOK_COLORS = [
  { bg: '#E76F51', spine: '#C05A3D' },
  { bg: '#F4A261', spine: '#D4883F' },
  { bg: '#2A9D8F', spine: '#1F7A6E' },
  { bg: '#E9C46A', spine: '#C9A44A' },
  { bg: '#8AB17D', spine: '#6A9160' },
  { bg: '#5C7A92', spine: '#3E5F75' },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --primary: #E76F51;
    --primary-d: #C05A3D;
    --primary-l: #F4A261;
    --accent: #2A9D8F;
    --text: #2C363F;
    --muted: #6B7280;
    --card: rgba(255,255,255,0.82);
    --card-border: rgba(229,231,235,0.7);
    --icon-bg: rgba(243,244,246,0.9);
    --step-bg: rgba(255,249,242,0.95);
    --btn-shadow: rgba(44,54,63,0.18);
    --footer: rgba(30,24,18,0.97);
    --page1: #fff;
    --page2: #f3f4f6;
  }
  .dark {
    --text: #F5F0E8;
    --muted: #9CA3AF;
    --card: rgba(35,28,22,0.88);
    --card-border: rgba(60,48,36,0.7);
    --icon-bg: rgba(50,40,30,0.9);
    --step-bg: rgba(42,33,24,0.95);
    --btn-shadow: rgba(0,0,0,0.45);
    --footer: rgba(12,9,6,0.97);
    --page1: #D8D0C4;
    --page2: #C8C0B4;
  }

  .lp { font-family: 'Nunito', sans-serif; color: var(--text); overflow-x: hidden; transition: color 0.4s; }

  /* ── VIDEO BG ── */
  .lp-vbg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
  .lp-vbg video { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); min-width: 100%; min-height: 100%; object-fit: cover; transition: opacity 0.8s; }
  .lp-vbg video.off { opacity: 0; pointer-events: none; }
  .lp-vbg video.on  { opacity: 1; }
  .lp-voverlay { position: fixed; inset: 0; z-index: 1; transition: background 0.6s; }
  .lp:not(.dark) .lp-voverlay { background: rgba(253,251,247,0.52); }
  .lp.dark        .lp-voverlay { background: rgba(12,8,4,0.62); }

  /* Flash on theme toggle */
  .lp-flash { position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0; transition: opacity 0.25s; }
  .lp-flash.on { opacity: 1; }
  .lp:not(.dark) .lp-flash { background: white; }
  .lp.dark        .lp-flash { background: #0C0804; }

  /* ── NAV ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 32px;
    height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px;
    transition: background 0.4s, border-color 0.4s;
  }
  .lp:not(.dark) .lp-nav {
    background: rgba(255,252,248,0.78);
    backdrop-filter: blur(20px) saturate(1.8);
    border-bottom: 1.5px solid rgba(231,111,81,0.18);
    box-shadow: 0 1px 0 rgba(231,111,81,0.08), 0 4px 24px rgba(44,54,63,0.06);
  }
  .lp.dark .lp-nav {
    background: rgba(20,14,8,0.82);
    backdrop-filter: blur(20px) saturate(1.5);
    border-bottom: 1.5px solid rgba(231,111,81,0.12);
    box-shadow: 0 1px 0 rgba(0,0,0,0.3), 0 4px 24px rgba(0,0,0,0.2);
  }

  /* Pill logo */
  .lp-logo {
    font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: 800;
    color: var(--primary);
    display: flex; align-items: center; gap: 6px;
    white-space: nowrap; flex-shrink: 0;
  }
  .lp-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.5); opacity: 0.6; }
  }

  /* Nav links */
  .lp-nav-links { display: flex; gap: 4px; align-items: center; }
  .lp-nav-link {
    padding: 7px 14px; border-radius: 999px;
    color: var(--muted); font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .lp-nav-link:hover { color: var(--primary); background: rgba(231,111,81,0.1); }

  /* Nav right controls */
  .lp-nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  /* Theme toggle */
  .lp-theme {
    width: 40px; height: 40px; border-radius: 12px;
    border: 1.5px solid var(--card-border);
    background: var(--card); color: var(--text);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; cursor: pointer;
    transition: all 0.2s; backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .lp-theme:hover { border-color: var(--primary-l); transform: rotate(15deg) scale(1.08); }

  /* Language pill */
  .lp-lang { position: relative; }
  .lp-lang-pill {
    height: 40px; padding: 0 14px; border-radius: 999px;
    border: 1.5px solid var(--card-border);
    background: var(--card); color: var(--text);
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: all 0.2s; backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    white-space: nowrap;
  }
  .lp-lang-pill:hover { border-color: var(--primary-l); }
  .lp-lang-pill span:last-child { font-size: 11px; opacity: 0.5; }
  .lp-lang-menu {
    position: absolute; top: 50px; right: 0;
    background: var(--card); border: 1.5px solid var(--card-border);
    border-radius: 18px; padding: 8px; min-width: 160px;
    display: flex; flex-direction: column; gap: 2px;
    backdrop-filter: blur(20px); z-index: 200;
    box-shadow: 0 16px 40px rgba(0,0,0,0.14);
    animation: menuIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes menuIn { from{opacity:0;transform:translateY(-8px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  .lp-lang-opt {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 12px; border: none;
    background: transparent; color: var(--text);
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .lp-lang-opt:hover { background: rgba(231,111,81,0.1); color: var(--primary); }
  .lp-lang-opt.active { background: rgba(231,111,81,0.12); color: var(--primary); }
  .lp-lang-opt span:first-child { font-size: 20px; }

  /* CTA nav button */
  .lp-nav-cta {
    height: 40px; padding: 0 20px; border-radius: 999px;
    border: 2px solid var(--text); background: var(--primary); color: white;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
    box-shadow: 3px 3px 0 var(--btn-shadow);
  }
  .lp-nav-cta:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 var(--btn-shadow); background: var(--primary-d); }
  .lp-nav-cta:active { transform: translate(1px,1px); box-shadow: none; }

  /* ── ALL CONTENT ── */
  .lp-body { position: relative; z-index: 2; }

  /* ── HERO ── */
  .lp-hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 120px 20px 80px;
  }
  .lp-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 20px; border-radius: 999px;
    background: var(--card); border: 1.5px solid var(--accent);
    color: var(--accent); font-size: 13px; font-weight: 800;
    margin-bottom: 20px; backdrop-filter: blur(8px);
    box-shadow: 2px 2px 0 rgba(42,157,143,0.12);
    animation: fadeUp 0.5s ease;
  }
  .lp-hero-q { font-size: 17px; font-weight: 700; color: var(--muted); margin-bottom: 10px; animation: fadeUp 0.6s ease; }
  .lp-name-input {
    background: transparent; border: none;
    border-bottom: 4px dashed var(--primary-l);
    font-family: 'Baloo 2', cursive;
    font-size: clamp(40px, 8vw, 80px); font-weight: 800;
    color: var(--primary); text-align: center; outline: none;
    width: 100%; max-width: 560px; margin-bottom: 24px; padding-bottom: 6px;
    transition: border-color 0.2s; animation: fadeUp 0.7s ease;
  }
  .lp-name-input::placeholder { color: rgba(231,111,81,0.28); }
  .lp-name-input:focus { border-bottom-color: var(--primary); }
  .lp-hero-title {
    font-family: 'Baloo 2', cursive;
    font-size: clamp(24px, 4vw, 42px); font-weight: 800;
    color: var(--text); line-height: 1.2; margin-bottom: 18px;
    animation: fadeIn 0.4s ease;
  }
  .lp-hero-sub {
    font-size: clamp(15px, 2vw, 18px); color: var(--muted); max-width: 560px;
    line-height: 1.7; margin-bottom: 36px; font-weight: 600;
  }
  .lp-hero-cta {
    padding: 16px 44px; border-radius: 16px; border: 2px solid var(--text);
    background: var(--primary); color: white;
    font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 5px 5px 0 var(--btn-shadow);
  }
  .lp-hero-cta:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 var(--btn-shadow); background: var(--primary-d); }
  .lp-hero-cta:active { transform: translate(2px,2px); box-shadow: none; }
  .lp-hero-note { margin-top: 14px; color: var(--muted); font-size: 13px; font-weight: 600; }

  /* ── SECTION WRAPPERS ── */
  .lp-wrap { position: relative; transition: background 0.5s; }
  .lp:not(.dark) .lp-wrap.frosted { background: rgba(253,251,247,0.72); }
  .lp.dark        .lp-wrap.frosted { background: rgba(16,11,6,0.72); }
  .lp-wrap.clear  { background: transparent; }

  /* ── STATS ── */
  .lp-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 16px; padding: 48px 24px; max-width: 960px; margin: 0 auto;
  }
  .lp-stat {
    background: var(--card); border: 1.5px solid var(--card-border);
    border-radius: 20px; padding: 28px 20px; text-align: center;
    backdrop-filter: blur(12px); transition: all 0.3s;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.05);
  }
  .lp-stat:nth-child(odd)  { transform: rotate(-1deg); }
  .lp-stat:nth-child(even) { transform: rotate(0.8deg); }
  .lp-stat:hover { transform: translateY(-5px) rotate(0deg) scale(1.02); border-color: var(--primary-l); }
  .lp-stat-num { font-family: 'Baloo 2', cursive; font-size: 40px; font-weight: 800; color: var(--primary); }
  .lp-stat-lbl { color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }

  /* ── SECTION ── */
  .lp-sec { padding: 90px 20px; max-width: 1100px; margin: 0 auto; text-align: center; }
  .lp-tag { display: inline-block; padding: 5px 14px; border-radius: 8px; background: rgba(42,157,143,0.1); color: var(--accent); font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; border: 1.5px solid rgba(42,157,143,0.2); }
  .lp-h2 { font-family: 'Baloo 2', cursive; font-size: clamp(28px,5vw,48px); font-weight: 800; margin-bottom: 12px; color: var(--text); transition: color 0.4s; }
  .lp-sub { color: var(--muted); font-size: 17px; margin-bottom: 52px; font-weight: 600; }

  /* ── CARD ── */
  .lp-card {
    background: var(--card); border: 1.5px solid var(--card-border);
    border-radius: 18px; padding: 32px 24px;
    transition: all 0.3s; backdrop-filter: blur(12px);
    box-shadow: 5px 5px 0 rgba(0,0,0,0.05); position: relative;
  }
  .lp-card:hover { transform: translateY(-5px); box-shadow: 7px 7px 0 rgba(231,111,81,0.12); border-color: var(--primary-l); }

  /* ── HOW IT WORKS ── */
  .lp-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .lp-step { text-align: left; background: var(--step-bg); border-color: rgba(244,162,97,0.4); }
  .lp-step-num {
    position: absolute; top: -18px; left: 24px;
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--primary); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; transform: rotate(-5deg);
    box-shadow: 2px 2px 0 rgba(0,0,0,0.12);
  }
  .lp-step-icon { font-size: 40px; margin: 18px 0 12px; display: block; }
  .lp-step-title { font-family: 'Baloo 2', cursive; font-size: 18px; font-weight: 800; margin-bottom: 8px; color: var(--text); }
  .lp-step-desc { color: var(--muted); font-size: 14px; line-height: 1.6; font-weight: 600; }

  /* ── FEATURES ── */
  .lp-feats { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .lp-feat-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--icon-bg); border: 2px dashed var(--card-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; margin: 0 auto 18px; transition: background 0.4s;
  }

  /* ── OUR WORK — MAGAZINE GRID ── */
  .lp-work-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 0 auto 48px;
    max-width: 960px;
  }
  .lp-story-card {
    position: relative; border-radius: 16px; overflow: hidden;
    aspect-ratio: 12 / 8.5;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    border: 2px solid var(--card-border);
  }
  .lp-story-card:hover {
    transform: translateY(-8px) scale(1.03) rotate(-0.5deg);
    box-shadow: 0 20px 48px rgba(0,0,0,0.28);
    border-color: var(--primary-l);
    z-index: 2;
  }
  .lp-story-card img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s;
  }
  .lp-story-card:hover img { transform: scale(1.06); }
  .lp-story-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    padding: 20px; font-family: 'Baloo 2', cursive;
  }
  .lp-story-placeholder span:first-child { font-size: 36px; }
  .lp-story-placeholder span:last-child { font-size: 15px; font-weight: 800; color: white; text-align: center; }
  .lp-story-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.3s;
    display: flex; align-items: flex-end; padding: 14px;
  }
  .lp-story-card:hover .lp-story-overlay { opacity: 1; }
  .lp-story-title-overlay {
    font-family: 'Baloo 2', cursive; font-size: 14px; font-weight: 800;
    color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  /* Work CTAs */
  .lp-work-ctas { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .lp-btn-outline {
    padding: 13px 28px; border-radius: 12px;
    border: 2px solid var(--text); background: var(--card); color: var(--text);
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
    box-shadow: 4px 4px 0 var(--btn-shadow);
  }
  .lp-btn-outline:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--btn-shadow); }
  .lp-btn-primary {
    padding: 13px 28px; border-radius: 12px;
    border: 2px solid var(--text); background: var(--primary); color: white;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 4px 4px 0 var(--btn-shadow);
  }
  .lp-btn-primary:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--btn-shadow); background: var(--primary-d); }
  .lp-btn-primary:active, .lp-btn-outline:active { transform: translate(2px,2px); box-shadow: none; }

  /* ── REVIEWS — STICKY NOTES ── */
  .lp-reviews { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
  .lp-review {
    padding: 28px 24px; background: var(--card);
    border-radius: 4px; border: 8px solid var(--card);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1); backdrop-filter: blur(12px);
    text-align: left; transition: background 0.4s;
  }
  .lp-review:nth-child(1) { transform: rotate(-1.5deg); }
  .lp-review:nth-child(2) { transform: rotate(0.8deg) translateY(6px); }
  .lp-review:nth-child(3) { transform: rotate(-0.6deg); }
  .lp-review-stars { display: flex; gap: 3px; margin-bottom: 12px; }
  .lp-review-star { font-size: 18px; }
  .lp-review-text { font-size: 15px; line-height: 1.6; color: var(--text); font-style: italic; margin-bottom: 18px; transition: color 0.4s; }
  .lp-review-name { font-weight: 800; color: var(--primary); font-family: 'Baloo 2', cursive; font-size: 17px; text-align: right; }

  /* ── FAQ ── */
  .lp-faqs { display: flex; flex-direction: column; gap: 12px; max-width: 740px; margin: 0 auto; text-align: left; }
  .lp-faq { overflow: hidden; transition: all 0.3s; }
  .lp-faq:hover { border-color: var(--primary-l); transform: translateX(3px); }
  .lp-faq-q { padding: 20px 24px; font-size: 16px; font-family: 'Baloo 2', cursive; font-weight: 800; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--text); }
  .lp-faq-plus { color: var(--primary); font-size: 24px; transition: transform 0.3s; }
  .lp-faq-plus.open { transform: rotate(45deg); }
  .lp-faq-a { padding: 0 24px 18px; color: var(--muted); font-size: 14px; line-height: 1.8; font-weight: 600; border-top: 1px dashed var(--card-border); padding-top: 14px; }

  /* ── CTA ── */
  .lp-cta { text-align: center; padding: 100px 24px; background: var(--accent); color: white; border-top: 4px dashed rgba(255,255,255,0.2); }
  .lp-cta h2 { font-family: 'Baloo 2', cursive; font-size: clamp(28px,5vw,50px); font-weight: 800; margin-bottom: 16px; }
  .lp-cta p  { color: rgba(255,255,255,0.88); font-size: 18px; margin-bottom: 40px; max-width: 540px; margin-left: auto; margin-right: auto; font-weight: 600; }
  .lp-cta-btn { font-size: 19px; padding: 18px 56px; border-radius: 16px; background: white; color: var(--accent); border: 2px solid transparent; box-shadow: 6px 6px 0 rgba(0,0,0,0.18); }
  .lp-cta-btn:hover { background: #f0fafa; box-shadow: 8px 8px 0 rgba(0,0,0,0.24); }

  /* ── FOOTER ── */
  .lp-footer { padding: 40px 32px; background: var(--footer); display: flex; align-items: center; justify-content: space-between; color: rgba(255,255,255,0.5); font-size: 14px; flex-wrap: wrap; gap: 16px; transition: background 0.4s; }
  .lp-footer-logo { font-family: 'Baloo 2', cursive; font-size: 24px; font-weight: 800; color: rgba(255,255,255,0.8); }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }

  /* ══════════════════
     MOBILE — THE KEY
  ══════════════════ */
  @media (max-width: 768px) {
    /* NAV mobile */
    .lp-nav { padding: 0 16px; height: 60px; }
    .lp-nav-links { display: none; }
    .lp-nav-cta { display: none; }
    .lp-logo { font-size: 20px; }

    /* Hero mobile */
    .lp-hero { padding: 90px 16px 60px; }
    .lp-name-input { font-size: 36px; }
    .lp-hero-title { font-size: 22px; }
    .lp-hero-sub { font-size: 14px; }
    .lp-hero-cta { font-size: 16px; padding: 14px 32px; }

    /* Stats mobile */
    .lp-stats { grid-template-columns: repeat(2,1fr); gap: 12px; padding: 32px 16px; }
    .lp-stat { padding: 20px 14px; }
    .lp-stat-num { font-size: 30px; }
    .lp-stat:nth-child(odd), .lp-stat:nth-child(even) { transform: none; }

    /* Sections mobile */
    .lp-sec { padding: 60px 16px; }
    .lp-h2 { font-size: 26px; }
    .lp-sub { font-size: 15px; margin-bottom: 32px; }

    /* Steps mobile — 2 col */
    .lp-steps { grid-template-columns: repeat(2,1fr); gap: 14px; }

    /* Features mobile — 1 col */
    .lp-feats { grid-template-columns: 1fr; gap: 14px; }

    /* Work grid mobile — 2 col */
    .lp-work-grid { grid-template-columns: repeat(2,1fr); gap: 12px; }

    /* Reviews mobile — 1 col */
    .lp-reviews { grid-template-columns: 1fr; gap: 20px; }
    .lp-review:nth-child(1),
    .lp-review:nth-child(2),
    .lp-review:nth-child(3) { transform: none; }

    /* CTA mobile */
    .lp-cta { padding: 70px 20px; }
    .lp-cta-btn { font-size: 16px; padding: 16px 36px; }

    /* Footer mobile */
    .lp-footer { flex-direction: column; text-align: center; justify-content: center; padding: 32px 20px; }

    /* Work CTAs mobile */
    .lp-work-ctas { flex-direction: column; align-items: stretch; }
    .lp-work-ctas button { text-align: center; }
  }

  @media (max-width: 480px) {
    .lp-work-grid { grid-template-columns: 1fr; }
    .lp-steps { grid-template-columns: 1fr; }
    .lp-stats { grid-template-columns: repeat(2,1fr); }
  }
`

const BOOK_COLORS_GRID = [
  'linear-gradient(135deg,#E76F51,#F4A261)',
  'linear-gradient(135deg,#2A9D8F,#57CC99)',
  'linear-gradient(135deg,#E9C46A,#F4A261)',
  'linear-gradient(135deg,#5C7A92,#8AB1C4)',
  'linear-gradient(135deg,#8AB17D,#57CC99)',
  'linear-gradient(135deg,#E76F51,#C05A3D)',
]

function FAQ({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="lp-faqs">
      {items.map((f, i) => (
        <div key={i} className="lp-faq lp-card" style={{padding:0}}>
          <div className="lp-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            <span className={`lp-faq-plus ${open === i ? 'open' : ''}`}>+</span>
          </div>
          {open === i && <div className="lp-faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  )
}

function WorkGrid({ stories, navigate }) {
  const display = stories.length > 0 ? stories.slice(0,6) : Array(6).fill(null)
  return (
    <div className="lp-work-grid">
      {display.map((story, i) => (
        <div key={i} className="lp-story-card"
          onClick={() => story && navigate(`/story/${story.id}`)}>
          {story?.cover_url ? (
            <>
              <img src={story.cover_url} alt={story.title} />
              <div className="lp-story-overlay">
                <div className="lp-story-title-overlay">{story.title}</div>
              </div>
            </>
          ) : (
            <div className="lp-story-placeholder"
              style={{background: BOOK_COLORS_GRID[i % BOOK_COLORS_GRID.length]}}>
              <span>📖</span>
              <span>{story?.title || 'Coming Soon'}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function VideoBg({ isDark }) {
  const lightRef = useRef(null)
  const darkRef  = useRef(null)
  useEffect(() => {
    lightRef.current?.play().catch(() => {})
    darkRef.current?.play().catch(() => {})
  }, [])
  return (
    <div className="lp-vbg">
      <video ref={lightRef} className={isDark ? 'off' : 'on'} autoPlay muted loop playsInline>
        <source src="/videos/bg-light.webm" type="video/webm" />
        <source src="/videos/bg-light.mp4"  type="video/mp4"  />
      </video>
      <video ref={darkRef} className={isDark ? 'on' : 'off'} autoPlay muted loop playsInline>
        <source src="/videos/bg-dark.webm" type="video/webm" />
        <source src="/videos/bg-dark.mp4"  type="video/mp4"  />
      </video>
    </div>
  )
}

export default function LandingPage() {
  const [lang, setLang]         = useState(() => localStorage.getItem('storykid-lang') || 'English')
  const [isDark, setIsDark]     = useState(() => localStorage.getItem('storykid-theme') === 'dark')
  const [heroName, setHeroName] = useState('')
  const [stories, setStories]   = useState([])
  const [langOpen, setLangOpen] = useState(false)
  const [flash, setFlash]       = useState(false)
  const navigate = useNavigate()
  const t = T[lang] || T.English
  const isRTL = lang === 'Arabic'

  useEffect(() => { localStorage.setItem('storykid-lang', lang)                        }, [lang])
  useEffect(() => { localStorage.setItem('storykid-theme', isDark ? 'dark' : 'light')  }, [isDark])

  useEffect(() => {
    fetch(`${API_BASE}/stories`)
      .then(r => r.json())
      .then(d => { if (d.success) setStories(d.stories.filter(s => s.published !== false)) })
      .catch(() => {})
  }, [])

  const toggleTheme = () => {
    setFlash(true)
    setTimeout(() => { setIsDark(p => !p); setFlash(false) }, 180)
  }

  const goToOrder = () => navigate('/order', { state: { uiLang: lang } })
  const scrollTo  = (id) => { setLangOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  const getDynamicTitle = () => {
    if (!heroName) return t.heroTitleDefault
    if (lang === 'English') return `${heroName}'s Magical Story ✨`
    if (lang === 'French')  return `L'Histoire Magique de ${heroName} ✨`
    if (lang === 'Turkish') return `${heroName}'in Büyülü Hikayesi ✨`
    if (lang === 'Arabic')  return `✨ قصة ${heroName} السحرية`
    return t.heroTitleDefault
  }

  return (
    <>
      <style>{css}</style>
      <div className={`lp ${isDark ? 'dark' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>

        <VideoBg isDark={isDark} />
        <div className="lp-voverlay" />
        <div className={`lp-flash ${flash ? 'on' : ''}`} />

        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-logo">
            ✨ StoryKid
            <div className="lp-logo-dot" />
          </div>

          <div className="lp-nav-links">
            {['how','features','ourwork','reviews','faq'].map((id,i) => (
              <span key={id} className="lp-nav-link" onClick={() => scrollTo(id)}>{t.nav[i]}</span>
            ))}
          </div>

          <div className="lp-nav-right">
            {/* Theme */}
            <button className="lp-theme" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? '🌙' : '☀️'}
            </button>

            {/* Language — FLAGS */}
            <div className="lp-lang">
              <button className="lp-lang-pill" onClick={() => setLangOpen(p => !p)}>
                <span style={{fontSize:20}}>{currentLang.flag}</span>
                <span>▾</span>
              </button>
              {langOpen && (
                <div className="lp-lang-menu">
                  {LANGUAGES.map(({ code, flag, label }) => (
                    <button key={code}
                      className={`lp-lang-opt ${lang === code ? 'active' : ''}`}
                      onClick={() => { setLang(code); setLangOpen(false) }}>
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="lp-nav-cta" onClick={goToOrder}>{t.heroCta}</button>
          </div>
        </nav>

        <div className="lp-body">

          {/* ── HERO ── */}
          <section className="lp-hero">
            <div className="lp-hero-tag">{t.heroTag}</div>
            <div className="lp-hero-q">{t.heroQuestion}</div>
            <input type="text" className="lp-name-input"
              placeholder={
                lang === 'Arabic'  ? 'اسم البطل...' :
                lang === 'French'  ? "Prénom de l'enfant..." :
                lang === 'Turkish' ? 'Çocuğun adı...' :
                "Child's name..."
              }
              value={heroName}
              onChange={e => setHeroName(e.target.value)}
              maxLength={20}
            />
            <h1 className="lp-hero-title">{getDynamicTitle()}</h1>
            <p className="lp-hero-sub">{t.heroSub}</p>
            <button className="lp-hero-cta" onClick={goToOrder}>{t.heroCta}</button>
            <p className="lp-hero-note">{t.heroNote}</p>
          </section>

          {/* ── STATS ── */}
          <div className="lp-wrap frosted">
            <div className="lp-stats">
              {[
                { num:'500+', lbl:t.statsOrders },
                { num:'6',    lbl:t.statsLangs  },
                { num:'7',    lbl:t.statsValues  },
                { num:'7-14', lbl:t.statsDelivery},
              ].map((s,i) => (
                <div key={i} className="lp-stat">
                  <div className="lp-stat-num">{s.num}</div>
                  <div className="lp-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── HOW IT WORKS ── */}
          <div className="lp-wrap frosted" id="how">
            <div className="lp-sec">
              <div className="lp-tag">Process</div>
              <h2 className="lp-h2">{t.howTitle}</h2>
              <p className="lp-sub">{t.howSub}</p>
              <div className="lp-steps">
                {t.steps.map((s,i) => (
                  <div key={i} className="lp-step lp-card">
                    <div className="lp-step-num">{i+1}</div>
                    <span className="lp-step-icon">{s.icon}</span>
                    <div className="lp-step-title">{s.title}</div>
                    <div className="lp-step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── FEATURES ── */}
          <div className="lp-wrap clear" id="features">
            <div className="lp-sec">
              <div className="lp-tag">Features</div>
              <h2 className="lp-h2">{t.featTitle}</h2>
              <p className="lp-sub">{t.featSub}</p>
              <div className="lp-feats">
                {t.features.map((f,i) => (
                  <div key={i} className="lp-card" style={{textAlign:'center'}}>
                    <div className="lp-feat-icon">{f.icon}</div>
                    <div className="lp-step-title">{f.title}</div>
                    <div className="lp-step-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── OUR WORK — MAGAZINE GRID ── */}
          <div className="lp-wrap frosted" id="ourwork">
            <div className="lp-sec">
              <div className="lp-tag">Portfolio</div>
              <h2 className="lp-h2">{t.ourWorkTitle}</h2>
              <p className="lp-sub">{t.ourWorkSub}</p>
              <WorkGrid stories={stories} navigate={navigate} />
              <div className="lp-work-ctas">
                <button className="lp-btn-primary" onClick={goToOrder}>🚀 {t.ourWorkCta}</button>
                <button className="lp-btn-outline" onClick={() => navigate('/our-work')}>👁️ {t.viewAll}</button>
              </div>
            </div>
          </div>

          {/* ── REVIEWS ── */}
          <div className="lp-wrap clear" id="reviews">
            <div className="lp-sec">
              <div className="lp-tag">Reviews</div>
              <h2 className="lp-h2">{t.testiTitle}</h2>
              <p className="lp-sub">{t.testiSub}</p>
              <div className="lp-reviews">
                {t.testimonials.map((r,i) => (
                  <div key={i} className="lp-review">
                    <div className="lp-review-stars">
                      {Array(r.rating).fill(0).map((_,j) => <span key={j} className="lp-review-star">⭐</span>)}
                    </div>
                    <div className="lp-review-text">"{r.text}"</div>
                    <div className="lp-review-name">— {r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="lp-wrap frosted" id="faq">
            <div className="lp-sec">
              <div className="lp-tag">FAQ</div>
              <h2 className="lp-h2">{t.faqTitle}</h2>
              <p className="lp-sub" style={{marginBottom:32}}></p>
              <FAQ items={t.faqs} />
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="lp-cta">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSub}</p>
            <button className="lp-btn-primary lp-cta-btn" onClick={goToOrder}>{t.ctaBtn}</button>
          </div>

          {/* ── FOOTER ── */}
          <footer className="lp-footer">
            <div className="lp-footer-logo">✨ StoryKid</div>
            <div>{t.footerTagline}</div>
            <div>© 2026 StoryKid. All rights reserved.</div>
          </footer>

        </div>
      </div>
    </>
  )
}
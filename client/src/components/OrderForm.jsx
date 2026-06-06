import { useState, useEffect } from 'react'
import { API_BASE } from '../api'
import { useLocation, useNavigate } from 'react-router-dom'

const TRANSLATIONS = {
  English: {
    tagline: "A magical story crafted just for your child",
    step1Title: "👶 About your child",
    childName: "Child's first name",
    childNamePlaceholder: "e.g. Adam",
    age: "Age",
    agePlaceholder: "e.g. 6",
    storyLanguage: "Story language",
    step2Title: "🦁 Interests & Values",
    interests: "What does your child love?",
    interestsPlaceholder: "e.g. lions, football, dinosaurs",
    characters: "Favorite heroes or characters",
    charactersPlaceholder: "e.g. Superman, Simba, Spiderman",
    valuesLabel: "Values to teach",
    valuesHint: "pick up to 3",
    selected: "selected",
    step3Title: "📦 Almost done!",
    emailLabel: "Your email",
    emailPlaceholder: "parent@email.com",
    specialRequest: "Special request",
    specialRequestPlaceholder: "Anything specific you want in the story? (optional)",
    photoLabel: "Your child's photo",
    photoUpload: "Click to upload a photo",
    photoHint: "JPG or PNG • Will be turned into a 3D cartoon character",
    langLabel: "Language:", lovesLabel: "Loves:", heroesLabel: "Heroes:", valuesSum: "Values:",
    back: "← Back", next: "Next →", order: "🚀 Order My Story",
    generating: "Sending your order...", generatingHint: "We are securely saving your details",
    values: ['Bravery', 'Loyalty', 'Honesty', 'Kindness', 'Perseverance', 'Respect', 'Courage'],
    orderReceived: "Order received!",
    orderMessage: (name) => `Thank you! ${name}'s personalized story will be prepared and sent to you soon.`,
    newOrder: "← New Order",
  },
  French: {
    tagline: "Une histoire magique créée pour votre enfant",
    step1Title: "👶 À propos de votre enfant",
    childName: "Prénom de l'enfant", childNamePlaceholder: "ex. Adam",
    age: "Âge", agePlaceholder: "ex. 6",
    storyLanguage: "Langue de l'histoire",
    step2Title: "🦁 Intérêts & Valeurs",
    interests: "Qu'est-ce que votre enfant aime?", interestsPlaceholder: "ex. lions, football, dinosaures",
    characters: "Héros ou personnages préférés", charactersPlaceholder: "ex. Superman, Simba, Spiderman",
    valuesLabel: "Valeurs à enseigner", valuesHint: "choisissez jusqu'à 3", selected: "sélectionnés",
    step3Title: "📦 Presque terminé!", emailLabel: "Votre email", emailPlaceholder: "parent@email.com",
    specialRequest: "Demande spéciale", specialRequestPlaceholder: "Quelque chose de spécifique? (optionnel)",
    photoLabel: "Photo de votre enfant", photoUpload: "Cliquez pour télécharger", photoHint: "JPG ou PNG • Transformé en 3D cartoon",
    langLabel: "Langue:", lovesLabel: "Aime:", heroesLabel: "Héros:", valuesSum: "Valeurs:",
    back: "← Retour", next: "Suivant →", order: "🚀 Commander mon histoire",
    generating: "Envoi de votre commande...", generatingHint: "Nous enregistrons vos informations",
    values: ['Courage', 'Loyauté', 'Honnêteté', 'Gentillesse', 'Persévérance', 'Respect', 'Bravoure'],
    orderReceived: "Commande reçue!",
    orderMessage: (name) => `Merci! L'histoire de ${name} sera préparée et envoyée bientôt.`,
    newOrder: "← Nouvelle commande",
  },
  Arabic: {
    tagline: "قصة سحرية مصممة خصيصاً لطفلك",
    step1Title: "👶 معلومات عن طفلك",
    childName: "اسم الطفل", childNamePlaceholder: "مثال: آدم",
    age: "العمر", agePlaceholder: "مثال: 6",
    storyLanguage: "لغة القصة",
    step2Title: "🦁 الاهتمامات والقيم",
    interests: "ماذا يحب طفلك؟", interestsPlaceholder: "مثال: الأسود، كرة القدم",
    characters: "الأبطال أو الشخصيات المفضلة", charactersPlaceholder: "مثال: سوبرمان، سيمبا",
    valuesLabel: "القيم المراد تعليمها", valuesHint: "اختر حتى 3", selected: "تم اختيارهم",
    step3Title: "📦 اكتمل تقريباً!", emailLabel: "بريدك الإلكتروني", emailPlaceholder: "parent@email.com",
    specialRequest: "طلب خاص", specialRequestPlaceholder: "هل تريد إضافة شيء مميز؟ (اختياري)",
    photoLabel: "صورة طفلك", photoUpload: "انقر لرفع صورة", photoHint: "JPG أو PNG • شخصية كرتونية ثلاثية الأبعاد",
    langLabel: "اللغة:", lovesLabel: "يحب:", heroesLabel: "الأبطال:", valuesSum: "القيم:",
    back: "→ رجوع", next: "→ التالي", order: "🚀 اطلب قصتي",
    generating: "جاري إرسال طلبك...", generatingHint: "نحن نقوم بحفظ بياناتك بأمان",
    values: ['الشجاعة', 'الوفاء', 'الصدق', 'اللطف', 'المثابرة', 'الاحترام', 'البسالة'],
    orderReceived: "تم استلام طلبك!",
    orderMessage: (name) => `شكراً! سيتم إعداد قصة ${name} وإرسالها إليك قريباً.`,
    newOrder: "← طلب جديد",
  },
  Spanish: {
    tagline: "Una historia mágica creada para tu hijo",
    step1Title: "👶 Sobre tu hijo",
    childName: "Nombre del niño", childNamePlaceholder: "ej. Adán",
    age: "Edad", agePlaceholder: "ej. 6",
    storyLanguage: "Idioma de la historia",
    step2Title: "🦁 Intereses y Valores",
    interests: "¿Qué le gusta a tu hijo?", interestsPlaceholder: "ej. leones, fútbol",
    characters: "Héroes o personajes favoritos", charactersPlaceholder: "ej. Superman, Simba",
    valuesLabel: "Valores a enseñar", valuesHint: "elige hasta 3", selected: "seleccionados",
    step3Title: "📦 ¡Casi listo!", emailLabel: "Tu correo electrónico", emailPlaceholder: "padre@correo.com",
    specialRequest: "Petición especial", specialRequestPlaceholder: "¿Algo específico? (opcional)",
    photoLabel: "Foto de tu hijo", photoUpload: "Haz clic para subir una foto", photoHint: "JPG o PNG • Personaje 3D animado",
    langLabel: "Idioma:", lovesLabel: "Le encanta:", heroesLabel: "Héroes:", valuesSum: "Valores:",
    back: "← Atrás", next: "Siguiente →", order: "🚀 Pedir mi historia",
    generating: "Enviando tu pedido...", generatingHint: "Guardando tus datos de forma segura",
    values: ['Valentía', 'Lealtad', 'Honestidad', 'Bondad', 'Perseverancia', 'Respeto', 'Coraje'],
    orderReceived: "¡Pedido recibido!",
    orderMessage: (name) => `¡Gracias! La historia de ${name} será preparada y enviada pronto.`,
    newOrder: "← Nuevo pedido",
  },
  Russian: {
    tagline: "Волшебная история, созданная для вашего ребёнка",
    step1Title: "👶 О вашем ребёнке",
    childName: "Имя ребёнка", childNamePlaceholder: "напр. Адам",
    age: "Возраст", agePlaceholder: "напр. 6",
    storyLanguage: "Язык истории",
    step2Title: "🦁 Интересы и Ценности",
    interests: "Что любит ваш ребёнок?", interestsPlaceholder: "напр. львы, футбол",
    characters: "Любимые герои или персонажи", charactersPlaceholder: "напр. Супермен, Симба",
    valuesLabel: "Ценности для воспитания", valuesHint: "выберите до 3", selected: "выбрано",
    step3Title: "📦 Почти готово!", emailLabel: "Ваш email", emailPlaceholder: "родитель@почта.com",
    specialRequest: "Особое пожелание", specialRequestPlaceholder: "Что-то особенное? (необязательно)",
    photoLabel: "Фото вашего ребёнка", photoUpload: "Нажмите чтобы загрузить", photoHint: "JPG или PNG • 3D мультяшный персонаж",
    langLabel: "Язык:", lovesLabel: "Любит:", heroesLabel: "Герои:", valuesSum: "Ценности:",
    back: "← Назад", next: "Далее →", order: "🚀 Заказать историю",
    generating: "Отправка заказа...", generatingHint: "Надёжно сохраняем ваши данные",
    values: ['Храбрость', 'Верность', 'Честность', 'Доброта', 'Упорство', 'Уважение', 'Мужество'],
    orderReceived: "Заказ получен!",
    orderMessage: (name) => `Спасибо! История для ${name} будет подготовлена и отправлена вам.`,
    newOrder: "← Новый заказ",
  },
  Turkish: {
    tagline: "Çocuğunuz için özel hazırlanmış sihirli bir hikaye",
    step1Title: "👶 Çocuğunuz hakkında",
    childName: "Çocuğun adı", childNamePlaceholder: "örn. Ahmet",
    age: "Yaş", agePlaceholder: "örn. 6",
    storyLanguage: "Hikaye dili",
    step2Title: "🦁 İlgi Alanları & Değerler",
    interests: "Çocuğunuz neyi sever?", interestsPlaceholder: "örn. aslanlar, futbol",
    characters: "Favori kahramanlar veya karakterler", charactersPlaceholder: "örn. Süpermen, Simba",
    valuesLabel: "Öğretilecek değerler", valuesHint: "en fazla 3 seçin", selected: "seçildi",
    step3Title: "📦 Neredeyse bitti!", emailLabel: "E-posta adresiniz", emailPlaceholder: "ebeveyn@eposta.com",
    specialRequest: "Özel istek", specialRequestPlaceholder: "Özel bir şey eklemek ister misiniz? (isteğe bağlı)",
    photoLabel: "Çocuğunuzun fotoğrafı", photoUpload: "Fotoğraf yüklemek için tıklayın", photoHint: "JPG veya PNG • 3D karikatür karaktere dönüştürülecek",
    langLabel: "Dil:", lovesLabel: "Seviyor:", heroesLabel: "Kahramanlar:", valuesSum: "Değerler:",
    back: "← Geri", next: "İleri →", order: "🚀 Hikayemi Sipariş Et",
    generating: "Siparişiniz gönderiliyor...", generatingHint: "Bilgilerinizi güvenli bir şekilde kaydediyoruz",
    values: ['Cesaret', 'Sadakat', 'Dürüstlük', 'Nezaket', 'Azim', 'Saygı', 'Yiğitlik'],
    orderReceived: "Siparişiniz alındı!",
    orderMessage: (name) => `Teşekkürler! ${name} için özel hikayesi hazırlanacak ve size ulaştırılacak.`,
    newOrder: "← Yeni Sipariş",
  },
}

const UI_LANGUAGES = [
  { code: 'Turkish', flag: '🇹🇷' },
  { code: 'English', flag: '🇬🇧' },
  { code: 'French', flag: '🇫🇷' },
  { code: 'Arabic', flag: '🇸🇦' },
  { code: 'Spanish', flag: '🇪🇸' },
  { code: 'Russian', flag: '🇷🇺' },
]

const STORY_LANGUAGES = ['English', 'Arabic', 'French', 'Turkish', 'Spanish', 'Russian']
const FLAGS = { English:'🇬🇧', Arabic:'🇸🇦', French:'🇫🇷', Turkish:'🇹🇷', Spanish:'🇪🇸', Russian:'🇷🇺' }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700&display=swap');
  
  :root {
    --bg-main: #FDFBF7;
    --primary-light: #F4A261;
    --primary-main: #E76F51;
    --primary-dark: #D45D40;
    --accent: #2A9D8F;
    --text-main: #2C363F;
    --text-muted: #6B7280;
    --card-bg: #FFFFFF;
    --border-color: #E5E7EB;
    --input-bg: #F9FAFB;
    --highlight-bg: #FFF9F2;
    --btn-shadow: rgba(44, 54, 63, 0.15);
  }

  .dark-mode {
    --bg-main: #1F1B18; 
    --primary-light: #F4A261;
    --primary-main: #E76F51;
    --primary-dark: #D45D40;
    --accent: #2A9D8F;
    --text-main: #FDFBF7;
    --text-muted: #A3A3A3;
    --card-bg: #2A2420;
    --border-color: #3F362F;
    --input-bg: #362E28;
    --highlight-bg: #2E2620;
    --btn-shadow: rgba(0, 0, 0, 0.4);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sk-root {
    min-height: 100vh;
    background-color: var(--bg-main);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    font-family: 'Nunito', sans-serif;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: 60px 16px 80px;
    position: relative; overflow-x: hidden;
    color: var(--text-main);
    transition: background-color 0.4s, color 0.4s;
  }

  /* ── WARM WATERCOLOR BACKGROUNDS ── */
  .sk-bg-blob {
    position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.15;
    animation: floatBlob var(--dur) ease-in-out infinite alternate;
    z-index: 0; pointer-events: none;
  }
  .sk-blob-1 { width: 50vw; height: 50vw; background: var(--primary-light); top: -10vh; left: -10vw; --dur: 15s; }
  .sk-blob-2 { width: 40vw; height: 40vw; background: var(--accent); bottom: -10vh; right: -5vw; --dur: 18s; animation-delay: -5s; }

  @keyframes floatBlob { 
    0% { transform: translate(0, 0) scale(1); } 
    100% { transform: translate(5vw, 5vh) scale(1.05); } 
  }

  /* ── LOGO ── */
  .sk-logo {
    font-family: 'Baloo 2', cursive; font-size: 42px; font-weight: 800;
    color: var(--primary-main); letter-spacing: -1px; margin-bottom: 8px;
    position: relative; z-index: 1;
  }
  .sk-tagline { color: var(--text-muted); font-size: 16px; margin-bottom: 40px; position: relative; z-index: 1; font-weight: 600; transition: color 0.4s; }

  /* ── SCRAPBOOK STEPS ── */
  .sk-steps { display: flex; align-items: center; margin-bottom: 32px; position: relative; z-index: 1; }
  .sk-step-dot {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; transition: all 0.3s;
    border: 2px dashed var(--border-color);
    color: var(--text-muted); background: var(--card-bg);
  }
  .sk-step-dot.active {
    background: var(--primary-main);
    border: 2px solid var(--primary-main); color: white;
    box-shadow: 4px 4px 0px rgba(231, 111, 81, 0.2);
    transform: scale(1.1) rotate(-5deg);
  }
  .sk-step-dot.done { 
    background: var(--highlight-bg); border: 2px solid var(--primary-light); color: var(--primary-main); 
  }
  .sk-step-line { width: 48px; height: 2px; background: var(--border-color); transition: background 0.3s; margin: 0 4px; }
  .sk-step-line.done { background: var(--primary-light); height: 3px; border-radius: 2px; }

  /* ── TACTILE CARD ── */
  .sk-card-wrapper {
    width: 100%; max-width: 540px;
    position: relative; z-index: 1;
  }
  .sk-card {
    background: var(--card-bg); border: 2px solid var(--border-color); border-radius: 16px;
    padding: 40px; width: 100%;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.4s, border-color 0.4s;
    animation: slideUp 0.4s ease;
    box-shadow: 6px 6px 0px rgba(0,0,0,0.04);
  }
  .sk-card:hover {
    transform: translateY(-4px);
    box-shadow: 8px 8px 0px rgba(231, 111, 81, 0.1);
    border-color: var(--primary-light);
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sk-card-title { font-family: 'Baloo 2', cursive; font-size: 26px; font-weight: 800; color: var(--text-main); margin-bottom: 24px; transition: color 0.4s; }
  .sk-label { display: block; font-size: 14px; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; transition: color 0.4s; }
  .sk-field { margin-bottom: 24px; }

  /* ── INPUTS ── */
  .sk-input {
    width: 100%; background: var(--input-bg);
    border: 2px solid var(--border-color); border-radius: 12px;
    padding: 14px 16px; color: var(--text-main);
    font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 600;
    outline: none; transition: all 0.2s;
  }
  .sk-input::placeholder { color: var(--text-muted); font-weight: 400; opacity: 0.6; }
  .sk-input:focus {
    border-color: var(--primary-main);
    background: var(--card-bg);
    box-shadow: 4px 4px 0px rgba(231, 111, 81, 0.1);
  }
  .sk-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

  /* ── LANGUAGE GRID ── */
  .sk-lang-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .sk-lang-btn {
    padding: 12px 8px; border-radius: 12px; border: 2px dashed var(--border-color);
    background: var(--card-bg); color: var(--text-muted);
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; text-align: center;
  }
  .sk-lang-btn:hover { background: var(--highlight-bg); border-color: var(--primary-light); color: var(--primary-main); transform: translateY(-2px); }
  .sk-lang-btn.selected {
    background: var(--highlight-bg);
    border: 2px solid var(--primary-main); color: var(--primary-main);
    box-shadow: 3px 3px 0px rgba(231, 111, 81, 0.15);
  }

  /* ── VALUE CHIPS ── */
  .sk-values-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .sk-value-chip {
    padding: 8px 18px; border-radius: 999px; border: 2px solid var(--border-color);
    background: var(--card-bg); color: var(--text-muted);
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .sk-value-chip:hover { border-color: var(--primary-light); color: var(--primary-main); }
  .sk-value-chip.selected {
    background: var(--primary-main);
    border-color: var(--primary-main); color: white;
    box-shadow: 3px 3px 0px rgba(231, 111, 81, 0.2);
  }

  /* ── BUTTONS ── */
  .sk-btn-row { display: flex; gap: 16px; margin-top: 32px; }
  .sk-btn-back {
    flex: 1; padding: 14px; border-radius: 12px;
    border: 2px solid var(--border-color); background: var(--card-bg);
    color: var(--text-muted); font-family: 'Nunito', sans-serif;
    font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.2s;
  }
  .sk-btn-back:hover { background: var(--input-bg); color: var(--text-main); transform: translate(-2px, -2px); box-shadow: 4px 4px 0px rgba(0,0,0,0.05); }

  .sk-btn-next {
    flex: 2; padding: 14px; border-radius: 12px; border: 2px solid var(--text-main);
    background: var(--primary-main);
    color: white; font-family: 'Nunito', sans-serif;
    font-size: 16px; font-weight: 800; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 4px 4px 0px var(--btn-shadow);
  }
  .sk-btn-next:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--btn-shadow);
  }
  .sk-btn-next:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: 0px 0px 0px transparent; }
  .sk-btn-next:disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--border-color); background: var(--border-color); box-shadow: none; color: white; }

  /* ── SUMMARY ── */
  .sk-summary {
    background: var(--highlight-bg); border: 2px dashed var(--primary-light);
    border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 12px;
    margin-top: 24px; position: relative; transition: background-color 0.4s;
  }
  .sk-summary-row { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--text-muted); }
  .sk-summary-row span:first-child { font-size: 20px; }
  .sk-summary-row strong { color: var(--text-main); font-weight: 800; }
  .sk-hint { font-size: 13px; color: var(--text-muted); margin-top: 6px; font-weight: 600;}

  /* ── PHOTO UPLOAD ── */
  .sk-photo-upload {
    width: 100%; min-height: 160px; border: 2px dashed var(--border-color);
    border-radius: 12px; background: var(--input-bg);
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .sk-photo-upload:hover {
    border-color: var(--primary-light); background: var(--highlight-bg);
  }
  .sk-photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; text-align: center; }
  .sk-photo-icon { font-size: 36px; margin-bottom: 4px; }
  .sk-photo-text { color: var(--text-main); font-size: 15px; font-weight: 700; transition: color 0.4s; }
  .sk-photo-hint { color: var(--text-muted); font-size: 13px; transition: color 0.4s; }
  .sk-photo-preview { position: relative; width: 100%; height: 180px; padding: 8px; }
  .sk-photo-preview img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color); }
  .sk-photo-remove {
    position: absolute; top: 16px; right: 16px; width: 32px; height: 32px;
    border-radius: 50%; background: var(--card-bg); border: 2px solid var(--text-main); color: var(--text-main);
    font-size: 14px; font-weight: bold; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  }
  .sk-photo-remove:hover { background: #FEE2E2; border-color: #EF4444; color: #EF4444; transform: scale(1.05); }

  /* ── TOP CONTROLS (THEME & LANG) ── */
  .sk-top-controls {
    position: absolute; top: 24px; right: 24px; z-index: 100;
    display: flex; gap: 12px; align-items: center;
  }
  .sk-home-btn {
    padding: 10px 16px; border-radius: 12px;
    background: var(--card-bg); border: 2px solid var(--border-color);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.05); color: var(--text-main);
    font-family: 'Nunito', sans-serif;
  }
  .sk-home-btn:hover {
    background: var(--input-bg); border-color: var(--primary-main); color: var(--primary-main);
    transform: translate(-2px, -2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.08);
  }
  .sk-theme-btn {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--card-bg); border: 2px solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; cursor: pointer; transition: all 0.2s;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.05); color: var(--text-main);
  }
  .sk-theme-btn:hover {
    background: var(--input-bg); border-color: var(--primary-light);
    transform: translate(-2px, -2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.08);
  }

  /* ── LANGUAGE SWITCHER ── */
  .sk-lang-switcher { position: relative; }
  .sk-lang-globe {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--card-bg); border: 2px solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; cursor: pointer; transition: all 0.2s;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.05);
  }
  .sk-lang-globe:hover {
    background: var(--input-bg); border-color: var(--primary-light);
    transform: translate(-2px, -2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.08);
  }
  .sk-lang-dropdown {
    position: absolute; top: 54px; right: 0;
    background: var(--card-bg); border: 2px solid var(--border-color); border-radius: 12px;
    padding: 8px; min-width: 160px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: 6px 6px 0px rgba(0,0,0,0.05);
    animation: slideUp 0.2s ease;
  }
  .sk-lang-option {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px; border: none;
    background: transparent; color: var(--text-main);
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; text-align: left; width: 100%;
  }
  .sk-lang-option:hover { background: var(--input-bg); color: var(--primary-main); }
  .sk-lang-option.active { background: var(--highlight-bg); color: var(--primary-main); }
  .sk-lang-option span:first-child { font-size: 18px; }
  .sk-rtl { direction: rtl; }

  /* ── SPINNER ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .sk-spinner {
    width: 56px; height: 56px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-main); border-radius: 50%;
    animation: spin 0.85s linear infinite; margin: 0 auto;
  }

  /* ── SUCCESS ICON ── */
  .sk-success-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: var(--accent); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; margin: 0 auto 24px;
    border: 4px solid white; box-shadow: 0 0 0 4px rgba(42, 157, 143, 0.2);
    animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* ── ERROR ── */
  .sk-error {
    margin-top: 16px; background: #FEF2F2;
    border: 2px dashed #FECACA; border-radius: 12px;
    padding: 14px 18px; color: #DC2626; font-size: 14px; font-weight: 600;
    max-width: 540px; width: 100%; z-index: 1; position: relative;
    animation: slideUp 0.3s ease; text-align: center;
  }
`

function BackgroundBlobs() {
  return (
    <>
      <div className="sk-bg-blob sk-blob-1" />
      <div className="sk-bg-blob sk-blob-2" />
    </>
  )
}

function Card({ children, className, style }) {
  return (
    <div className="sk-card-wrapper">
      <div className={`sk-card ${className||''}`} style={style}>
        {children}
      </div>
    </div>
  )
}

const EMPTY_FORM = {
  childName: '', age: '', language: '',
  interests: '', characters: '',
  selectedValues: [], parentEmail: '',
  specialRequest: '', photo: null, photoPreview: null,
  storyId: null, storyTitle: '', storyCover: null, storyPrice: null,
}

export default function OrderForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [uiLang, setUiLang] = useState(() => location.state?.uiLang || localStorage.getItem('storykid-lang') || 'English')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('storykid-theme') === 'dark')
  useEffect(() => { localStorage.setItem('storykid-theme', isDark ? 'dark' : 'light') }, [isDark])
  
  const [form, setForm] = useState(() => {
    const state = location.state || {}
    return {
      ...EMPTY_FORM,
      storyId: state.storyId || null,
      storyTitle: state.title || '',
      storyCover: state.cover || null,
      storyPrice: state.price || null,
      childName: state.childName || '',
      age: state.age || '',
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { localStorage.setItem('storykid-lang', uiLang) }, [uiLang])
  useEffect(() => { localStorage.setItem('storykid-theme', isDark ? 'dark' : 'light') }, [isDark])

  const t = TRANSLATIONS[uiLang] || TRANSLATIONS.English
  const isRTL = uiLang === 'Arabic'

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleValue = (val) => {
    setForm(prev => ({
      ...prev,
      selectedValues: prev.selectedValues.includes(val)
        ? prev.selectedValues.filter(v => v !== val)
        : prev.selectedValues.length < 3
          ? [...prev.selectedValues, val]
          : prev.selectedValues
    }))
  }

  const handleUiLangChange = (lang) => {
    setUiLang(lang)
    setShowLangMenu(false)
    setForm(prev => ({ ...prev, selectedValues: [] }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('childName', form.childName)
      formData.append('age', form.age)
      formData.append('language', form.language)
      formData.append('interests', form.interests)
      formData.append('characters', form.characters)
      formData.append('selectedValues', JSON.stringify(form.selectedValues))
      formData.append('parentEmail', form.parentEmail)
      formData.append('specialRequest', form.specialRequest)
      if (form.photo) formData.append('photo', form.photo)

      const res = await fetch(`${API_BASE}/submit-order`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setStep(1)
    setForm(EMPTY_FORM)
    setError(null)
  }

  return (
    <>
      <style>{css}</style>
      <div className={`sk-root ${isRTL ? 'sk-rtl' : ''} ${isDark ? 'dark-mode' : ''}`}>
        
        <BackgroundBlobs />

        {/* Top Controls: Theme & Language Switcher */}
        <div className="sk-top-controls">
          <button 
            className="sk-home-btn"
            onClick={() => navigate('/')}
            aria-label="Back to Home"
          >
            ← Home
          </button>

          <button 
            className="sk-theme-btn" 
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
          
          <div className="sk-lang-switcher">
            <div className="sk-lang-globe" onClick={() => setShowLangMenu(p => !p)}>🌐</div>
            {showLangMenu && (
              <div className="sk-lang-dropdown">
                {UI_LANGUAGES.map(({ code, flag }) => (
                  <button key={code}
                    className={`sk-lang-option ${uiLang === code ? 'active' : ''}`}
                    onClick={() => handleUiLangChange(code)}>
                    <span>{flag}</span><span>{code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sk-logo">StoryKid</div>
        <p className="sk-tagline">{t.tagline}</p>

        {/* Progress */}
        {!submitted && !loading && (
          <div className="sk-steps">
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`sk-step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`}>
                  {step > s ? '✓' : s}
                </div>
                {i < 2 && <div className={`sk-step-line ${step > s ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && !submitted && !loading && (
          <Card>
            <div className="sk-card-title">{t.step1Title}</div>
            <div className="sk-field">
              <label className="sk-label">{t.childName}</label>
              <input className="sk-input" placeholder={t.childNamePlaceholder}
                value={form.childName} onChange={e => update('childName', e.target.value)} />
            </div>
            <div className="sk-field">
              <label className="sk-label">{t.age}</label>
              <input className="sk-input" placeholder={t.agePlaceholder} type="number" min="2" max="12"
                value={form.age} onChange={e => update('age', e.target.value)} />
            </div>
            <div className="sk-field">
              <label className="sk-label">{t.storyLanguage}</label>
              <div className="sk-lang-grid">
                {STORY_LANGUAGES.map(lang => (
                  <button key={lang} className={`sk-lang-btn ${form.language === lang ? 'selected' : ''}`}
                    onClick={() => update('language', lang)}>
                    {FLAGS[lang]} {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="sk-btn-row">
              <button className="sk-btn-next"
                disabled={!form.childName || !form.age || !form.language}
                onClick={() => setStep(2)}>
                {t.next}
              </button>
            </div>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && !submitted && !loading && (
          <Card>
            <div className="sk-card-title">{t.step2Title}</div>
            <div className="sk-field">
              <label className="sk-label">{t.interests}</label>
              <input className="sk-input" placeholder={t.interestsPlaceholder}
                value={form.interests} onChange={e => update('interests', e.target.value)} />
            </div>
            <div className="sk-field">
              <label className="sk-label">{t.characters}</label>
              <input className="sk-input" placeholder={t.charactersPlaceholder}
                value={form.characters} onChange={e => update('characters', e.target.value)} />
            </div>
            <div className="sk-field">
              <label className="sk-label">{t.valuesLabel} <span style={{color:'var(--text-muted)', fontWeight:400}}>— {t.valuesHint}</span></label>
              <div className="sk-values-grid">
                {t.values.map(val => (
                  <button key={val} className={`sk-value-chip ${form.selectedValues.includes(val) ? 'selected' : ''}`}
                    onClick={() => toggleValue(val)}>
                    {val}
                  </button>
                ))}
              </div>
              <p className="sk-hint">{form.selectedValues.length}/3 {t.selected}</p>
            </div>
            <div className="sk-btn-row">
              <button className="sk-btn-back" onClick={() => setStep(1)}>{t.back}</button>
              <button className="sk-btn-next"
                disabled={!form.interests || form.selectedValues.length === 0}
                onClick={() => setStep(3)}>
                {t.next}
              </button>
            </div>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && !submitted && !loading && (
          <Card>
            <div className="sk-card-title">{t.step3Title}</div>
            <div className="sk-field">
              <label className="sk-label">{t.emailLabel}</label>
              <input className="sk-input" placeholder={t.emailPlaceholder} type="email"
                value={form.parentEmail} onChange={e => update('parentEmail', e.target.value)} />
            </div>
            <div className="sk-field">
              <label className="sk-label">{t.specialRequest}</label>
              <textarea className="sk-input sk-textarea"
                placeholder={t.specialRequestPlaceholder}
                value={form.specialRequest}
                onChange={e => update('specialRequest', e.target.value)} />
            </div>
            <div className="sk-field">
              <label className="sk-label">{t.photoLabel}</label>
              <div className="sk-photo-upload" onClick={() => document.getElementById('photoInput').click()}>
                {form.photoPreview ? (
                  <div className="sk-photo-preview">
                    <img src={form.photoPreview} alt="child" />
                    <button className="sk-photo-remove" onClick={e => {
                      e.stopPropagation()
                      update('photoPreview', null)
                      update('photo', null)
                    }}>✕</button>
                  </div>
                ) : (
                  <div className="sk-photo-placeholder">
                    <span className="sk-photo-icon">📸</span>
                    <span className="sk-photo-text">{t.photoUpload}</span>
                    <span className="sk-photo-hint">{t.photoHint}</span>
                  </div>
                )}
              </div>
              <input id="photoInput" type="file" accept="image/*" style={{display:'none'}}
                onChange={e => {
                  const file = e.target.files[0]
                  if (!file) return
                  update('photo', file)
                  const reader = new FileReader()
                  reader.onload = ev => update('photoPreview', ev.target.result)
                  reader.readAsDataURL(file)
                }} />
            </div>
            <div className="sk-summary">
              {form.storyTitle && <div className="sk-summary-row"><span>📚</span><span><strong>{form.storyTitle}</strong>{form.storyPrice ? <span> — €{form.storyPrice}</span> : null}</span></div>}
              <div className="sk-summary-row"><span>👶</span><span><strong>{form.childName}</strong>, {t.age.toLowerCase()} {form.age}</span></div>
              <div className="sk-summary-row"><span>🌍</span><span>{t.langLabel} <strong>{form.language}</strong></span></div>
              <div className="sk-summary-row"><span>🦁</span><span>{t.lovesLabel} <strong>{form.interests}</strong></span></div>
              {form.characters && <div className="sk-summary-row"><span>⭐</span><span>{t.heroesLabel} <strong>{form.characters}</strong></span></div>}
              <div className="sk-summary-row"><span>💎</span><span>{t.valuesSum} <strong>{form.selectedValues.join(', ')}</strong></span></div>
            </div>
            <div className="sk-btn-row">
              <button className="sk-btn-back" onClick={() => setStep(2)}>{t.back}</button>
              <button className="sk-btn-next" disabled={!form.parentEmail || loading} onClick={handleSubmit}>
                {t.order}
              </button>
            </div>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <Card style={{textAlign:'center', padding:'48px 36px'}}>
            <div className="sk-spinner" />
            <div className="sk-card-title" style={{marginTop:24, marginBottom:8}}>{t.generating}</div>
            <p style={{color:'var(--text-muted)', fontSize:15, fontWeight: 600}}>{t.generatingHint}</p>
          </Card>
        )}

{/* Success */}
{submitted && !loading && (
  <Card style={{padding:'40px 36px'}}>
    <div style={{textAlign:'center', marginBottom:28}}>
      <div className="sk-success-icon">✓</div>
      <div className="sk-card-title" style={{marginBottom:8}}>{t.orderReceived}</div>
      <p style={{color:'var(--text-muted)', fontSize:15, fontWeight:600, lineHeight:1.6}}>
        {t.orderMessage(form.childName)}
      </p>
    </div>

    {/* Payment Instructions */}
    {/* Contact for Pricing */}
    <div style={{
      background:'var(--highlight-bg)',
      border:'2px dashed var(--primary-light)',
      borderRadius:14, padding:'20px 24px', marginBottom:16,
      textAlign:'center'
    }}>
      <div style={{fontSize:32, marginBottom:10}}>💬</div>
      <div style={{fontWeight:800, fontSize:16, color:'var(--text-main)', marginBottom:8}}>
        {uiLang === 'Turkish' ? 'Fiyat için bizimle iletişime geçin' :
         uiLang === 'Arabic' ? 'تواصل معنا لمعرفة السعر' :
         uiLang === 'French' ? 'Contactez-nous pour le tarif' :
         uiLang === 'Russian' ? 'Свяжитесь с нами для уточнения цены' :
         uiLang === 'Spanish' ? 'Contáctenos para el precio' :
         'Contact us for pricing details'}
      </div>
      <div style={{fontSize:14, color:'var(--text-muted)', fontWeight:600, lineHeight:1.6}}>
        {uiLang === 'Turkish' ? 'Siparişinizi aldık! Fiyat ve ödeme detayları için WhatsApp\'tan bize ulaşın.' :
         uiLang === 'Arabic' ? 'استلمنا طلبك! تواصل معنا عبر واتساب لمعرفة تفاصيل السعر والدفع.' :
         uiLang === 'French' ? 'Votre commande est reçue! Contactez-nous sur WhatsApp pour les détails de paiement.' :
         uiLang === 'Russian' ? 'Ваш заказ получен! Напишите нам в WhatsApp для уточнения цены и оплаты.' :
         uiLang === 'Spanish' ? '¡Pedido recibido! Contáctenos por WhatsApp para los detalles de pago.' :
         'Your order is received! Contact us on WhatsApp for pricing and payment details.'}
      </div>
    </div>

    {/* WhatsApp Button */}
    <a href="https://wa.me/905347199736" target="_blank" rel="noreferrer"
      style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        width:'100%', padding:'14px',
        borderRadius:12, border:'2px solid #25d366',
        background:'#25d366', color:'white',
        fontFamily:'Nunito,sans-serif', fontSize:15,
        fontWeight:800, cursor:'pointer', textDecoration:'none',
        marginBottom:12,
        boxShadow:'4px 4px 0px rgba(37,211,102,0.25)'
      }}>
      <span style={{fontSize:20}}>📱</span>
      {uiLang === 'Turkish' ? 'WhatsApp\'tan Ulaşın' :
       uiLang === 'Arabic' ? 'تواصل عبر واتساب' :
       uiLang === 'French' ? 'Nous contacter sur WhatsApp' :
       uiLang === 'Russian' ? 'Написать в WhatsApp' :
       uiLang === 'Spanish' ? 'Contactar por WhatsApp' :
       'Contact us on WhatsApp'}
    </a>

    <button className="sk-btn-next" style={{width:'100%'}} onClick={resetForm}>
      {t.newOrder}
    </button>
  </Card>
)}

        {/* Error */}
        {error && !loading && <div className="sk-error">{error}</div>}

      </div>
    </>
  )
}
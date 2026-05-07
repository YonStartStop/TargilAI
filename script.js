window.isMotionEnabled = true;

// קוד להפעלת מד ההתקדמות (Progress Indicator) המופיע מתחת לניווט.
// מחשב בזמן אמת (בעת גלילה) את אחוז הגלילה בדף ומעדכן את רוחב האלמנט בהתאם.
window.addEventListener('scroll', function () {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressIndicator = document.getElementById('progressIndicator');
    if (progressIndicator) {
        progressIndicator.style.width = scrolled + '%';
    }

    // הפעלת אנימציית Parallax לצורות הרקע ולאלמנטים אקטיביים
    if (window.isMotionEnabled) {
        const parallaxShapes = document.querySelectorAll('.parallax-shape');
        parallaxShapes.forEach(shape => {
            const speed = parseFloat(shape.getAttribute('data-speed'));
            const yPos = winScroll * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });

        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(el => {
            if (!el.dataset.initialY) {
                // שומרים את המיקום ההתחלתי של האלמנט פעם אחת
                el.dataset.initialY = el.getBoundingClientRect().top + winScroll; 
            }
            const initialY = parseFloat(el.dataset.initialY);
            const speed = parseFloat(el.getAttribute('data-speed'));
            
            // חישוב המרחק של האלמנט ממרכז המסך
            const distance = (winScroll + window.innerHeight / 2) - initialY;
            const yPos = distance * speed;
            
            // מעדכנים את משתנה ה-CSS בלבד, כך שלא נדרוס את ה-scale של ה-Hover
            el.style.setProperty('--parallax-y', `${yPos}px`);
        });
    }
});

// הגדרת משתני מערכת ל-Canvas האינטראקטיבי.
// ה-Canvas מאפשר למשתמש לצייר עליו, מה שמספק אלמנט אינטראקטיבי ומעודד מעורבות באתר.
const canvas = document.getElementById('interactiveCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // פונקציה לחישוב מדויק של מיקום העכבר או האצבע (במסכי מגע) יחסית ל-Canvas.
    // נדרש כדי שהציור יופיע בנקודה המדויקת שבה המשתמש לוחץ.
    function getPos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        let clientX = evt.clientX;
        let clientY = evt.clientY;

        // תמיכה באירועי מגע (Touch)
        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        }

        // חישוב הקואורדינטות. מכיוון שהדף מוגדר כ-RTL (dir="rtl"),
        // ייתכן והדפדפן מתייחס אחרת ל-left, לכן אנו מנרמלים את המיקום.
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // התחלת ציור (לחיצת עכבר/מגע). הפונקציה מונעת גלילת דף בטלפון בזמן הציור (preventDefault).
    function startPosition(e) {
        e.preventDefault();
        isDrawing = true;
        draw(e);
    }

    // סיום ציור ואיפוס הנתיב כדי שהקווים לא יתחברו אוטומטית בפעם הבאה שמציירים.
    function endPosition() {
        isDrawing = false;
        ctx.beginPath();
    }

    // פונקציית הציור עצמה. מציירת קו עם תכונות שנקבעו מראש (צבע כחול, עובי 3, קצוות עגולים).
    function draw(e) {
        if (!isDrawing) return;
        const pos = getPos(canvas, e);

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0d6efd';

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    // מאזיני אירועים לממשק עכבר רגיל.
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition);

    // מאזיני אירועים למסכי מגע. השימוש ב-passive: false מאפשר לקרוא ל-preventDefault().
    canvas.addEventListener('touchstart', startPosition, { passive: false });
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw, { passive: false });

    // אירוע לחיצה על כפתור מחיקת ה-Canvas המנקה את כל השטח המצויר בו.
    const clearBtn = document.getElementById('clearCanvasBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    // אירוע לחיצה על כפתור שמירת החתימה שמוריד את תוכן ה-Canvas כתמונה.
    const saveBtn = document.getElementById('saveCanvasBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'my-signature.png';
            link.click();
        });
    }
}

// פונקציה לטעינת קבצי Markdown והמרתם ל-HTML באמצעות marked.js.
// מפריד את התוכן מהתצוגה ומאפשר עריכה קלה של הטקסטים ללא צורך לשנות את ה-HTML.
async function loadMarkdownContent(elementId, markdownFile) {
    try {
        const response = await fetch(markdownFile);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = marked.parse(text);
        }
    } catch (error) {
        console.error('Error loading markdown:', markdownFile, error);
    }
}

// קריאה לפונקציות הטעינה עבור כל אחד מחלקי התוכן ברגע שהדף נטען.
document.addEventListener('DOMContentLoaded', () => {
    loadMarkdownContent('hero-content-md', 'content/hero.md');
    loadMarkdownContent('why-vote-content-md', 'content/why-vote.md');
    loadMarkdownContent('how-to-decide-content-md', 'content/how-to-decide.md');
    loadMarkdownContent('how-to-vote-content-md', 'content/how-to-vote.md');

    // ניהול כפתור עצירת/הפעלת סרטון רקע לנגישות
    const videoBtn = document.getElementById('toggle-video-btn');
    const video = document.getElementById('hero-video');
    const toggleText = document.getElementById('toggle-video-text');
    const icon = videoBtn?.querySelector('i');

    if (videoBtn && video && toggleText && icon) {
        videoBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                toggleText.textContent = 'עצור תנועה';
                icon.className = 'bi bi-pause-circle-fill';
                videoBtn.setAttribute('aria-label', 'עצור סרטון ואנימציות');
                window.isMotionEnabled = true;
                // עדכון מיידי של מיקומי הפרלקס
                window.dispatchEvent(new Event('scroll'));
            } else {
                video.pause();
                toggleText.textContent = 'הפעל תנועה';
                icon.className = 'bi bi-play-circle-fill';
                videoBtn.setAttribute('aria-label', 'הפעל סרטון ואנימציות');
                window.isMotionEnabled = false;
                
                // איפוס האנימציות למצב הסטטי (ללא פרלקס)
                document.querySelectorAll('.parallax-shape').forEach(shape => {
                    shape.style.transform = `translateY(0px)`;
                });
                document.querySelectorAll('.parallax-element').forEach(el => {
                    el.style.setProperty('--parallax-y', `0px`);
                });
            }
        });
    }

    // ניהול מונטז' סרטוני רקע - החלפה כל 8 שניות
    const montageVideos = [
        'https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4',
        'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
        'https://videos.pexels.com/video-files/3678380/3678380-hd_1920_1080_30fps.mp4'
    ];
    let currentVideoIndex = 0;

    if (video) {
        setInterval(() => {
            // נחליף סרטון רק אם המשתמש לא עצר את הוידאו
            if (!video.paused) {
                currentVideoIndex = (currentVideoIndex + 1) % montageVideos.length;
                video.src = montageVideos[currentVideoIndex];
                video.play().catch(e => console.error('Video play error:', e));
            }
        }, 8000);
    }
});

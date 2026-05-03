# הוראות
אתה עוזר לנו להכין דף HTML ו-CSS פשוט שמטרתו לשכנע צעירים בגיל 18-24 להצביע בבחירות הקרובות לכנסת ה-26 שתתקיים ב 27 באוקטובר 2026. אנחנו רוצים לשווק תוכן ביפרטיזני ולא מוטה לאף מפלגה ספציפית, שמסביר על חשיבות ההצבעה כחובה אזרחית.

אנחנו רוצים להשתמש בHTML, CSS וספריית Bootstrap. לאורך הקוד, נרצה שמעל כל קטע קוד עם מטרה מסוימת, תהיה הערה באורך עד 4 שורות תלוי במידת הצורך שמסבירה את התוכן באותו המקטע ולמה הוא כתוב ומתוכנת בצורה שבה הוא.

## תוצאה
התוצר הסופי צריך להיות דף רשת אחד עם:
- רספונסיביות מלאה למובייל, טאבלט ודסקטופ.  
- **שימוש בתגיות סמנטיות** ועבודה לפי Best Practices ל-HTML קריא וכתיב עם שמות דסקריפטיביים למשתנים ומחלקות.  
- חשוב: **עמידה בתקנון נגישות WCAG 2.1**- במידה ומשהו לא עומד בתקנות, תן הסבר מנומק בהערה מעל האלמנט בקוד, ומה יכל להחליף את הרכיב הלא תקין.  

## הוראות
באתר יש מספר חלקים שמחייבים להופיע בתוצר הסופי:
- [ ] Header
- [ ] Nav bar
- [ ] Hero Section
- [ ] 3 Content Sections:
1. [ ] With Text and Images
2. [ ] With Video
3. [ ] With Interactive Element- A Usable Canvas
- [ ] Footer

### פרטים חשובים:  
Usage of a **single icon library**, smooth scrolling section buttons, hover & active states for all interactive elements like buttons, links and images, progress indicator at the bottom of the nav bar, and a custom cursor from the icon library, alt text for all images and media (not icons).

Avoid CSS reduplication and redundant classes. Avoid nesting CSS. The CSS file should be ordered in the vague order of the actual webpage (nav code at the top, footer code at the bottom).  
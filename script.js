document.addEventListener('DOMContentLoaded', function() {
    const navIcons = document.querySelectorAll('.side-nav-menu .nav-icon');
    const pageWrappers = document.querySelectorAll('.page-wrapper');
    const currentPageTitleSpan = document.querySelector('.current-page-title');

    // פונקציה להחלפת דף פעיל
    function showPage(pageId) {
        // הסתר את כל הדפים
        pageWrappers.forEach(page => {
            page.classList.remove('active-page');
        });
        // הצג את הדף הנבחר
        const activePage = document.getElementById(pageId + '-page'); // הוספנו סיומת -page ל-ID
        if (activePage) {
            activePage.classList.add('active-page');
            // עדכן את כותרת הדף בסרגל העליון
            const title = document.querySelector(`[data-page="${pageId}"]`).getAttribute('title');
            currentPageTitleSpan.textContent = title;
        }
    }

    // הוסף מאזין לחיצה לכל אייקון ניווט
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault(); // מונע את ה-reload של הדף

            // הסר קלאס active-nav-item מכל האייקונים
            navIcons.forEach(item => item.classList.remove('active-nav-item'));
            // הוסף קלאס active-nav-item לאייקון שנלחץ
            this.classList.add('active-nav-item');

            // הצג את הדף המתאים לפי ה-data-page attribute
            const targetPageId = this.getAttribute('data-page');
            showPage(targetPageId);
        });
    });

    // פונקציונליות בסיסית לעורך הטקסט העשיר (כפתורים)
    document.querySelectorAll('.editor-toolbar button').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            const editor = this.closest('.form-group').querySelector('.rich-text-editor');
            if (editor) {
                editor.focus(); // ודא שהעורך בפוקוס
                if (command === 'createLink') {
                    const url = prompt('הכנס/י כתובת URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else if (command === 'insertImage') {
                    const imageUrl = prompt('הכנס/י כתובת URL של תמונה:');
                    if (imageUrl) {
                        document.execCommand(command, false, imageUrl);
                    }
                }
                else {
                    document.execCommand(command, false, null);
                }
            }
        });
    });

    // פונקציונליות לסימון פריטים ברשימה (List Panels)
    document.querySelectorAll('.item-list li').forEach(item => {
        item.addEventListener('click', function() {
            // הסר את הסימון מכל הפריטים ברשימה הנוכחית
            this.closest('.item-list').querySelectorAll('li').forEach(li => {
                li.classList.remove('selected');
            });
            // סמן את הפריט שנבחר
            this.classList.add('selected');

            // כאן תוכל להוסיף לוגיקה לטעינת נתונים של הפריט הנבחר לתוך פאנל הפרטים
            // לדוגמה, אם זה דף אזרחים, טען את פרטי האזרח הנבחר.
            // כרגע זה רק שינוי ויזואלי.
        });
    });

    // טען את דף הדאשבורד כברירת מחדל בעת טעינת האפליקציה
    showPage('dashboard');
});

document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים של מסך הכניסה
    const loginScreen = document.getElementById('login-screen');
    const policeLoginOption = document.getElementById('police-login-option');
    const teamLoginOption = document.getElementById('team-login-option');
    const policeLoginForm = document.getElementById('police-login-form');
    const teamLoginForm = document.getElementById('team-login-form');
    const backToOptionsPoliceBtn = document.getElementById('back-to-options-police');
    const backToOptionsTeamBtn = document.getElementById('back-to-options-team');
    const policeErrorMessage = document.getElementById('police-error-message');
    const teamErrorMessage = document.getElementById('team-error-message');

    // אלמנטים של המערכת הראשית
    const policeAppContainer = document.getElementById('police-app');
    const navIcons = document.querySelectorAll('.side-nav-menu .nav-icon');
    const pageWrappers = document.querySelectorAll('.page-wrapper');
    const currentPageTitleSpan = document.querySelector('.current-page-title');
    const logoutButton = document.getElementById('logout-button');

    // סיסמאות לדוגמה (לצורך הדגמה בלבד, באפליקציה אמיתית זה יגיע משרת)
    const policeUser = "admin";
    const policePass = "12345";
    const teamUser = "team";
    const teamPass = "54321";

    // פונקציה להצגת טופס כניסה מסוים
    function showLoginForm(formToShow) {
        policeLoginForm.classList.remove('active');
        teamLoginForm.classList.remove('active');
        policeErrorMessage.style.display = 'none';
        teamErrorMessage.style.display = 'none';

        loginScreen.querySelectorAll('.login-option').forEach(option => option.style.display = 'none');

        if (formToShow === 'police') {
            policeLoginForm.classList.add('active');
        } else if (formToShow === 'team') {
            teamLoginForm.classList.add('active');
        }
    }

    // פונקציה לחזרה לאפשרויות הכניסה
    function backToLoginOptions() {
        policeLoginForm.classList.remove('active');
        teamLoginForm.classList.remove('active');
        policeErrorMessage.style.display = 'none';
        teamErrorMessage.style.display = 'none';

        loginScreen.querySelectorAll('.login-option').forEach(option => option.style.display = 'flex'); // הצג שוב את האפשרויות
    }

    // מאזינים לאפשרויות הכניסה
    policeLoginOption.addEventListener('click', function() {
        showLoginForm('police');
    });

    teamLoginOption.addEventListener('click', function() {
        showLoginForm('team');
    });

    // מאזינים לכפתורי "חזור"
    backToOptionsPoliceBtn.addEventListener('click', backToLoginOptions);
    backToOptionsTeamBtn.addEventListener('click', backToLoginOptions);

    // טיפול בהגשת טופס כניסה למשטרה
    policeLoginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // מונע ריענון דף
        const username = document.getElementById('policeUsername').value;
        const password = document.getElementById('policePassword').value;

        if (username === policeUser && password === policePass) {
            loginScreen.classList.remove('active'); // הסתר מסך כניסה
            policeAppContainer.classList.add('active'); // הצג את המערכת הראשית
            showPage('dashboard'); // טען את דף הדאשבורד כברירת מחדל
        } else {
            policeErrorMessage.style.display = 'block'; // הצג הודעת שגיאה
        }
    });

    // טיפול בהגשת טופס כניסה לצוות
    teamLoginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // מונע ריענון דף
        const username = document.getElementById('teamUsername').value;
        const password = document.getElementById('teamPassword').value;

        if (username === teamUser && password === teamPass) {
            alert('התחברת בהצלחה למערכת הצוות! (כרגע אין ממשק ייעודי)');
            // כאן תוכל לנתב למערכת צוות אחרת, או להציג הודעה פנימית
            // לדוגמה, להישאר במסך הכניסה ולהציג רק הודעה:
            // loginScreen.classList.remove('active'); // אם רוצים לצאת ממסך הכניסה
            // policeAppContainer.classList.add('active'); // או להציג את המערכת הרגילה
            // showPage('dashboard'); // ולטעון דף כלשהו
            // אך כרגע נחזיר למסך הכניסה כדי לא להציג את המערכת המשטרתית
             backToLoginOptions(); // חזור לאפשרויות לאחר הכניסה
        } else {
            teamErrorMessage.style.display = 'block'; // הצג הודעת שגיאה
        }
    });


    // ***********************************************************************************
    // פונקציונליות המערכת הראשית (כמו בקוד הקודם)
    // ***********************************************************************************

    // פונקציה להחלפת דף פעיל בתוך המערכת הראשית
    function showPage(pageId) {
        pageWrappers.forEach(page => {
            page.classList.remove('active-page');
        });
        const activePage = document.getElementById(pageId + '-page');
        if (activePage) {
            activePage.classList.add('active-page');
            const title = document.querySelector(`[data-page="${pageId}"]`).getAttribute('title');
            currentPageTitleSpan.textContent = title;
        }
    }

    // הוסף מאזין לחיצה לכל אייקון ניווט בסרגל הצד
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            navIcons.forEach(item => item.classList.remove('active-nav-item'));
            this.classList.add('active-nav-item');
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
                editor.focus();
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
            this.closest('.item-list').querySelectorAll('li').forEach(li => {
                li.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // כפתור התנתקות
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        // הסתר את המערכת הראשית
        policeAppContainer.classList.remove('active');
        // הצג שוב את מסך הכניסה
        loginScreen.classList.add('active');
        // נקה שדות טפסים
        policeLoginForm.reset();
        teamLoginForm.reset();
        // חזור לאפשרויות הכניסה (האייקונים)
        backToLoginOptions();
        // אופציונלי: נקה בחירת דף בסרגל הצד (אבל הדף יוגדר מחדש בדאשבורד בכניסה הבאה)
        navIcons.forEach(item => item.classList.remove('active-nav-item'));
        // סמן את הדאשבורד כפעיל למען הפעם הבאה
        document.querySelector('[data-page="dashboard"]').classList.add('active-nav-item');
    });

    // ***********************************************************************************
    // הדף יתחיל עם מסך הכניסה פעיל
    // ***********************************************************************************
});

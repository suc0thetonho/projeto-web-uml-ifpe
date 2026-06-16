(function () {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark-theme');

    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.getElementById('toggle-tema');
        if (!toggle) return;

        toggle.checked = document.documentElement.classList.contains('dark-theme');

        toggle.addEventListener('change', function () {
            var isDark = toggle.checked;
            document.documentElement.classList.toggle('dark-theme', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    });
})();

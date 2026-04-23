/**
 * @main.js A simple script for the landing page of Flow, handling UI interactions and animations.
 * @version 1.0.0
 * @author Md Nazim Uddin <inadislam@gmail.com>
 * @license MIT
 * @created 2026-03-04
 * For any kind of project you can contact me at inadislam@gmail.com or https://www.facebook.com/mnuddin.dh
 */

$(function () {
    /* ── Render Lucide icons ── */
    if (window.lucide) lucide.createIcons();

    /* ── Smooth scroll ── */
    function smoothTo(sel) {
        var $el = $(sel); if (!$el.length) return;
        $('html,body').animate({ scrollTop: $el.offset().top - ($('#navbar').outerHeight() + 8) }, 700);
    }
    window.smoothTo = smoothTo;

    /* ── Nav shadow on scroll ── */
    $(window).on('scroll', function () { $('#navbar').toggleClass('scrolled', $(window).scrollTop() > 20); });

    /* ── Language switcher ── */
    window.setLang = function (l) {
        $('body').removeClass('en he').addClass(l);
        $('html').attr({ lang: l, dir: l === 'he' ? 'rtl' : 'ltr' });
        $('.lang-btn').removeClass('active');
        if (l === 'en') $('#btn-en,#mbtn-en').addClass('active');
        else $('#btn-he,#mbtn-he').addClass('active');
        if (l === 'he') { $('#fStatEn').hide(); $('#fStatHe').show(); }
        else { $('#fStatHe').hide(); $('#fStatEn').show(); }
    };

    /* ── Mobile nav ── */
    window.toggleMenu = function () { $('#hamburger').toggleClass('open'); $('#mobileNav').toggleClass('open'); };
    window.closeMobile = function () { $('#hamburger').removeClass('open'); $('#mobileNav').removeClass('open'); };

    /* ── Scroll Reveal ── */
    var ro = new IntersectionObserver(function (e) { e.forEach(function (x) { if (x.isIntersecting) { $(x.target).addClass('vis'); ro.unobserve(x.target); } }); }, { threshold: 0.1 });
    $('.rev,.rev-l,.rev-r').each(function () { ro.observe(this); });

    /* ── Animated Flow ── */
    var STEPS = 6, STEP_MS = 2400, cur = 0, timer = null, mTimeout = null, paused = false;
    var statEn = ['Receiving delivery note...', 'Scanning document...', 'Updating ERP automatically...', 'Refreshing inventory & products...', 'Adjusting prices for profitability...', 'Analyzing sales & optimizing orders...'];
    var statHe = ['מקבלים תעודת משלוח...', 'סורקים מסמך...', 'מעדכנים ERP אוטומטית...', 'מרעננים מלאי ומוצרים...', 'מתאימים מחירים לרווחיות...', 'מנתחים מכירות ומאייטמים הזמנות...'];

    function renderStep(n) {
        $('.fstep').removeClass('active').filter('[data-s="' + n + '"]').addClass('active');
        $('#fpFill').css('width', ((n + 1) / STEPS * 100) + '%');
        $('.fv-s').each(function () {
            var s = parseInt($(this).data('s'));
            if (s <= n) { (function (el, delay) { setTimeout(function () { $(el).addClass('vis'); }, delay); })(this, s * 120); }
            else { $(this).removeClass('vis'); }
        });
        if ($('body').hasClass('he')) $('#fStatHe').text(statHe[n]);
        else $('#fStatEn').text(statEn[n]);
    }
    function advance() {
        if (paused) return;
        cur = (cur + 1) % STEPS;
        if (cur === 0) { $('.fv-s').removeClass('vis'); $('#fpFill').css('width', '0%'); setTimeout(function () { renderStep(0); }, 400); }
        else { renderStep(cur); }
    }
    function startAuto() { clearInterval(timer); timer = setInterval(advance, STEP_MS); }
    function goToStep(n) { cur = n; paused = true; clearInterval(timer); clearTimeout(mTimeout); renderStep(n); mTimeout = setTimeout(function () { paused = false; startAuto(); }, 6000); }
    $('.fstep').on('click', function () { goToStep(parseInt($(this).data('s'))); });
    var fo = new IntersectionObserver(function (e) { e.forEach(function (x) { if (x.isIntersecting) { renderStep(0); startAuto(); } else { clearInterval(timer); } }); }, { threshold: 0.2 });
    if ($('#what').length) fo.observe($('#what')[0]);
});

/* ==========================================================
   MDCARE - Classic Professional Theme: jQuery interactions
   ========================================================== */
(function ($) {
    "use strict";

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("html").addClass("js");

    var $win = $(window);
    var $header = $("#siteHeader");
    var $progress = $("#scrollProgress");
    var $toTop = $("#toTop");
    var $parallax = $("[data-parallax]");

    /* ---------- Preloader, then one orchestrated hero sequence ---------- */
    function startHero() {
        var $items = $("[data-hero]");
        if (reduceMotion) {
            $items.css("opacity", 1);
            $("#typed").text("One Connected Platform.");
            return;
        }
        $items.each(function (i) {
            $(this).css({ transform: "translateY(26px)" }).delay(i * 160).animate({ opacity: 1 }, {
                duration: 700,
                step: function (now) {
                    $(this).css("transform", "translateY(" + (26 * (1 - now)) + "px)");
                }
            });
        });
        setTimeout(typeText, 650);
    }

    function typeText() {
        var text = "One Connected Platform.";
        var i = 0;
        var $t = $("#typed");
        (function tick() {
            $t.text(text.slice(0, ++i));
            if (i < text.length) { setTimeout(tick, 55); }
        })();
    }

    function hidePreloader() {
        var $p = $("#preloader");
        if (reduceMotion) { $p.remove(); startHero(); return; }
        $p.find(".preloader-bar span").animate({ width: "100%" }, 700, "swing", function () {
            $p.delay(150).fadeOut(500, function () { $p.remove(); });
            setTimeout(startHero, 300);
        });
    }
    $win.on("load", hidePreloader);
    // Safety net if load never fires
    setTimeout(function () { if ($("#preloader").length && !$("#preloader").is(":animated")) { hidePreloader(); } }, 6000);

    /* ---------- Scroll handling (header, progress, back-to-top, parallax) ---------- */
    var ticking = false;
    function onScroll() {
        var y = $win.scrollTop();
        var max = $(document).height() - $win.height();

        $header.toggleClass("is-fixed", y > 80);
        $progress.css("width", (max > 0 ? (y / max) * 100 : 0) + "%");
        $toTop.toggleClass("show", y > 500);

        if (!reduceMotion && y < $win.height() * 1.2) {
            $parallax.css("transform", "translate3d(0," + (y * 0.25) + "px,0)");
        }
        ticking = false;
    }
    $win.on("scroll resize", function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    });
    onScroll();

    /* ---------- Smooth scrolling ---------- */
    function headerOffset() { return $header.hasClass("is-fixed") ? 70 : 60; }
    $('a[href^="#"]').on("click", function (e) {
        var id = this.getAttribute("href");
        if (id.length < 2) { return; }
        var $target = $(id);
        if (!$target.length) { return; }
        e.preventDefault();
        var top = $target.offset().top - (id === "#home" ? 0 : headerOffset());
        $("html, body").stop().animate({ scrollTop: top }, reduceMotion ? 0 : 900, "swing");
        var nav = document.getElementById("navMenu");
        if (nav && nav.classList.contains("show")) { bootstrap.Collapse.getOrCreateInstance(nav).hide(); }
    });
    $toTop.on("click", function () { $("html, body").stop().animate({ scrollTop: 0 }, reduceMotion ? 0 : 800); });

    /* ---------- Active nav link (scroll spy) ---------- */
    var $sections = $("main section[id]");
    var $links = $("#navMenu .nav-link");
    $win.on("scroll load", function () {
        var pos = $win.scrollTop() + 140;
        var current = "home";
        $sections.each(function () { if ($(this).offset().top <= pos) { current = this.id; } });
        $links.removeClass("active").filter('[href="#' + current + '"]').addClass("active");
    });

    /* ---------- Scroll reveal (uses IntersectionObserver + jQuery animate) ---------- */
    function reveal($el) {
        var dir = $el.data("reveal");
        var delay = parseInt($el.data("delay"), 10) || 0;
        var dist = 40;
        var dx = dir === "left" ? -dist : dir === "right" ? dist : 0;
        var dy = dir === "up" ? dist : 0;
        $el.css("transform", "translate(" + dx + "px," + dy + "px)");
        $el.delay(delay).animate({ opacity: 1 }, {
            duration: 800,
            easing: "swing",
            step: function (now) {
                var k = 1 - now;
                $(this).css("transform", "translate(" + (dx * k) + "px," + (dy * k) + "px)");
            },
            complete: function () { $(this).css("transform", ""); }
        });
    }
    var $reveals = $("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        $reveals.css("opacity", 1);
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { reveal($(en.target)); io.unobserve(en.target); }
            });
        }, { threshold: 0.15 });
        $reveals.each(function () { io.observe(this); });
    }

    /* ---------- Count-up statistics ---------- */
    function runCounters() {
        $(".counter").each(function () {
            var $c = $(this), target = parseInt($c.data("target"), 10) || 0;
            if (reduceMotion) { $c.text(target); return; }
            $({ n: 0 }).animate({ n: target }, {
                duration: 1800, easing: "swing",
                step: function () { $c.text(Math.ceil(this.n)); },
                complete: function () { $c.text(target); }
            });
        });
    }
    var statsEl = document.getElementById("stats");
    if (statsEl && "IntersectionObserver" in window) {
        var so = new IntersectionObserver(function (en) {
            if (en[0].isIntersecting) { runCounters(); so.disconnect(); }
        }, { threshold: 0.4 });
        so.observe(statsEl);
    } else { runCounters(); }

    /* ---------- Feature cards: staggered entrance when a tab opens ---------- */
    function staggerFeat($pane) {
        var $cards = $pane.find(".feat").removeClass("in");
        $cards.each(function (i) {
            var el = this;
            setTimeout(function () { $(el).addClass("in"); }, reduceMotion ? 0 : 90 * i + 40);
        });
    }
    $("#featureTabs button[data-bs-toggle='tab']").on("shown.bs.tab", function (e) {
        staggerFeat($($(e.target).data("bs-target")));
    });
    var featEl = document.getElementById("features");
    if (featEl && "IntersectionObserver" in window) {
        var fo = new IntersectionObserver(function (en) {
            if (en[0].isIntersecting) { staggerFeat($("#pane-adv")); fo.disconnect(); }
        }, { threshold: 0.2 });
        fo.observe(featEl);
    } else { $(".feat").addClass("in"); }

    /* ---------- AI voice waveform + step highlighter ---------- */
    var $wave = $("#wave");
    var bars = 46;
    for (var b = 0; b < bars; b++) { $wave.append("<span></span>"); }
    var $bars = $wave.find("span");
    var waveOn = false, t = 0;

    function drawWave() {
        if (!waveOn) { return; }
        t += 0.12;
        $bars.each(function (i) {
            var env = Math.sin((i / bars) * Math.PI);
            var h = 6 + env * (24 + 26 * Math.abs(Math.sin(t + i * 0.55)) + 10 * Math.random());
            this.style.height = h + "px";
        });
        window.requestAnimationFrame(drawWave);
    }
    var aiEl = document.getElementById("ai");
    if (aiEl && "IntersectionObserver" in window) {
        new IntersectionObserver(function (en) {
            var visible = en[0].isIntersecting;
            if (visible && !waveOn && !reduceMotion) { waveOn = true; drawWave(); }
            if (!visible) { waveOn = false; }
        }, { threshold: 0.2 }).observe(aiEl);
    }
    if (reduceMotion) { $bars.each(function (i) { this.style.height = (8 + Math.sin(i / 3) * 14 + 14) + "px"; }); }

    var $steps = $("#aiSteps li"), stepIdx = 0;
    if (!reduceMotion) {
        setInterval(function () {
            stepIdx = (stepIdx + 1) % $steps.length;
            $steps.removeClass("active").eq(stepIdx).addClass("active");
        }, 2200);
    }

    /* ---------- Button ripple ---------- */
    $(document).on("click", ".btn", function (e) {
        if (reduceMotion) { return; }
        var $btn = $(this), off = $btn.offset();
        var size = Math.max($btn.outerWidth(), $btn.outerHeight());
        var $r = $("<span/>").css({
            position: "absolute", borderRadius: "50%", pointerEvents: "none", background: "rgba(255,255,255,.45)",
            width: size, height: size, left: e.pageX - off.left - size / 2, top: e.pageY - off.top - size / 2,
            transform: "scale(0)", opacity: 1
        });
        if ($btn.css("position") === "static") { $btn.css("position", "relative"); }
        $btn.css("overflow", "hidden").append($r);
        $r.animate({ opacity: 0 }, {
            duration: 600,
            step: function (now) { $(this).css("transform", "scale(" + (2.2 * (1 - now)) + ")"); },
            complete: function () { $r.remove(); }
        });
    });

    /* ---------- Contact form (client-side validation + toast) ---------- */
    $("#contactForm").on("submit", function (e) {
        e.preventDefault();
        var form = this;
        if (!form.checkValidity()) {
            e.stopPropagation();
            $(form).addClass("was-validated");
            $(form).stop().animate({ marginLeft: -8 }, 60).animate({ marginLeft: 8 }, 60).animate({ marginLeft: -5 }, 60).animate({ marginLeft: 0 }, 60);
            return;
        }
        // No backend is connected: hook your endpoint here (fetch/$.ajax) before going live.
        bootstrap.Toast.getOrCreateInstance(document.getElementById("formToast")).show();
        form.reset();
        $(form).removeClass("was-validated");
    });

})(jQuery);

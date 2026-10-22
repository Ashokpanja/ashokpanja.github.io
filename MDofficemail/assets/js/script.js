
document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // MEGA MENU: Show on hover, close when leaving
    // =====================================================

    const cards = document.querySelectorAll(".service-card");
    const megaPanel = document.querySelector(".mega-panel");

    const megaImage = document.getElementById("megaImage");
    const megaTitle = document.getElementById("megaTitle");
    const megaDesc = document.getElementById("megaDesc");
    const megaMenu = document.getElementById("megaMenu");

    let closeTimer = null;

    function showMega(card) {
        clearTimeout(closeTimer);

        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        if (megaTitle) megaTitle.innerHTML = card.dataset.title || "";
        if (megaDesc) megaDesc.innerHTML = card.dataset.desc || "";
        if (megaImage) megaImage.src = card.dataset.image || "";
        if (megaMenu) megaMenu.innerHTML = card.dataset.menu || "";

        if (megaPanel) megaPanel.classList.add("show");
    }

    function hideMega() {
        clearTimeout(closeTimer);

        closeTimer = setTimeout(function () {
            if (megaPanel) megaPanel.classList.remove("show");
            cards.forEach(c => c.classList.remove("active"));
        }, 150);
    }

    cards.forEach(card => {
        card.addEventListener("mouseenter", function () {
            showMega(this);
        });
    });

    if (megaPanel) {
        megaPanel.addEventListener("mouseenter", function () {
            clearTimeout(closeTimer);
        });

        megaPanel.addEventListener("mouseleave", hideMega);
    }

    const servicesSection = document.querySelector(".services-section");

    if (servicesSection) {
        servicesSection.addEventListener("mouseleave", hideMega);
    }


    // =====================================================
    // PRICING: Expand selected plan, hide other two
    // =====================================================

    const planData = {
        email: {
            title: "Email Accounts",
            logo: "assets/img/mdom-tab.jpg",
            subtitle: "Plan Starting from",
            amount: "1.79",
            amountUnit: "/year",
            details: [
                // "1–4 mail accounts",
                // "with annual payment",
                // "with monthly payment - $1.99/mo"
            ],
            className: "plan-email"
        },

        fax: {
            title: "Secure Fax",
            logo: "assets/img/faxtonetab.png",
            subtitle: "Plan Starting from",
            amount: "4.50",
            amountUnit: "/year",
            details: [
                // "1 Fax line + free email",
                // "with annual payment",
                // "monthly payment - $5.00/mo"
            ],
            className: "plan-fax"
        },

        forms: {
            title: "Secure Forms",
            logo: "assets/img/securetab.png",
            subtitle: "Plan Starting from",
            amount: "10.80",
            amountUnit: "/year",
            details: [
                // "requires email account",
                // "with annual payment",
                // "monthly/quarterly - $12.00/mo"
            ],
            className: "plan-forms"
        }
    };

    const pricingCardsRow = document.getElementById("pricingCardsRow");
    const pricingExpanded = document.getElementById("pricingExpanded");
    const expandedLeft = document.getElementById("expandedLeft");
    const pricingCloseBtn = document.getElementById("pricingCloseBtn");
    const expandedInner = document.querySelector(".pricing-expanded-inner");

    let activePlan = null;
    let pricingTimer = null;

    // Show the selected plan table
    function showTableForPlan(planKey) {
        document.querySelectorAll(".plan-table").forEach(function (table) {
            table.style.display = "none";
        });

        const table = document.getElementById("table-" + planKey);

        if (table) {
            table.style.display = "block";
        }
    }

    // Render selected plan details
    function renderExpandedLeft(planKey) {
        const data = planData[planKey];

        if (!data || !expandedLeft) return;

        expandedLeft.className =
            "pricing-expanded-left " + data.className;

        if (expandedInner) {
            expandedInner.className =
                "pricing-expanded-inner " + data.className;
        }

        const detailsHtml = data.details.map(function (line) {
            return "<p>" + line + "</p>";
        }).join("");

        expandedLeft.innerHTML =
            '<div class="pricing-logo-wrap">' +
                '<img src="' + data.logo + '" alt="' + data.title +
                '" class="pricing-logo">' +
            '</div>' +

            '<div class="pricing-subtitle">' +
                data.subtitle +
            '</div>' +

            '<div class="price-circle">' +
                '<div class="price">' +
                    '<span class="currency">$</span>' +
                    '<span class="amount">' + data.amount + '</span>' +
                    '<span class="month">' + data.amountUnit + '</span>' +
                '</div>' +
            '</div>' +

            '<div class="pricing-details">' +
                detailsHtml +
            '</div>' +

            '<a href="https://mdofficemail.com/subscriptions/orderservices.aspx" target="_blank" ' +
                'class="pricing-btn">Sign Up</a>';
    }

    // Expand or toggle selected pricing plan
    function expandPlan(planKey) {
        if (!planData[planKey] || !pricingCardsRow || !pricingExpanded) {
            return;
        }

        clearTimeout(pricingTimer);

        // Click the same plan again to close it
        if (
            activePlan === planKey &&
            pricingExpanded.style.display === "block"
        ) {
            collapsePlan();
            return;
        }

        activePlan = planKey;

        renderExpandedLeft(planKey);
        showTableForPlan(planKey);

        // Fade out the cards
        pricingCardsRow.classList.add("fade-out");

        // Hide cards and display expanded plan
        pricingTimer = setTimeout(function () {
            pricingCardsRow.style.display = "none";

            pricingExpanded.classList.remove("hiding");
            pricingExpanded.style.display = "block";

            void pricingExpanded.offsetWidth;

            pricingExpanded.classList.add("show");
        }, 350);
    }

    // Back button: return to all three cards
    function collapsePlan() {
        if (!pricingCardsRow || !pricingExpanded) return;

        clearTimeout(pricingTimer);

        activePlan = null;

        // Fade out expanded plan
        pricingExpanded.classList.remove("show");
        pricingExpanded.classList.add("hiding");

        pricingTimer = setTimeout(function () {
            pricingExpanded.style.display = "none";
            pricingExpanded.classList.remove("hiding");

            // Hide all pricing tables
            document.querySelectorAll(".plan-table").forEach(function (table) {
                table.style.display = "none";
            });

            // Restore all three cards
            pricingCardsRow.style.display = "";

            pricingCardsRow.classList.add("fade-out");

            void pricingCardsRow.offsetWidth;

            pricingCardsRow.classList.remove("fade-out");
        }, 400);
    }

    // Handle clicks on pricing cards
    if (pricingCardsRow) {
        pricingCardsRow.addEventListener("click", function (event) {
            const button = event.target.closest(".pricing-btn[data-plan]");

            if (!button) return;

            event.preventDefault();

            const planKey = button.getAttribute("data-plan");

            expandPlan(planKey);
        });
    }

    // Back button
    if (pricingCloseBtn) {
        pricingCloseBtn.addEventListener("click", function (event) {
            event.preventDefault();
            collapsePlan();
        });
    }

    // Escape key also returns to all pricing cards
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && activePlan) {
            collapsePlan();
        }
    });

});

document.addEventListener("DOMContentLoaded", () => {
  // Recommended product horizontal slider
  document.querySelectorAll(".msp-icon-btn[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const track = document.getElementById(button.dataset.scroll);
      track?.scrollBy({ left: Number(button.dataset.dir) * 280, behavior: "smooth" });
    });
  });

  // Memory foam / hybrid tabs update product cards
  const productGrid = document.getElementById("msp-product-grid");
  const originalCards = [...productGrid.children].map(card => card.cloneNode(true));
  const hybridCards = [
    {title:"Classic Hybrid", price:"$799", old:"$1,099", tag:"BEST VALUE", rating:"4.8 (9,420 reviews)", desc:"A balanced combination of responsive coils and contouring comfort.", comfort:75, support:92, cooling:80},
    {title:"Premier Hybrid", price:"$1,199", old:"$1,599", tag:"MOST POPULAR", rating:"4.9 (7,850 reviews)", desc:"Enhanced pressure relief with spring support and extra airflow.", comfort:88, support:95, cooling:91},
    {title:"Luxe Hybrid", price:"$1,499", old:"$1,999", tag:"PREMIUM COMFORT", rating:"4.8 (4,210 reviews)", desc:"Premium layers and responsive support for a luxurious sleep.", comfort:95, support:94, cooling:93}
  ];
  function renderHybrid() {
    productGrid.innerHTML = hybridCards.map((p, i) => `
      <div class="col-12 col-md-6 col-xl-4"><article class="msp-product-card">
        <div class="msp-product-image"><span class="msp-badge ${i===1?'msp-badge-blue':''}">${p.tag}</span><img src="${[
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=90',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=90',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=90'
        ][i]}" alt="${p.title} mattress"><span class="msp-size-tag">Queen</span></div>
        <div class="msp-card-body"><div class="msp-rating"><span>★★★★★</span> ${p.rating}</div><h3>${p.title}</h3><p class="msp-description">${p.desc}</p>
        <div class="msp-metrics"><div><span>Comfort</span><i><b style="width:${p.comfort}%"></b></i></div><div><span>Support</span><i><b style="width:${p.support}%"></b></i></div><div><span>Cooling</span><i><b style="width:${p.cooling}%"></b></i></div></div>
        <div class="msp-review"><div class="msp-avatar">${['A','R','S'][i]}</div><div><strong>Verified customer</strong><p>“Comfortable, supportive and a great addition to our bedroom.”</p></div></div>
        <div class="msp-perks"><span><i class="bi bi-check-circle-fill"></i> 365-night trial</span><span><i class="bi bi-check-circle-fill"></i> Forever warranty</span></div>
        <div class="msp-price-row"><div><small>Queen</small><strong>${p.price} <del>${p.old}</del></strong></div><span class="msp-sale">Special offer</span></div>
        <button class="msp-btn ${i===0?'msp-btn-primary':'msp-btn-outline'} msp-add-cart">Shop Now <i class="bi bi-arrow-right"></i></button></div></article></div>`).join("");
    bindCartButtons();
  }
  document.querySelectorAll("[data-product-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-product-tab]").forEach(t => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
      });
      if (tab.dataset.productTab === "hybrid") renderHybrid();
      else {
        productGrid.innerHTML = "";
        originalCards.forEach(card => productGrid.appendChild(card.cloneNode(true)));
        bindCartButtons();
      }
    });
  });

  // Add to cart feedback
  const toast = document.getElementById("msp-toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }
  function bindCartButtons() {
    document.querySelectorAll(".msp-add-cart").forEach(button => {
      button.onclick = () => {
        const title = button.closest(".msp-product-card")?.querySelector("h3")?.textContent || "Mattress";
        showToast(`${title} added to your cart.`);
      };
    });
  }
  bindCartButtons();

  // Accordion: only one feature open at a time
  const accordionButtons = [...document.querySelectorAll(".msp-accordion-item")];
  accordionButtons.forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const willOpen = !panel.classList.contains("open");
      accordionButtons.forEach(other => {
        other.classList.remove("active");
        other.setAttribute("aria-expanded", "false");
        other.querySelector(".msp-plus").className = "bi bi-plus-lg msp-plus";
        other.nextElementSibling.classList.remove("open");
      });
      if (willOpen) {
        button.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        button.querySelector(".msp-plus").className = "bi bi-dash-lg msp-plus";
        panel.classList.add("open");
      }
    });
  });

  // Product specs accordion
  const specToggle = document.getElementById("spec-toggle");
  const specContent = document.querySelector(".msp-spec-content");
  specToggle.addEventListener("click", () => {
    const open = specContent.classList.toggle("open");
    specToggle.setAttribute("aria-expanded", String(open));
    specToggle.querySelector("i").className = open ? "bi bi-dash-lg" : "bi bi-plus-lg";
  });

  // Mattress feel selector
  document.querySelectorAll("[data-feel]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-feel]").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      document.getElementById("feel-label").textContent = button.dataset.feel;
      showToast(`Mattress feel selected: ${button.dataset.feel}`);
    });
  });

  // Compare action: simple, accessible information dialog
  document.getElementById("compare-btn").addEventListener("click", () => {
    showToast("Choose Memory Foam or Hybrid above to compare mattress styles.");
    document.querySelector(".msp-tabs").scrollIntoView({behavior:"smooth", block:"center"});
  });
});
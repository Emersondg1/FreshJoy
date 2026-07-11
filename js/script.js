// ⚠️ Remplacez ce numéro par le vrai numéro WhatsApp de FreshJoy (format international, sans le +).
const WHATSAPP_NUMBER = "22900000000";

const cart = {}; // { id: { name, price, qty } }

const cards = document.querySelectorAll(".card");
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartTotalEl = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const orderBtn = document.getElementById("orderWhatsApp");

function formatFCFA(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function updateCard(card) {
  const id = card.dataset.id;
  const qtyEl = card.querySelector(".qty-value");
  qtyEl.textContent = cart[id] ? cart[id].qty : 0;
}

function renderCart() {
  const ids = Object.keys(cart).filter((id) => cart[id].qty > 0);
  let total = 0;
  let count = 0;

  cartItemsEl.innerHTML = "";
  ids.forEach((id) => {
    const item = cart[id];
    total += item.price * item.qty;
    count += item.qty;
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.qty}× ${item.name}</span><span>${formatFCFA(item.price * item.qty)}</span>`;
    cartItemsEl.appendChild(li);
  });

  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatFCFA(total);
  cartEmptyEl.style.display = ids.length ? "none" : "block";
  orderBtn.disabled = ids.length === 0;
}

cards.forEach((card) => {
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = Number(card.dataset.price);

  card.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!cart[id]) cart[id] = { name, price, qty: 0 };
      if (btn.dataset.action === "inc") {
        cart[id].qty += 1;
      } else {
        cart[id].qty = Math.max(0, cart[id].qty - 1);
      }
      updateCard(card);
      renderCart();
    });
  });
});

function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("open");
}
function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("open");
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

orderBtn.addEventListener("click", () => {
  const ids = Object.keys(cart).filter((id) => cart[id].qty > 0);
  if (ids.length === 0) return;

  let message = "Bonjour FreshJoy, je souhaite commander :\n";
  let total = 0;
  ids.forEach((id) => {
    const item = cart[id];
    message += `- ${item.qty}x ${item.name} (${formatFCFA(item.price * item.qty)})\n`;
    total += item.price * item.qty;
  });
  message += `\nTotal : ${formatFCFA(total)}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// Menu mobile
const navToggle = document.getElementById("navToggle");
const siteNav = document.querySelector(".site-nav");
navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

renderCart();
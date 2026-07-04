// ─── Renta Premium Javascript Logic ───

// State variables for Favorites and Simulators
const favoriteIds = new Set(JSON.parse(localStorage.getItem("renta_favorites") || "[]"));

// ─── Initialize Application ───
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initServicesSimulators();
  initFaqAccordion();
  initNewsletterForm();
  initContactForm();
});

// ─── Theme Management ───
function initTheme() {
  const themeBtn = document.querySelector(".theme-toggle-btn");
  const storedTheme = localStorage.getItem("renta_theme");
  
  if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark-theme");
  }
  
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("renta_theme", isDark ? "dark" : "light");
    showToast(isDark ? "Dark theme enabled" : "Light theme enabled", isDark ? "fa-moon" : "fa-sun");
  });
}

// ─── Interactive Services Simulators ───
function initServicesSimulators() {
  const serviceCards = document.querySelectorAll(".service-item-card");
  const simulatorPanes = document.querySelectorAll(".simulator-pane");
  
  serviceCards.forEach(card => {
    card.addEventListener("click", () => {
      serviceCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      
      const targetPaneId = card.dataset.simulator;
      simulatorPanes.forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === targetPaneId) {
          pane.classList.add("active");
        }
      });
    });
  });
  
  // 1. Chat Simulator Logic
  const chatInput = document.getElementById("chat-sim-input");
  const chatSendBtn = document.getElementById("chat-sim-send-btn");
  const chatContainer = document.getElementById("chat-messages-container");
  const chatTyping = document.getElementById("chat-typing-indicator");
  
  const landlordReplies = [
    "Yes, the apartment is fully available! When would you like to schedule a viewing?",
    "Electricity is prepaid yaka, and water is back-up pumped so there is never water scarcity.",
    "For long term lease (over 6 months), I can lower the price by 100,000 UGX per month. Let's arrange a view first.",
    "We do require a 1-month security deposit. The contract is signed digitally inside Renta.",
    "Sure! Let's arrange a physical viewing tomorrow around 11am if that works for you?"
  ];
  let replyIndex = 0;
  
  function appendChatMessage(sender, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    bubble.innerHTML = `
      ${text}
      <span class="chat-time">${timeStr}</span>
    `;
    
    // Append before typing indicator
    chatContainer.insertBefore(bubble, chatTyping);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    chatInput.value = "";
    appendChatMessage("tenant", text);
    
    // Show landlord typing state
    chatTyping.style.display = "flex";
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    setTimeout(() => {
      chatTyping.style.display = "none";
      
      // Smart replies based on keywords
      let response = "";
      const lower = text.toLowerCase();
      if (lower.includes("price") || lower.includes("rent") || lower.includes("cost") || lower.includes("how much")) {
        response = landlordReplies[2];
      } else if (lower.includes("view") || lower.includes("see") || lower.includes("visit") || lower.includes("come")) {
        response = landlordReplies[4];
      } else if (lower.includes("water") || lower.includes("power") || lower.includes("yaka")) {
        response = landlordReplies[1];
      } else {
        response = landlordReplies[replyIndex % landlordReplies.length];
        replyIndex++;
      }
      
      appendChatMessage("landlord", response);
      showToast("New message from Arthur Mugisha", "fa-message");
    }, 1500);
  }
  
  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener("click", handleSendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
  }
  
  // 2. Mover Price Estimator Logic
  const moverSlider = document.getElementById("mover-distance");
  const moverDistVal = document.getElementById("mover-dist-val");
  const moverOptions = document.querySelectorAll(".mover-option");
  const moverBaseEl = document.getElementById("mover-summary-base");
  const moverDistCostEl = document.getElementById("mover-summary-distance");
  const moverTotalEl = document.getElementById("mover-summary-total");
  
  let selectedVehicleBase = 30000; // default pickup base price
  let selectedVehicleRate = 1500;  // per km rate
  
  function calculateMoverCost() {
    const distance = parseInt(moverSlider.value);
    moverDistVal.textContent = `${distance} km`;
    
    const distanceCost = distance * selectedVehicleRate;
    const total = selectedVehicleBase + distanceCost;
    
    moverBaseEl.textContent = `UGX ${selectedVehicleBase.toLocaleString()}`;
    moverDistCostEl.textContent = `UGX ${distanceCost.toLocaleString()}`;
    moverTotalEl.textContent = `UGX ${total.toLocaleString()}`;
  }
  
  moverOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      moverOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      
      selectedVehicleBase = parseInt(opt.dataset.base);
      selectedVehicleRate = parseInt(opt.dataset.rate);
      calculateMoverCost();
    });
  });
  
  if (moverSlider) {
    moverSlider.addEventListener("input", calculateMoverCost);
    moverSlider.addEventListener("change", calculateMoverCost);
  }
  
  // 3. Date / Scheduler Simulator inside Services
  const calDays = document.querySelectorAll(".calendar-day:not(.empty):not(.booked)");
  const timeSlots = document.querySelectorAll(".time-slot");
  const scheduleSubmit = document.getElementById("schedule-sim-submit");
  
  let selectedCalDay = null;
  let selectedTimeSlot = null;
  
  calDays.forEach(day => {
    day.addEventListener("click", () => {
      calDays.forEach(d => d.classList.remove("active"));
      day.classList.add("active");
      selectedCalDay = day.textContent;
    });
  });
  
  timeSlots.forEach(slot => {
    slot.addEventListener("click", () => {
      timeSlots.forEach(s => s.classList.remove("active"));
      slot.classList.add("active");
      selectedTimeSlot = slot.textContent;
    });
  });
  
  if (scheduleSubmit) {
    scheduleSubmit.addEventListener("click", () => {
      if (!selectedCalDay || !selectedTimeSlot) {
        showToast("Please select a date and time slot first.", "fa-triangle-exclamation");
        return;
      }
      showToast(`Viewing request sent for July ${selectedCalDay} at ${selectedTimeSlot}!`, "fa-circle-check");
    });
  }
  
  // 4. Digital Sign Pad Logic
  const signPad = document.getElementById("sign-pad");
  const agreementFormSubmit = document.getElementById("agreement-sim-submit");
  const signatureName = document.getElementById("agreement-name");
  
  if (signPad) {
    signPad.addEventListener("click", () => {
      const name = signatureName.value.trim() || "Joseph Nsubuga";
      signPad.innerHTML = `<span>${name}</span>`;
      signPad.classList.add("signed");
      showToast("Document signed digitally", "fa-signature");
    });
  }
  
  if (agreementFormSubmit) {
    agreementFormSubmit.addEventListener("click", () => {
      if (!signPad.classList.contains("signed")) {
        showToast("Please tap the signature area to sign the lease.", "fa-triangle-exclamation");
        return;
      }
      showToast("Lease agreement securely submitted!", "fa-file-shield");
    });
  }
}

// ─── FAQ Accordion ───
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll(".faq-header");
  faqHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");
      
      // Close other items
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
      
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// ─── Newsletter Form ───
function initNewsletterForm() {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const email = input.value.trim();
    
    if (email) {
      input.value = "";
      showToast("Subscribed! Check email for details.", "fa-paper-plane");
    }
  });
}

// ─── Contact Form ───
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");
    const submitBtn = form.querySelector(".contact-submit-btn");
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value;
    const message = messageInput.value.trim();
    
    if (!name || !email || !message) {
      showToast("Please fill out all required fields.", "fa-triangle-exclamation");
      return;
    }
    
    // Disable submit button & show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending Message...";
    
    // Mock network request
    setTimeout(() => {
      // Clear form inputs
      nameInput.value = "";
      emailInput.value = "";
      subjectInput.value = "general";
      messageInput.value = "";
      
      // Restore submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      // Show success toast
      showToast("Message sent! We'll reply within 24 hours.", "fa-circle-check");
    }, 1500);
  });
}

// ─── Universal Toast Notification ───
window.showToast = function(message, iconClass = "fa-circle-info") {
  const toast = document.getElementById("notification-toast");
  if (!toast) return;
  
  const iconEl = toast.querySelector("i");
  const pEl = toast.querySelector("p");
  
  // Set custom icon & text
  iconEl.className = `fa-solid ${iconClass}`;
  pEl.textContent = message;
  
  toast.classList.add("show");
  
  // Clear any existing timeouts
  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }
  
  // Auto-hide after 3.5 seconds
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
};

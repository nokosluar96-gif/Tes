const floatingButton = document.getElementById("floatingButton");
const floatingMenu = document.getElementById("floatingMenu");
const cursor = document.getElementById("cursor");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

const cursorSize = document.getElementById("cursorSize");
const cursorColor = document.getElementById("cursorColor");
const cursorShadow = document.getElementById("cursorShadow");
const vibration = document.getElementById("vibration");

const sizeValue = document.getElementById("sizeValue");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

const DEFAULTS = {
  size: 45,
  color: "#00d9ff",
  shadow: true,
  vibration: true
};

let settings = JSON.parse(
  localStorage.getItem("cursorSettings") || "null"
) || { ...DEFAULTS };

function saveSettings() {
  localStorage.setItem(
    "cursorSettings",
    JSON.stringify(settings)
  );
}

function applySettings() {
  cursorSize.value = settings.size;
  cursorColor.value = settings.color;
  cursorShadow.checked = settings.shadow;
  vibration.checked = settings.vibration;

  sizeValue.textContent = `${settings.size} px`;

  cursor.style.width = `${settings.size}px`;
  cursor.style.height = `${settings.size}px`;
  cursor.style.background = settings.color;

  if (settings.shadow) {
    cursor.classList.add("shadow");
  } else {
    cursor.classList.remove("shadow");
  }

  document.documentElement.style.setProperty(
    "--accent",
    settings.color
  );
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function vibrate() {
  if (
    settings.vibration &&
    navigator.vibrate
  ) {
    navigator.vibrate(15);
  }
}

/* Floating menu */

floatingButton.addEventListener("click", () => {
  floatingMenu.classList.toggle("open");

  floatingButton.textContent =
    floatingMenu.classList.contains("open")
      ? "×"
      : "☰";

  vibrate();
});

/* Settings */

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("active");
  vibrate();
});

/* Menu actions */

document.querySelectorAll(".menu-item").forEach(item => {

  item.addEventListener("click", () => {

    const action = item.dataset.action;

    vibrate();

    if (action === "cursor") {
      cursor.classList.toggle("visible");

      showToast(
        cursor.classList.contains("visible")
          ? "Kursor aktif"
          : "Kursor nonaktif"
      );
    }

    if (action === "settings") {
      settingsPanel.classList.add("active");
      showToast("Pengaturan dibuka");
    }

    if (action === "home") {
      settingsPanel.classList.remove("active");
      showToast("Home");
    }

    if (action === "info") {
      showToast("Floating Cursor PWA");
    }

    floatingMenu.classList.remove("open");
    floatingButton.textContent = "☰";
  });

});

/* Cursor movement */

document.addEventListener("pointermove", event => {

  if (!cursor.classList.contains("visible")) {
    return;
  }

  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;

});

/* Cursor settings */

cursorSize.addEventListener("input", () => {

  settings.size = Number(cursorSize.value);

  sizeValue.textContent =
    `${settings.size} px`;

  applySettings();
  saveSettings();

});

cursorColor.addEventListener("input", () => {

  settings.color = cursorColor.value;

  applySettings();
  saveSettings();

});

cursorShadow.addEventListener("change", () => {

  settings.shadow = cursorShadow.checked;

  applySettings();
  saveSettings();

});

vibration.addEventListener("change", () => {

  settings.vibration = vibration.checked;

  saveSettings();
  vibrate();

});

/* Reset */

resetBtn.addEventListener("click", () => {

  settings = { ...DEFAULTS };

  applySettings();
  saveSettings();

  showToast("Pengaturan direset");

});

/* Service Worker */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("Service Worker aktif");
      })
      .catch(error => {
        console.error(
          "Service Worker gagal:",
          error
        );
      });

  });

}

applySettings();

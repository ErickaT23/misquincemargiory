// firebase.js (modular v11)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, off } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtcYwUezvPvEd1ekYOBjzJpRxNnnWhmbQ",
  authDomain: "misquince-margiory.firebaseapp.com",
  projectId: "misquince-margiory",
  storageBucket: "misquince-margiory.firebasestorage.app",
  messagingSenderId: "556210521249",
  appId: "1:556210521249:web:7252111a5745cfd1bddce0"
};

// Init
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// Util: escape simple para evitar XSS al renderizar
function escapeHTML(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  const mostrarFormularioBtn = document.getElementById("mostrarFormularioBtn");
  const formularioDeseo      = document.getElementById("formularioDeseo");
  const verDeseosBtn         = document.getElementById("verDeseosBtn");
  const wishesContainer      = document.getElementById("wishesContainer");
  const wishForm             = document.getElementById("wishForm");
  const magicSound           = document.getElementById("magicSound");
  const magicEffect          = document.getElementById("magicEffect");

  let deseosVisibles = false;
  let detachWishListener = null; // para desuscribir onValue al ocultar

  // Sparkles (opcional)
  function showMagicSparkles() {
    if (!magicEffect) return;
    for (let i = 0; i < 18; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * window.innerWidth + "px";
      sparkle.style.top  = Math.random() * window.innerHeight + "px";
      magicEffect.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
  }

  // Mostrar/ocultar formulario
  if (mostrarFormularioBtn && formularioDeseo) {
    mostrarFormularioBtn.addEventListener("click", () => {
      const isHidden = formularioDeseo.style.display === "none" || formularioDeseo.style.display === "";
      formularioDeseo.style.display = isHidden ? "block" : "none";
    });
  }

  // Guardar buen deseo
  if (wishForm) {
    wishForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre  = document.getElementById('nombre')?.value.trim();
      const mensaje = document.getElementById('mensaje')?.value.trim();

      if (!nombre || !mensaje) {
        alert("Por favor completa ambos campos.");
        return;
      }

      try {
        await push(ref(db, 'buenos_deseos'), {
          nombre,
          mensaje,
          fecha: new Date().toISOString()
        });

        // feedback
        if (magicSound) magicSound.play().catch(()=>{});
        showMagicSparkles();
        alert("¡Gracias por tu mensaje!");

        wishForm.reset();
      } catch (err) {
        console.error("Error al guardar el deseo:", err);
        alert("Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.");
      }
    });
  }

  // Ver/Ocultar deseos (con listener vivo y desuscripción al ocultar)
  if (verDeseosBtn && wishesContainer) {
    verDeseosBtn.addEventListener("click", () => {
      if (!deseosVisibles) {
        wishesContainer.style.display = "block";
        wishesContainer.innerHTML = "<p>Cargando deseos...</p>";

        const deseosRef = ref(db, 'buenos_deseos');
        // Suscribir
        detachWishListener = onValue(deseosRef, (snapshot) => {
          if (!snapshot.exists()) {
            wishesContainer.innerHTML = "<p>No hay deseos aún 💌</p>";
            return;
          }

          const data = snapshot.val();
          // Ordenar por fecha DESC
          const items = Object.values(data).sort((a,b) => (b.fecha || '').localeCompare(a.fecha || ''));

          wishesContainer.innerHTML = items.map(d => {
            const nom = escapeHTML(d.nombre || 'Anónimo');
            const msg = escapeHTML(d.mensaje || '');
            return `<div class="wish-card"><strong>${nom}</strong><br><em>${msg}</em></div>`;
          }).join('');

          verDeseosBtn.textContent = "Ocultar buenos deseos";
          deseosVisibles = true;
        }, (err) => {
          console.error("Error leyendo deseos:", err);
          wishesContainer.innerHTML = "<p>No se pudieron cargar los deseos.</p>";
        });

      } else {
        // Ocultar y desuscribir
        wishesContainer.style.display = "none";
        wishesContainer.innerHTML = "";
        verDeseosBtn.textContent = "Ver buenos deseos";
        deseosVisibles = false;

        if (detachWishListener) {
          // En modular, onValue devuelve una función para desuscribir
          detachWishListener();
          detachWishListener = null;
        } else {
          // fallback: off()
          off(ref(db, 'buenos_deseos'));
        }
      }
    });
  }
});

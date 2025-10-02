// Función para abrir la invitación (sobre) y reproducir la música
function abrirInvitacion() {
  const envelope = document.getElementById('envelope');
  const invitacion = document.getElementById('invitacion');

  envelope.classList.add('open');

  setTimeout(() => {
    envelope.style.display = 'none';
    invitacion.style.display = 'block';

    const musica = document.getElementById('musica');
    if (musica) musica.play();
  }, 1000);
}

// Al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  // Click en el sello para abrir
  const seal = document.getElementById('seal');
  if (seal) seal.addEventListener('click', abrirInvitacion);

  iniciarContador();
  cargarDatosInvitado();

  // Efecto fade-in
  const elementsToFade = document.querySelectorAll('.fade-in-element');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  elementsToFade.forEach(el => observer.observe(el));
});

// Datos de invitado
function cargarDatosInvitado() {
  const params = new URLSearchParams(window.location.search);
  const invitadoId = params.get('id');

  if (!invitadoId) return;

  const invitado = (window.invitados || {})[invitadoId];
  if (!invitado) return;

  const elNombre = document.getElementById('nombreInvitado');
  const elPases = document.getElementById('cantidadPases');

  if (elNombre) {
    const nombre = (invitado.nombre || '').trim();
    elNombre.innerText = nombre || 'Invitado';
    elNombre.style.display = nombre.toLowerCase() === 'sin nombre' ? 'none' : '';
  }

  if (elPases) {
    const pasesNum = Number(invitado.pases);
    elPases.innerText = `Pases: ${Number.isFinite(pasesNum) ? pasesNum : 1}`;
    elPases.style.display = '';
  }
}

// Contador
function iniciarContador() {
  const eventoFecha = new Date("October 18, 2025 17:00:00").getTime();

  setInterval(() => {
    const ahora = new Date().getTime();
    const diferencia = eventoFecha - ahora;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("dias").innerText = dias;
    document.getElementById("horas").innerText = horas;
    document.getElementById("minutos").innerText = minutos;
    document.getElementById("segundos").innerText = segundos;
  }, 1000);
}

// Confirmar asistencia
function confirmarAsistencia() {
  const txt = document.getElementById('cantidadPases')?.innerText || '';
  const m = txt.match(/(\d+)/);
  const pases = m ? parseInt(m[1], 10) : 1;

  const FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSfKAioUH58tcMbEBqRMW6N9B7FlmkQglrAp6OdAwLMqEm7h4w/viewform';
  const ENTRY_PASES = '1099367965';

  const url = `${FORM_BASE}?usp=pp_url&entry.${ENTRY_PASES}=${encodeURIComponent(pases)}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  const box = document.getElementById('confirmacion');
  if (box) box.innerHTML = `Abriendo formulario… Pases: <strong>${pases}</strong>`;
}

// Abrir maps — se colocan en window para que los encuentre el onclick
window.abrirMapsMisa = () => {
  window.open('https://maps.app.goo.gl/JV4n9KTgkxWCFJGB6', '_blank', 'noopener,noreferrer');
};

window.abrirMapsFiesta = () => {
  window.open('https://maps.app.goo.gl/qsgjfyQDpVMg4X2z5', '_blank', 'noopener,noreferrer');
};

function elegirAplicacionOtraDireccion() {
  const enlaceGoogleMaps = 'https://maps.app.goo.gl/GjZMJJ3eLStnJeZC7';
  window.location.href = enlaceGoogleMaps;
}

// ============ BOTÓN FOLDER (ABRIR/CERRAR BAILES) ============
const btnClose = document.getElementById("btnClose");
const folderIcon = document.getElementById("Folder");
const btnAnim1 = document.getElementById("anim1");
const btnAnim2 = document.getElementById("anim2");
const guideText = document.getElementById('guide-text');

let abierto = false;

if (btnClose) {
    btnClose.addEventListener("click", () => {
        abierto = !abierto;
        if (abierto) {
            folderIcon.src = "/Public/image/folder-symlink-fill.png";
            btnAnim1.style.display = "flex";
            btnAnim2.style.display = "flex";
        } else {
            folderIcon.src = "/Public/image/icon-folder.png";
            btnAnim1.style.display = "none";
            btnAnim2.style.display = "none";
            // Volver a idle
            cambiarAnimacion('normal');
        }
    });
}

// ============ CAMBIAR ANIMACIONES ============
function cambiarAnimacion(tipo) {
    const paises = [
        ["normal","Baile1","Baile2"],
        ["portugalNormal","Portugal1","Portugal2"],
        ["franciaIdle","Francia1","Francia2"],
        ["EuaNormal","Eua1","Eua2"],
        ["españaNormal","españa1","españa2"],
        ["coreaNormal","corea1","corea2"],
        ["canadaNormal","canada1","canada2"],
        ["BrasilNormal","brasil1","brasil2"],
        ["argNormal","arg1","arg2"],
        ["almNormal","alm1","alm2"]
    ];

    paises.forEach(([normalId, baile1Id, baile2Id]) => {
        const n = document.getElementById(normalId);
        const b1 = document.getElementById(baile1Id);
        const b2 = document.getElementById(baile2Id);
        if (!n || !b1 || !b2) return;

        if (tipo === 'normal') {
            n.setAttribute('visible', 'true');
            b1.setAttribute('visible', 'false');
            b2.setAttribute('visible', 'false');
        } else if (tipo === 'baile1') {
            n.setAttribute('visible', 'false');
            b1.setAttribute('visible', 'true');
            b2.setAttribute('visible', 'false');
        } else if (tipo === 'baile2') {
            n.setAttribute('visible', 'false');
            b1.setAttribute('visible', 'false');
            b2.setAttribute('visible', 'true');
        }
    });
}

if (btnAnim1) btnAnim1.addEventListener("click", () => cambiarAnimacion('baile1'));
if (btnAnim2) btnAnim2.addEventListener("click", () => cambiarAnimacion('baile2'));

// ============ OCULTAR TEXTO AL DETECTAR MARCADOR ============
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => { if (guideText) guideText.style.opacity = '0'; });
    marker.addEventListener('markerLost', () => { if (guideText) guideText.style.opacity = '1'; });
});
// frontend/js/modules/gallery.js

export function initGallery() {
    console.log("Módulo de Galería (Antes/Después) iniciado...");
    injectModalHTML();
    exposeGlobalFunction();
}

// 1. Inyectar el HTML del Modal (Ventana flotante) dinámicamente
function injectModalHTML() {
    // Evitar duplicados
    if (document.getElementById('modalGaleria')) return;

    const modalHTML = `
    <div class="modal fade" id="modalGaleria" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="titulo-galeria">Evidencia Fotográfica</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-light">
                    
                    <div class="row text-center">
                        <div class="col-12 col-md-6 mb-3">
                            <div class="card h-100 shadow-sm border-warning">
                                <div class="card-header bg-warning text-dark fw-bold">
                                    <i class="fa-solid fa-clock-rotate-left"></i> ANTES
                                </div>
                                <div class="card-body p-1 d-flex align-items-center justify-content-center bg-dark">
                                    <img id="img-antes" src="" class="img-fluid rounded" style="max-height: 400px; object-fit: contain;" alt="Evidencia Antes">
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 mb-3">
                            <div class="card h-100 shadow-sm border-success">
                                <div class="card-header bg-success text-white fw-bold">
                                    <i class="fa-solid fa-check-circle"></i> DESPUÉS
                                </div>
                                <div class="card-body p-1 d-flex align-items-center justify-content-center bg-dark">
                                    <img id="img-despues" src="" class="img-fluid rounded" style="max-height: 400px; object-fit: contain;" alt="Evidencia Después">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-secondary mt-2 small text-center mb-0">
                        <i class="fa-solid fa-folder-open"></i> Clave Presupuestal: <span id="clave-obra-ref" class="fw-bold font-monospace"></span>
                    </div>

                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 2. Exponer función global para que el Popup de Leaflet pueda llamarla
function exposeGlobalFunction() {
    window.abrirGaleria = function(cvePrep, nombreObra) {
        
        const modalEl = document.getElementById('modalGaleria');
        const imgAntes = document.getElementById('img-antes');
        const imgDespues = document.getElementById('img-despues');
        const titulo = document.getElementById('titulo-galeria');
        const lblClave = document.getElementById('clave-obra-ref');

        // Resetear imágenes mientras cargan (loading o vacío)
        imgAntes.src = ''; 
        imgDespues.src = '';

        // Validar Clave
        if (!cvePrep || cvePrep === 'null' || cvePrep === 'undefined') {
            alert("Esta obra no tiene Clave Presupuestal asignada para buscar fotos.");
            return;
        }

        // Limpiar espacios en blanco de la clave
        const cleanCve = cvePrep.trim(); 
        
        // Construcción de rutas según tu estructura:
        // assets/faismun_2025/[CLAVE]_antes.jpg
        const rutaAntes = `assets/faismun_2025/${cleanCve}_antes.jpg`;
        const rutaDespues = `assets/faismun_2025/${cleanCve}_despues.jpg`;

        console.log(`Buscando fotos: ${rutaAntes} y ${rutaDespues}`);

        titulo.innerText = nombreObra || "Detalle de Obra";
        lblClave.innerText = cleanCve;

        // Asignar fuentes
        imgAntes.src = rutaAntes;
        imgDespues.src = rutaDespues;

        // Manejo de errores visual (Si no existe la foto, mostrar un placeholder)
        const placeholder = 'https://via.placeholder.com/400x300?text=Sin+Evidencia';
        imgAntes.onerror = function() { this.src = placeholder; };
        imgDespues.onerror = function() { this.src = placeholder; };

        // Abrir Modal
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    };
}
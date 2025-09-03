// Sistema de gestión de notas
class NotesManager {
    constructor() {
        this.notes = [];
        this.init();
    }

    init() {
        // Cargar notas guardadas del localStorage al iniciar
        this.loadNotes();

        // Configurar eventos
        this.setupEventListeners();

        // Mostrar notas existentes
        this.displayNotes();

        // Crear modal para vista completa
        this.createModal();
    }

    setupEventListeners() {
        const addButton = document.getElementById('sub');
        const textarea = document.getElementById('not');
        const misNotasLink = document.querySelector('.mis-notas-1 a');

        // Evento para añadir nota
        addButton.addEventListener('click', () => {
            this.addNote();
        });

        // Evento para mostrar la sección de notas al hacer clic en "Mis notas"
        misNotasLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToNotes();
        });

        // Auto-expandir textarea
        textarea.addEventListener('input', () => {
            this.autoResize(textarea);
        });

        // Permitir añadir nota con Ctrl+Enter
        textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addNote();
            }
        });
    }

    createModal() {
        // Crear estructura del modal
        const modalHTML = `
            <div id="note-modal" class="note-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modal-title">Nota Completa</h2>
                        <div class="modal-actions">
                            <button class="btn-modal-edit" title="Editar nota">
                                ✏️ Editar
                            </button>
                            <button class="btn-modal-close" title="Cerrar">
                                ✖️
                            </button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="note-meta">
                            <span id="modal-date"></span>
                            <span id="modal-word-count"></span>
                        </div>
                        <div id="modal-note-content" class="modal-note-content"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-modal-copy" title="Copiar nota">
                            📋 Copiar
                        </button>
                        <button class="btn-modal-delete" title="Eliminar nota">
                            🗑️ Eliminar
                        </button>
                        <button class="btn-modal-share" title="Compartir nota">
                            📤 Compartir
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Añadir el modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Añadir estilos CSS para el modal
        this.addModalStyles();

        // Configurar eventos del modal
        this.setupModalEvents();
    }

    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .note-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .note-modal.show {
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
                animation: modalFadeIn 0.3s ease forwards;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                cursor: pointer;
            }

            .modal-content {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                border-radius: 15px;
                max-width: 90%;
                max-height: 90%;
                width: 600px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                position: relative;
                display: flex;
                flex-direction: column;
                transform: scale(0.8);
                animation: modalSlideIn 0.3s ease forwards;
                border: 2px solid #e0e0e0;
            }

            .modal-header {
                padding: 20px 25px;
                border-bottom: 2px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 13px 13px 0 0;
            }

            .modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-family: Georgia, serif;
            }

            .modal-actions {
                display: flex;
                gap: 10px;
            }

            .btn-modal-edit,
            .btn-modal-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .btn-modal-edit:hover,
            .btn-modal-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }

            .modal-body {
                padding: 25px;
                flex: 1;
                overflow-y: auto;
                max-height: 500px;
            }

            .note-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 10px 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
                font-size: 0.9rem;
                color: #666;
            }

            #modal-word-count {
                font-weight: bold;
                color: #667eea;
            }

            .modal-note-content {
                font-family: 'Kalam', cursive, 'Comic Sans MS', sans-serif;
                line-height: 1.8;
                color: #2c3e50;
                font-size: 1.1rem;
                white-space: pre-line;
                background: linear-gradient(to bottom,
                    transparent 0px,
                    transparent 26px,
                    #e8f4fd 26px,
                    #e8f4fd 28px,
                    transparent 28px);
                background-size: 100% 28px;
                padding: 15px 20px;
                border-radius: 8px;
                min-height: 200px;
                border: 1px solid #e0e0e0;
            }

            .modal-footer {
                padding: 20px 25px;
                border-top: 2px solid #f0f0f0;
                display: flex;
                gap: 10px;
                justify-content: center;
                background: #fafbfc;
                border-radius: 0 0 13px 13px;
            }

            .btn-modal-copy,
            .btn-modal-delete,
            .btn-modal-share {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .btn-modal-copy {
                background: #28a745;
                color: white;
            }

            .btn-modal-copy:hover {
                background: #218838;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
            }

            .btn-modal-delete {
                background: #dc3545;
                color: white;
            }

            .btn-modal-delete:hover {
                background: #c82333;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
            }

            .btn-modal-share {
                background: #007bff;
                color: white;
            }

            .btn-modal-share:hover {
                background: #0056b3;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
            }

            /* Scrollbar personalizada para el modal */
            .modal-body::-webkit-scrollbar {
                width: 8px;
            }

            .modal-body::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }

            .modal-body::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }

            .modal-body::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            /* Animaciones del modal */
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes modalSlideIn {
                from {
                    transform: scale(0.8) translateY(-50px);
                }
                to {
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes modalSlideOut {
                from {
                    transform: scale(1) translateY(0);
                }
                to {
                    transform: scale(0.8) translateY(-50px);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    max-height: 95%;
                    margin: 10px;
                }

                .modal-header {
                    padding: 15px 20px;
                }

                .modal-header h2 {
                    font-size: 1.2rem;
                }

                .modal-body {
                    padding: 20px;
                }

                .modal-footer {
                    padding: 15px 20px;
                    flex-direction: column;
                    gap: 8px;
                }

                .btn-modal-copy,
                .btn-modal-delete,
                .btn-modal-share {
                    width: 100%;
                    padding: 12px;
                }

                .note-meta {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupModalEvents() {
        const modal = document.getElementById('note-modal');
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.btn-modal-close');
        const editBtn = modal.querySelector('.btn-modal-edit');
        const copyBtn = modal.querySelector('.btn-modal-copy');
        const deleteBtn = modal.querySelector('.btn-modal-delete');
        const shareBtn = modal.querySelector('.btn-modal-share');

        // Cerrar modal
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };

        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        // Botón editar
        editBtn.addEventListener('click', () => {
            const noteId = modal.dataset.noteId;
            closeModal();
            setTimeout(() => {
                this.editNote(parseInt(noteId));
            }, 300);
        });

        // Botón copiar
        copyBtn.addEventListener('click', () => {
            const content = document.getElementById('modal-note-content').textContent;
            navigator.clipboard.writeText(content).then(() => {
                this.showMessage('¡Nota copiada al portapapeles!', 'success');
            }).catch(() => {
                this.showMessage('Error al copiar la nota', 'error');
            });
        });

        // Botón eliminar
        deleteBtn.addEventListener('click', () => {
            const noteId = modal.dataset.noteId;
            closeModal();
            setTimeout(() => {
                this.deleteNote(parseInt(noteId));
            }, 300);
        });

        // Botón compartir
        shareBtn.addEventListener('click', () => {
            this.shareNote(modal.dataset.noteId);
        });
    }

    addNote() {
        const textarea = document.getElementById('not');
        const content = textarea.value.trim();

        if (content === '') {
            this.showMessage('Por favor, escribe algo antes de añadir la nota.', 'warning');
            return;
        }

        // Crear objeto nota
        const note = {
            id: Date.now(),
            content: content,
            date: new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
        };

        // Añadir nota al array
        this.notes.unshift(note); // unshift para mostrar las más recientes primero

        // Guardar en localStorage
        this.saveNotes();

        // Mostrar notas actualizadas
        this.displayNotes();

        // Limpiar textarea
        textarea.value = '';
        textarea.style.height = 'auto';

        // Mostrar mensaje de éxito
        this.showMessage('¡Nota añadida exitosamente!', 'success');

        // Scroll automático a la sección de notas
        setTimeout(() => {
            this.scrollToNotes();
        }, 500);
    }

    displayNotes() {
        const notesContainer = document.getElementById('my-notes');

        if (this.notes.length === 0) {
            notesContainer.innerHTML = `
                <h1 class="inf-mis-notas">Mis notas:</h1>
                <div class="no-notes">
                    <p>No tienes notas guardadas aún. ¡Crea tu primera nota!</p>
                </div>
            `;
            return;
        }

        let notesHTML = '<h1 class="inf-mis-notas">Mis notas:</h1><div class="notes-grid">';

        this.notes.forEach(note => {
            notesHTML += `
                <div class="note-card" data-id="${note.id}">
                    <div class="note-header">
                        <span class="note-date">${note.date}</span>
                        <div class="note-actions">
                            <button class="btn-view" onclick="notesManager.viewFullNote(${note.id})" title="Ver nota completa">
                                👁️
                            </button>
                            <button class="btn-edit" onclick="notesManager.editNote(${note.id})" title="Editar nota">
                                ✏️
                            </button>
                            <button class="btn-delete" onclick="notesManager.deleteNote(${note.id})" title="Eliminar nota">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="note-content" onclick="notesManager.viewFullNote(${note.id})" style="cursor: pointer;">
                        <p>${this.formatNoteContent(note.content)}</p>
                    </div>
                </div>
            `;
        });

        notesHTML += '</div>';
        notesContainer.innerHTML = notesHTML;
    }

    viewFullNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const modal = document.getElementById('note-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalWordCount = document.getElementById('modal-word-count');
        const modalContent = document.getElementById('modal-note-content');

        // Configurar contenido del modal
        modalTitle.textContent = 'Nota Completa';
        modalDate.textContent = `Creada: ${note.date}`;

        // Calcular estadísticas
        const wordCount = note.content.split(/\s+/).length;
        const charCount = note.content.length;
        modalWordCount.textContent = `${wordCount} palabras, ${charCount} caracteres`;

        modalContent.textContent = note.content;
        modal.dataset.noteId = id;

        // Mostrar modal con animación
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Enfocar en el contenido para permitir scroll con teclado
        modalContent.focus();
    }

    shareNote(id) {
        const note = this.notes.find(n => n.id === parseInt(id));
        if (!note) return;

        // Crear modal de opciones de compartir
        this.showShareModal(note);
    }

    showShareModal(note) {
        // Crear modal de compartir
        const shareModalHTML = `
            <div id="share-modal" class="share-modal">
                <div class="modal-overlay"></div>
                <div class="share-modal-content">
                    <div class="share-header">
                        <h3>📤 Compartir Nota</h3>
                        <button class="btn-close-share">✖️</button>
                    </div>
                    <div class="share-body">
                        <div class="share-preview">
                            <strong>Vista previa:</strong>
                            <div class="share-note-preview">
                                <div class="share-note-date">${note.date}</div>
                                <div class="share-note-content">${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}</div>
                            </div>
                        </div>
                        <div class="share-options">
                            <button class="share-option" data-method="whatsapp">
                                <span class="share-icon">💬</span>
                                <div>
                                    <strong>WhatsApp</strong>
                                    <small>Compartir por WhatsApp</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="email">
                                <span class="share-icon">📧</span>
                                <div>
                                    <strong>Email</strong>
                                    <small>Enviar por correo electrónico</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="telegram">
                                <span class="share-icon">✈️</span>
                                <div>
                                    <strong>Telegram</strong>
                                    <small>Compartir en Telegram</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="twitter">
                                <span class="share-icon">🐦</span>
                                <div>
                                    <strong>Twitter/X</strong>
                                    <small>Compartir en Twitter</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="copy">
                                <span class="share-icon">📋</span>
                                <div>
                                    <strong>Copiar texto</strong>
                                    <small>Copiar al portapapeles</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="download">
                                <span class="share-icon">💾</span>
                                <div>
                                    <strong>Descargar</strong>
                                    <small>Guardar como archivo .txt</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="qr">
                                <span class="share-icon">📱</span>
                                <div>
                                    <strong>Código QR</strong>
                                    <small>Generar código QR</small>
                                </div>
                            </button>
                            <button class="share-option" data-method="native">
                                <span class="share-icon">🔗</span>
                                <div>
                                    <strong>Compartir sistema</strong>
                                    <small>Usar el sistema nativo</small>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Añadir modal al DOM
        document.body.insertAdjacentHTML('beforeend', shareModalHTML);

        // Añadir estilos del modal de compartir
        this.addShareModalStyles();

        // Configurar eventos
        this.setupShareModalEvents(note);

        // Mostrar modal
        const shareModal = document.getElementById('share-modal');
        shareModal.style.display = 'flex';
        setTimeout(() => shareModal.classList.add('show'), 10);
    }

    addShareModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                align-items: center;
                justify-content: center;
            }

            .share-modal.show {
                opacity: 1;
            }

            .share-modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.8);
                animation: modalSlideIn 0.3s ease forwards;
            }

            .share-header {
                padding: 20px;
                border-bottom: 2px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border-radius: 13px 13px 0 0;
            }

            .share-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }

            .btn-close-share {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-close-share:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .share-body {
                padding: 20px;
            }

            .share-preview {
                margin-bottom: 25px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
            }

            .share-note-preview {
                margin-top: 10px;
            }

            .share-note-date {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 8px;
            }

            .share-note-content {
                font-family: 'Kalam', cursive;
                line-height: 1.6;
                color: #333;
                background: white;
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #ddd;
            }

            .share-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
            }

            .share-option {
                display: flex;
                align-items: center;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                gap: 15px;
            }

            .share-option:hover {
                border-color: #4CAF50;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
            }

            .share-icon {
                font-size: 1.5rem;
                min-width: 30px;
            }

            .share-option div {
                flex: 1;
            }

            .share-option strong {
                display: block;
                color: #333;
                font-size: 1rem;
                margin-bottom: 2px;
            }

            .share-option small {
                color: #666;
                font-size: 0.85rem;
            }

            @media (max-width: 768px) {
                .share-options {
                    grid-template-columns: 1fr;
                }
                
                .share-modal-content {
                    width: 95%;
                    margin: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupShareModalEvents(note) {
        const shareModal = document.getElementById('share-modal');
        const overlay = shareModal.querySelector('.modal-overlay');
        const closeBtn = shareModal.querySelector('.btn-close-share');
        const shareOptions = shareModal.querySelectorAll('.share-option');

        // Cerrar modal
        const closeShareModal = () => {
            shareModal.classList.remove('show');
            setTimeout(() => {
                shareModal.remove();
            }, 300);
        };

        overlay.addEventListener('click', closeShareModal);
        closeBtn.addEventListener('click', closeShareModal);

        // Manejar opciones de compartir
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const method = option.dataset.method;
                this.handleShareMethod(method, note);
                closeShareModal();
            });
        });
    }

    handleShareMethod(method, note) {
        const formattedText = this.formatNoteForSharing(note);
        const encodedText = encodeURIComponent(formattedText);
        const shortText = note.content.length > 100 ?
            note.content.substring(0, 100) + '...' :
            note.content;

        switch (method) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodedText}`, '_blank');
                this.showMessage('¡Abriendo WhatsApp para compartir!', 'success');
                break;

            case 'email':
                const subject = encodeURIComponent(`Mi nota del ${note.date.split(',')[0]}`);
                const body = encodeURIComponent(formattedText);
                window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                this.showMessage('¡Abriendo cliente de email!', 'success');
                break;

            case 'telegram':
                window.open(`https://t.me/share/url?text=${encodedText}`, '_blank');
                this.showMessage('¡Abriendo Telegram para compartir!', 'success');
                break;

            case 'twitter':
                const tweetText = note.content.length > 200 ?
                    note.content.substring(0, 197) + '...' :
                    note.content;
                const tweetEncoded = encodeURIComponent(`📝 Mi nota: ${tweetText}\n\n#MisNotas #NotasUs`);
                window.open(`https://twitter.com/intent/tweet?text=${tweetEncoded}`, '_blank');
                this.showMessage('¡Abriendo Twitter para compartir!', 'success');
                break;

            case 'copy':
                this.copyToClipboard(formattedText);
                break;

            case 'download':
                this.downloadNoteAsFile(note);
                break;

            case 'qr':
                this.generateQRCode(formattedText);
                break;

            case 'native':
                if (navigator.share) {
                    navigator.share({
                        title: `Mi nota del ${note.date.split(',')[0]}`,
                        text: formattedText
                    }).then(() => {
                        this.showMessage('¡Nota compartida exitosamente!', 'success');
                    }).catch(() => {
                        this.showMessage('Cancelado por el usuario', 'warning');
                    });
                } else {
                    this.showMessage('Función de compartir no disponible en este navegador', 'warning');
                }
                break;
        }
    }

    formatNoteForSharing(note) {
        return `📝 MI NOTA
📅 Fecha: ${note.date}
📊 ${note.content.split(/\s+/).length} palabras, ${note.content.length} caracteres

✍️ CONTENIDO:
${note.content}

---
💫 Creado con Notas Us`;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('¡Nota copiada al portapapeles!', 'success');
        }).catch(() => {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showMessage('¡Nota copiada al portapapeles!', 'success');
            } catch (err) {
                this.showMessage('Error al copiar la nota', 'error');
            }
            document.body.removeChild(textArea);
        });
    }

    downloadNoteAsFile(note) {
        const content = this.formatNoteForSharing(note);
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Crear nombre de archivo seguro
        const safeDate = note.date.replace(/[:/,\s]/g, '-');
        const fileName = `Nota-${safeDate}.txt`;

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('¡Nota descargada como archivo!', 'success');
    }

    generateQRCode(text) {
        // Crear modal para mostrar QR
        const qrModalHTML = `
            <div id="qr-modal" class="note-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2>📱 Código QR de tu Nota</h2>
                        <button class="btn-modal-close">✖️</button>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <p>Escaneá este código QR para compartir tu nota:</p>
                        <div id="qr-container" style="margin: 20px 0; padding: 20px; background: white; border-radius: 10px;">
                            <div style="width: 200px; height: 200px; margin: 0 auto; background: #f0f0f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                                📱
                            </div>
                        </div>
                        <p style="color: #666; font-size: 0.9rem;">
                            Nota: Para generar un código QR real, necesitarías una librería externa como QRCode.js
                        </p>
                        <button class="btn-copy-qr-text" style="margin-top: 15px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            📋 Copiar texto de la nota
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', qrModalHTML);
        const qrModal = document.getElementById('qr-modal');

        // Mostrar modal
        qrModal.style.display = 'flex';
        setTimeout(() => qrModal.classList.add('show'), 10);

        // Eventos del modal QR
        const closeQR = () => {
            qrModal.classList.remove('show');
            setTimeout(() => qrModal.remove(), 300);
        };

        qrModal.querySelector('.modal-overlay').addEventListener('click', closeQR);
        qrModal.querySelector('.btn-modal-close').addEventListener('click', closeQR);
        qrModal.querySelector('.btn-copy-qr-text').addEventListener('click', () => {
            this.copyToClipboard(text);
            closeQR();
        });

        this.showMessage('¡Código QR generado! (Demo)', 'success');
    }

    formatNoteContent(content) {
        // Convertir saltos de línea a <br> y limitar longitud para vista previa
        const formatted = content.replace(/\n/g, '<br>');
        return formatted.length > 200 ? formatted.substring(0, 200) + '...' : formatted;
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const newContent = prompt('Editar nota:', note.content);
        if (newContent !== null && newContent.trim() !== '') {
            note.content = newContent.trim();
            note.preview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');

            this.saveNotes();
            this.displayNotes();
            this.showMessage('Nota actualizada exitosamente!', 'success');
        }
    }

    deleteNote(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.displayNotes();
            this.showMessage('Nota eliminada exitosamente!', 'success');
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('notasUs_notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error al guardar las notas:', error);
            this.showMessage('Error al guardar las notas', 'error');
        }
    }

    loadNotes() {
        try {
            const saved = localStorage.getItem('notasUs_notes');
            this.notes = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error al cargar las notas:', error);
            this.notes = [];
        }
    }

    scrollToNotes() {
        const notesSection = document.getElementById('my-notes');
        notesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    showMessage(message, type) {
        // Eliminar mensaje anterior si existe
        const existingMessage = document.querySelector('.notification-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `notification-message ${type}`;
        messageDiv.textContent = message;

        // Añadir al DOM
        document.body.appendChild(messageDiv);

        // Mostrar con animación
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 3000);
    }

    // Método para exportar notas
    exportNotes() {
        if (this.notes.length === 0) {
            this.showMessage('No hay notas para exportar', 'warning');
            return;
        }

        const notesText = this.notes.map(note =>
            `Fecha: ${note.date}\n${note.content}\n${'='.repeat(50)}\n`
        ).join('\n');

        const blob = new Blob([notesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mis_notas_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Notas exportadas exitosamente!', 'success');
    }

    // Método para limpiar todas las notas
    clearAllNotes() {
        if (this.notes.length === 0) {
            this.showMessage('No hay notas para eliminar', 'warning');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar TODAS las notas? Esta acción no se puede deshacer.')) {
            this.notes = [];
            this.saveNotes();
            this.displayNotes();
            this.showMessage('Todas las notas han sido eliminadas', 'success');
        }
    }
}

// Inicializar el sistema de notas cuando el DOM esté listo
let notesManager;

document.addEventListener('DOMContentLoaded', function () {
    notesManager = new NotesManager();

    // Hacer disponibles algunas funciones globalmente para uso en HTML
    window.notesManager = notesManager;
});
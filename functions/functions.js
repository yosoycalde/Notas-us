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
                            <button class="btn-edit" onclick="notesManager.editNote(${note.id})" title="Editar nota">
                                ✏️
                            </button>
                            <button class="btn-delete" onclick="notesManager.deleteNote(${note.id})" title="Eliminar nota">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="note-content">
                        <p>${this.formatNoteContent(note.content)}</p>
                    </div>
                </div>
            `;
        });

        notesHTML += '</div>';
        notesContainer.innerHTML = notesHTML;
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
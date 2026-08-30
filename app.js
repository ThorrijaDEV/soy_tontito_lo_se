const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mppzqzqp';

const screens = {
    intro: 'screen-intro',
    informe: 'screen-informe',
    aclaracion: 'screen-aclaracion',
    decision: 'screen-decision',
    yes: 'screen-yes',
    no: 'screen-no',
    moreTime: 'screen-more-time'
};

let currentScreen = 'intro';
let isSubmitting = false;

function showScreen(screenKey) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screens[screenKey]);
    if (target) {
        target.classList.add('active');
        currentScreen = screenKey;
        window.scrollTo(0, 0);
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#22c55e', '#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];
    const pieceCount = 80;
    
    for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = piece.style.height = (Math.random() * 6 + 6) + 'px';
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        piece.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(piece);
        
        setTimeout(() => piece.remove(), 4000);
    }
}

async function submitResponse(response) {
    if (isSubmitting) return;
    isSubmitting = true;
    showLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('respuesta', response);
        formData.append('_subject', `🚨 NUEVA RESPUESTA - ${response}`);
        
        const resp = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (resp.ok) {
            showToast('Respuesta enviada correctamente ✓', 'success');
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        console.error('Formspree error:', error);
        showToast('Error al enviar. Intenta de nuevo.', 'error');
        isSubmitting = false;
        showLoading(false);
        return false;
    }
    
    isSubmitting = false;
    showLoading(false);
    return true;
}

function handleResponse(response) {
    submitResponse(response).then(success => {
        if (!success) return;
        
        switch (response) {
            case 'SI':
                createConfetti();
                showScreen('yes');
                break;
            case 'NO':
                showScreen('no');
                break;
            case 'NECESITO_MAS_TIEMPO':
                showScreen('moreTime');
                break;
        }
    });
}

function initEventListeners() {
    document.getElementById('btn-intro-next').addEventListener('click', () => showScreen('informe'));
    document.getElementById('btn-informe-next').addEventListener('click', () => showScreen('aclaracion'));
    document.getElementById('btn-aclaracion-next').addEventListener('click', () => showScreen('decision'));
    
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            const response = card.dataset.response;
            handleResponse(response);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    document.getElementById('btn-yes-back').addEventListener('click', () => showScreen('intro'));
    document.getElementById('btn-no-back').addEventListener('click', () => showScreen('decision'));
    document.getElementById('btn-more-time-back').addEventListener('click', () => showScreen('decision'));
}

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    showScreen('intro');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (currentScreen === 'informe' || currentScreen === 'aclaracion' || currentScreen === 'decision') {
            showScreen('intro');
        } else if (currentScreen === 'yes' || currentScreen === 'no' || currentScreen === 'moreTime') {
            showScreen('decision');
        }
    }
});
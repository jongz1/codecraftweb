// motivational-pet.js
(function() {
    'use strict';

    // Frases motivacionales
    const motivationalPhrases = [
        "¡Tú puedes lograr lo que te propongas!",
        "Cada día es una nueva oportunidad para brillar.",
        "Los pequeños pasos llevan a grandes logros.",
        "Confía en tu proceso y en tu crecimiento.",
        "Eres más fuerte de lo que crees.",
        "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
        "No te rindas, el comienzo es siempre lo más difícil.",
        "Cree en ti mismo y todo será posible.",
        "Tu actitud positiva es tu superpoder.",
        "Hoy es un buen día para tener un gran día.",
        "Cada esfuerzo te acerca más a tu meta.",
        "El fracaso es solo una oportunidad para comenzar de nuevo con más experiencia.",
        "Tu potencial es infinito, no te limites.",
        "La perseverancia es la clave del éxito.",
        "Celebra cada pequeño logro en tu camino."
    ];

    // Variables de estado
    let isActive = true;
    let timerInterval;
    let lastActivityTime = Date.now();
    let positionIndex = 0;
    const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];

    // Elementos DOM
    let petContainer;
    let messageBubble;
    let petNotification;

    // Inicializar la mascota
    function init() {
        createPetElements();
        setupEventListeners();
        startTimer();
        applyStyles();
    }

    // Crear elementos DOM de la mascota
    function createPetElements() {
        // Crear contenedor principal
        petContainer = document.createElement('div');
        petContainer.className = 'motivational-pet-container';
        
        // Crear HTML de la mascota
        petContainer.innerHTML = `
            <div class="pet-controls">
                <button class="control-btn" id="petToggleActive">⏸️</button>
                <button class="control-btn" id="petMove">↕️</button>
                <button class="control-btn" id="petClose">❌</button>
            </div>
            <div class="pet">
                <div class="pet-body"></div>
                <div class="pet-face"></div>
                <div class="pet-eyes">
                    <div class="eye">
                        <div class="pupil"></div>
                    </div>
                    <div class="eye">
                        <div class="pupil"></div>
                    </div>
                </div>
                <div class="pet-beak"></div>
                <div class="pet-feet">
                    <div class="foot left"></div>
                    <div class="foot right"></div>
                </div>
            </div>
            <div class="bubble" id="petMessageBubble"></div>
        `;

        // Crear notificación
        petNotification = document.createElement('div');
        petNotification.className = 'pet-notification';
        petNotification.id = 'petNotification';

        // Añadir elementos al cuerpo del documento
        document.body.appendChild(petContainer);
        document.body.appendChild(petNotification);

        // Referencias a elementos
        messageBubble = document.getElementById('petMessageBubble');
    }

    // Aplicar estilos CSS
    function applyStyles() {
        const styles = `
            .motivational-pet-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 150px;
                height: 150px;
                cursor: pointer;
                z-index: 10000;
                transition: all 0.3s ease;
            }
            
            .motivational-pet-container .pet {
                width: 100%;
                height: 100%;
                position: relative;
                transition: transform 0.3s ease;
            }
            
            .motivational-pet-container .pet:hover {
                transform: scale(1.05);
            }
            
            .motivational-pet-container .pet-body {
                width: 120px;
                height: 120px;
                background-color: #8B4513;
                border-radius: 50%;
                position: absolute;
                top: 15px;
                left: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .motivational-pet-container .pet-face {
                position: absolute;
                width: 90px;
                height: 80px;
                background-color: #DEB887;
                border-radius: 50%;
                top: 30px;
                left: 30px;
            }
            
            .motivational-pet-container .pet-eyes {
                position: absolute;
                top: 15px;
                width: 100%;
                display: flex;
                justify-content: space-around;
            }
            
            .motivational-pet-container .eye {
                width: 30px;
                height: 30px;
                background-color: white;
                border-radius: 50%;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 0 3px #8B4513;
            }
            
            .motivational-pet-container .pupil {
                width: 15px;
                height: 15px;
                background-color: #000;
                border-radius: 50%;
                position: absolute;
                top: 7.5px;
                left: 7.5px;
                transition: all 0.3s ease;
            }
            
            .motivational-pet-container .pet-beak {
                width: 25px;
                height: 15px;
                background-color: #FFA500;
                border-radius: 50%;
                position: absolute;
                top: 55px;
                left: 62.5px;
                clip-path: polygon(50% 100%, 0 0, 100% 0);
                transform: scale(1.2);
                z-index: 5;
            }
            
            .motivational-pet-container .pet-feet {
                position: absolute;
                bottom: 5px;
                width: 100%;
                display: flex;
                justify-content: space-around;
            }
            
            .motivational-pet-container .foot {
                width: 20px;
                height: 10px;
                background-color: #8B4513;
                border-radius: 50%;
            }
            
            .motivational-pet-container .bubble {
                position: absolute;
                background-color: blue;
                border-radius: 20px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                max-width: 200px;
                min-width: 150px;
                top: -120px;
                left: 50%;
                transform: translateX(-50%);
                display: none;
                z-index: 10;
                font-size: 14px;
                text-align: center;
                animation: petBubbleAppear 0.3s ease;
            }
            
            .motivational-pet-container .bubble::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 10px solid transparent;
                border-top-color: white;
            }
            
            @keyframes petBubbleAppear {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            .motivational-pet-container .pet-controls {
                position: absolute;
                top: -40px;
                left: 0;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 20px;
                padding: 5px 10px;
                display: flex;
                gap: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .motivational-pet-container:hover .pet-controls {
                opacity: 1;
            }
            
            .motivational-pet-container .control-btn {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            
            .motivational-pet-container .control-btn:hover {
                background: rgba(0,0,0,0.1);
            }
            
            .pet-notification {
                position: fixed;
                bottom: 300px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                z-index: 10001;
                display: none;
                animation: petSlideIn 0.5s ease;
            }
            
            @keyframes petSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Click en la mascota
        petContainer.addEventListener('click', function(e) {
            if (e.target.closest('.pet-controls')) return;
            showMotivationalPhrase();
        });

        // Ojos siguiendo el cursor
        document.addEventListener('mousemove', function(e) {
            animateEyes(e);
            lastActivityTime = Date.now();
        });

        // Controles
        document.getElementById('petToggleActive').addEventListener('click', toggleActive);
        document.getElementById('petMove').addEventListener('click', movePet);
        document.getElementById('petClose').addEventListener('click', closePet);
    }

    // Mostrar frase motivacional
    function showMotivationalPhrase() {
        if (!isActive) return;
        
        const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
        messageBubble.textContent = motivationalPhrases[randomIndex];
        messageBubble.style.display = 'block';
        
        showNotification("¡Nuevo mensaje motivacional!");
        
        setTimeout(() => {
            messageBubble.style.display = 'none';
        }, 5000);
    }

    // Mostrar notificación
    function showNotification(message) {
        petNotification.textContent = message;
        petNotification.style.display = 'block';
        
        setTimeout(() => {
            petNotification.style.display = 'none';
        }, 3000);
    }

    // Animación de ojos
    function animateEyes(e) {
        const eyes = document.querySelectorAll('.motivational-pet-container .eye');
        eyes.forEach(eye => {
            const pupil = eye.querySelector('.pupil');
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const distance = Math.min(7, 
                Math.sqrt(
                    Math.pow(e.clientX - eyeCenterX, 2) + 
                    Math.pow(e.clientY - eyeCenterY, 2)
                ) / 15
            );
            
            const pupilX = Math.cos(angle) * distance;
            const pupilY = Math.sin(angle) * distance;
            
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    }

    // Temporizador
    function startTimer() {
        // Mostrar primera frase después de 2 segundos
        setTimeout(showMotivationalPhrase, 2000);
        
        // Configurar intervalo cada 5 minutos
        timerInterval = setInterval(showMotivationalPhrase, 5 * 60 * 1000);
        
        // Verificar inactividad cada minuto
        setInterval(checkInactivity, 60 * 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Verificar inactividad
    function checkInactivity() {
        const currentTime = Date.now();
        const inactiveTime = currentTime - lastActivityTime;
        
        if (inactiveTime > 10 * 60 * 1000 && isActive) {
            messageBubble.textContent = "¡Hey! ¿Sigues ahí? Recuerda tomar descansos y mantenerte hidratado.";
            messageBubble.style.display = 'block';
            
            setTimeout(() => {
                messageBubble.style.display = 'none';
            }, 5000);
            
            lastActivityTime = currentTime;
        }
    }

    // Controladores de botones
    function toggleActive(e) {
        if (e) e.stopPropagation();
        
        isActive = !isActive;
        const toggleBtn = document.getElementById('petToggleActive');
        toggleBtn.textContent = isActive ? '⏸️' : '▶️';
        
        if (isActive) {
            startTimer();
            showNotification("Mascota activada");
        } else {
            stopTimer();
            showNotification("Mascota pausada");
        }
    }

    function movePet(e) {
        if (e) e.stopPropagation();
        
        positionIndex = (positionIndex + 1) % positions.length;
        setPosition(positions[positionIndex]);
    }

    function closePet(e) {
        if (e) e.stopPropagation();
        
        if (confirm("¿Estás seguro de que quieres eliminar la mascota?")) {
            remove();
        }
    }

    // API Pública
    function setPosition(position) {
        const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        if (!validPositions.includes(position)) {
            console.warn('Posición no válida. Usando posición por defecto: bottom-right');
            position = 'bottom-right';
        }
        
        petContainer.style.position = 'fixed';
        petContainer.style.top = position.includes('top') ? '20px' : 'auto';
        petContainer.style.bottom = position.includes('bottom') ? '20px' : 'auto';
        petContainer.style.left = position.includes('left') ? '20px' : 'auto';
        petContainer.style.right = position.includes('right') ? '20px' : 'auto';
    }

    function setSize(size) {
        const validSizes = ['small', 'medium', 'large'];
        const sizeMap = {
            'small': '100px',
            'medium': '150px',
            'large': '200px'
        };
        
        if (!validSizes.includes(size)) {
            console.warn('Tamaño no válido. Usando tamaño por defecto: medium');
            size = 'medium';
        }
        
        petContainer.style.width = sizeMap[size];
        petContainer.style.height = sizeMap[size];
    }

    function addMotivationalPhrase(phrase) {
        if (typeof phrase === 'string' && phrase.trim() !== '') {
            motivationalPhrases.push(phrase.trim());
        }
    }

    function showMessage(message) {
        if (typeof message === 'string' && message.trim() !== '') {
            messageBubble.textContent = message.trim();
            messageBubble.style.display = 'block';
            
            setTimeout(() => {
                messageBubble.style.display = 'none';
            }, 5000);
        }
    }

    function remove() {
        if (petContainer && document.body.contains(petContainer)) {
            petContainer.remove();
            petNotification.remove();
            stopTimer();
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer API pública
    window.MotivationalPet = {
        setPosition,
        setSize,
        addMotivationalPhrase,
        showMessage,
        remove,
        toggleActive,
        isActive: () => isActive
    };

})();

document.addEventListener('DOMContentLoaded', () => {
    // --- EFECTO MOUSE (Sparkles) ---
    document.addEventListener('mousemove', (e) => {
        // Creamos un destello
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Posicionarlo donde está el mouse
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        
        // Tamaño aleatorio para variar
        const size = Math.random() * 5 + 2; 
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        
        document.body.appendChild(sparkle);

        // Eliminar del DOM después de la animación (1s)
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- 1. ENTRADA ---
    enterBtn.addEventListener('click', () => {
        enterScreen.style.opacity = '0';
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainLayout.classList.remove('hidden-layout');
            initTypewriter();
            playMusic();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "What are we made of, if not dreams? Of all kinds: those never realized, those within reach, those we strive to achieve, and above all, those we keep close to our hearts.";
    function initTypewriter() {
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 35); 
            }
        }
        type();
    }

    // --- 2. GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.filter = "blur(10px) grayscale(50%)";
            mainLayout.style.transform = "scale(0.98)";
            
            if(modalId === 'modal-gallery') setTimeout(updateGallery3D, 100);
        }
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- 3. GALERÍA 3D ---
    const galleryImages = [
        "https://xatimg.com/image/rqZ5uC07rqhT.jpg",
        "https://xatimg.com/image/zGfdlR0hqNwE.jpg",
        "https://xatimg.com/image/ZzfPIQaiKNhh.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    carouselTrack.innerHTML = "";
    galleryImages.forEach((src, i) => {
        const card = document.createElement('div');
        card.className = 'card-3d-gold';
        card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:cover;">`;
        card.onclick = () => { galleryIndex = i; updateGallery3D(); };
        carouselTrack.appendChild(card);
    });

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const fullCardWidth = cards[0].offsetWidth + 40; 
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardWidth) - (fullCardWidth / 2) + 20;

        carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- 4. MÚSICA ---
    const playlist = [
        { title: "Golden", artist: "Kpop", src: "audio/Golden KPop.mp3" },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        audio.src = playlist[i].src;
        document.getElementById('song-title').innerText = playlist[i].title;
        document.getElementById('song-artist').innerText = playlist[i].artist;
    }
    
    window.playMusic = () => {
        audio.play().then(() => {
            isPlaying = true;
            vinyl.classList.add('vinyl-spin');
            playIcon.className = "fas fa-pause";
            pInt = setInterval(() => {
                progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
            }, 100);
        }).catch(() => {});
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            vinyl.classList.remove('vinyl-spin');
            playIcon.className = "fas fa-play";
            clearInterval(pInt);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; loadMusic(sIdx); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; loadMusic(sIdx); playMusic(); };
    loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });
});
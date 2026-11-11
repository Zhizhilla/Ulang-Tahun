const bgMusic = document.getElementById("bg-music");
const lockScreen = document.getElementById("lock-screen");
const envelopeScreen = document.getElementById("envelope-screen");
const cameraScreen = document.getElementById("camera-screen");
const btnCountdown = document.getElementById("btn-countdown");

// ==========================================
// ATUR TANGGAL TARGET COUNTDOWN DI SINI!
// ==========================================
const targetDate = new Date("November 12 2026 00:00:00").getTime(); // Ganti tanggal sesuai keinginanmu

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (!btnCountdown) return;

    if (distance <= 0) {
        // Waktu sudah habis: Nolkan angka danBUKA KUNCI tombolnya
        if (hoursElement) hoursElement.innerText = "00";
        if (minutesElement) minutesElement.innerText = "00";
        if (secondsElement) secondsElement.innerText = "00";

        btnCountdown.removeAttribute("disabled");
        btnCountdown.style.opacity = "1";
        btnCountdown.style.cursor = "pointer";
        btnCountdown.innerText = "BUKA SEKARANG! 💖";
        return;
    } else {
        // Waktu belum habis: Pastikan tombol TETAP TERKUNCI RAPAT
        btnCountdown.setAttribute("disabled", "true");
        btnCountdown.style.opacity = "0.6";
        btnCountdown.style.cursor = "not-allowed";
    }

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (hoursElement) hoursElement.innerText = String(hours).padStart(2, "0");
    if (minutesElement)
        minutesElement.innerText = String(minutes).padStart(2, "0");
    if (secondsElement)
        secondsElement.innerText = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 1. KLIK TOMBOL LOCK SCREEN UTAMA (Aman, tidak akan jalan kalau masih disabled)
btnCountdown.addEventListener("click", () => {
    if (btnCountdown.hasAttribute("disabled")) return; // Pengaman ekstra

    bgMusic.play().catch(() => {});
    lockScreen.classList.add("hidden");
    envelopeScreen.classList.remove("hidden");
});

// 2. LOGIKA AMPLOP, SURAT KELUAR, & MUNCUL JENDELA BLUR
const envelope = document.getElementById("envelope");
const letterModal = document.getElementById("letter-modal");

if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.classList.toggle("open");

        if (envelope.classList.contains("open")) {
            setTimeout(() => {
                if (letterModal) letterModal.classList.add("show");
            }, 600);
        }
    });
}

// Tombol Lanjut ke Kamera di dalam modal surat
const goCameraBtn = document.getElementById("go-camera");
if (goCameraBtn) {
    goCameraBtn.addEventListener("click", () => {
        if (letterModal) letterModal.classList.remove("show");
        envelopeScreen.classList.add("hidden");
        cameraScreen.classList.remove("hidden");
    });
}

// 3. CAROUSEL KAMERA RETRO
const gallery = [
    {
        img: "bahan/foto1.jpg",
        caption: "Makasii banyak udah hadir di hidup Illa!!"
    },
    { img: "bahan/foto2.jpg", caption: "Nemu di fb mamaku wkwkwk" },
    {
        img: "bahan/foto3.jpg",
        caption: "Tetap jadi Icha yang Illa kenal yakk ✨"
    },
    {
        img: "bahan/foto4.jpg",
        caption: "Iiihh comel, izin ambil yak( •̀ ω •́ )✧"
    },
    { img: "bahan/foto5.jpg", caption: "Comel( ✧Д✧)" }
];

let currentIndex = 0;
const cameraImg = document.getElementById("camera-img");
const cameraCaption = document.getElementById("camera-caption");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function updateCanvasCamera() {
    if (cameraImg && cameraCaption) {
        cameraImg.src = gallery[currentIndex].img;
        cameraCaption.innerText = gallery[currentIndex].caption;
    }
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        updateCanvasCamera();
    });
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % gallery.length;
        updateCanvasCamera();
    });
}

// 4. TOMBOL MENUJU GALAKSI 3D (HITUNG MUNDUR 3-2-1)
const btnToGalaxy = document.getElementById("btn-to-galaxy");
if (btnToGalaxy) {
    btnToGalaxy.addEventListener("click", () => {
        const transitionCountdownScreen =
            document.getElementById("countdown-screen");
        const countdownNumber = document.getElementById("countdown-number");
        const activeGalaxyScreen = document.getElementById("galaxy-screen");

        cameraScreen.classList.add("hidden");
        transitionCountdownScreen.classList.remove("hidden");

        let count = 3;
        if (countdownNumber) countdownNumber.innerText = count;

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                if (countdownNumber) countdownNumber.innerText = count;
            } else if (count === 0) {
                if (countdownNumber) countdownNumber.innerText = "🎉";
            } else {
                clearInterval(timer);
                transitionCountdownScreen.classList.add("hidden");
                activeGalaxyScreen.classList.remove("hidden");
                initGalaxy3D();
            }
        }, 1000);
    });
}

// 5. GALAKSI 3D THREE.JS (FOTO BENTUK LINGKARAN / KOIN 1:1)
function initGalaxy3D() {
    const container = document.getElementById("galaxy-canvas-container");
    if (!container) return;
    container.innerHTML = "";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.enableZoom = true;

    // Bola Inti di Tengah
    const coreGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    const coreMaterial = new THREE.PointsMaterial({
        color: 0xff4785,
        size: 0.04,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });
    const coreSphere = new THREE.Points(coreGeometry, coreMaterial);
    scene.add(coreSphere);

    // Cincin Foto Galaksi
    const textureLoader = new THREE.TextureLoader();
    const photoUrls = [
        "bahan/foto1.jpg",
        "bahan/foto2.jpg",
        "bahan/foto3.jpg",
        "bahan/foto4.jpg",
        "bahan/foto5.jpg",
        "bahan/foto6.jpg"
    ];

    const galGroup = new THREE.Group();
    scene.add(galGroup);

    // Bintang-bintang partikel
    const particleCount = 20000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 6 + 1.5;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 0.6;

        starPos[i * 3] = Math.cos(angle) * radius;
        starPos[i * 3 + 1] = y;
        starPos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xffb6c1,
        transparent: true,
        opacity: 0.5
    });
    const starField = new THREE.Points(starGeo, starMat);
    galGroup.add(starField);

    // FOTO BERBENTUK LINGKARAN (KOIN) 1:1 MENGGUNAKAN CIRCLE GEOMETRY
    const totalPhotos = 55;
    const circleGeo = new THREE.CircleGeometry(0.3, 32);

    for (let i = 0; i < totalPhotos; i++) {
        const pUrl = photoUrls[i % photoUrls.length];
        const pTex = textureLoader.load(pUrl);

        pTex.generateMipmaps = true;
        pTex.minFilter = THREE.LinearMipmapLinearFilter;

        const pMat = new THREE.MeshBasicMaterial({
            map: pTex,
            side: THREE.DoubleSide
        });

        const photoMesh = new THREE.Mesh(circleGeo, pMat);
        const radius = 2.6 + Math.random() * 3.2;
        const angle = (i / totalPhotos) * Math.PI * 2 + Math.random() * 0.2;
        const y = (Math.random() - 0.5) * 0.8;

        photoMesh.position.set(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius
        );
        photoMesh.rotation.y = -angle + Math.PI / 2;
        galGroup.add(photoMesh);
    }

    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);

    function animate() {
        requestAnimationFrame(animate);
        galGroup.rotation.y += 0.0009;
        coreSphere.rotation.y -= 0.003;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

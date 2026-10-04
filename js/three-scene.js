/**
 * HAMMAD.AI - Three.js 3D WebGL Systems
 * 1. Fullscreen Hero Background 3D Quantum Neural Globe (Dynamic 60Hz / 120Hz+ Adaptive Engine)
 * 2. Ambient Deep Space Synaptic Network
 * 3. Real-Time Hardware Refresh Rate & FPS Detection (Delta-Time Normalized)
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js library missing. 3D effects skipped.');
    return;
  }

  /* ==========================================================================
     HARDWARE REFRESH RATE & REAL-TIME FPS MONITOR
     Detects 60Hz, 90Hz, 120Hz (ProMotion), 144Hz, 240Hz automatically
     ========================================================================== */
  class RefreshRateMonitor {
    constructor() {
      this.frameCount = 0;
      this.lastTime = performance.now();
      this.currentFps = 60;
      this.detectedHz = 60;
      this.fpsDomElements = [];
      this.history = [];
    }

    registerDomElement(el) {
      if (el && !this.fpsDomElements.includes(el)) {
        this.fpsDomElements.push(el);
      }
    }

    tick(now) {
      this.frameCount++;
      const elapsed = now - this.lastTime;

      if (elapsed >= 500) {
        this.currentFps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = now;

        // Classify refresh rate tier based on detected FPS
        if (this.currentFps > 135) {
          this.detectedHz = 144;
        } else if (this.currentFps > 105) {
          this.detectedHz = 120; // 120Hz ProMotion / High-Refresh
        } else if (this.currentFps > 75) {
          this.detectedHz = 90;
        } else {
          this.detectedHz = 60;
        }

        this.updateUi();
      }
    }

    updateUi() {
      const label = `ONLINE (${this.currentFps} FPS // ${this.detectedHz}Hz VSync)`;
      this.fpsDomElements.forEach((el) => {
        if (el) {
          el.textContent = label;
          if (this.currentFps >= 100) {
            el.style.color = '#00f0ff'; // Neon Cyan for 120Hz ProMotion
            el.setAttribute('title', 'Ultra High Refresh Rate (120Hz+ ProMotion) Active');
          } else {
            el.style.color = '#10b981'; // Emerald for 60Hz
          }
        }
      });
    }
  }

  const fpsMonitor = new RefreshRateMonitor();

  // Register DOM elements when ready
  document.addEventListener('DOMContentLoaded', () => {
    const footerFps = document.getElementById('fps-counter');
    if (footerFps) fpsMonitor.registerDomElement(footerFps);
    const hudFps = document.getElementById('hud-fps-badge');
    if (hudFps) fpsMonitor.registerDomElement(hudFps);
  });

  /* ==========================================================================
     1. HERO FULL-BACKGROUND 3D QUANTUM NEURAL GLOBE
     ========================================================================== */
  const heroContainer = document.getElementById('hero-interactive-canvas');
  if (heroContainer) {
    initHeroGlobe(heroContainer);
  }

  function initHeroGlobe(container) {
    const scene = new THREE.Scene();

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.8);

    // Renderer with High Refresh Rate & Low Latency Power Preference
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Master Globe Pivot Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.position.set(0, -0.2, 0);

    // -------------------------------------------------------------
    // A. Outer Wireframe Globe (Latitude & Longitude Geodesic Sphere)
    // -------------------------------------------------------------
    const globeRadius = 3.6;
    const sphereGeo = new THREE.IcosahedronGeometry(globeRadius, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const outerSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(outerSphere);

    // -------------------------------------------------------------
    // B. Synaptic Nodes at Sphere Vertices (InstancedMesh for Single Draw Call)
    // -------------------------------------------------------------
    const spherePos = sphereGeo.attributes.position;
    const nodeCount = spherePos.count;
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85
    });

    const nodeInstanced = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < nodeCount; i++) {
      dummy.position.set(spherePos.getX(i), spherePos.getY(i), spherePos.getZ(i));
      dummy.updateMatrix();
      nodeInstanced.setMatrixAt(i, dummy.matrix);
    }
    nodeInstanced.instanceMatrix.needsUpdate = true;
    globeGroup.add(nodeInstanced);

    // -------------------------------------------------------------
    // C. Secondary Geometric Layer (Electric Violet Dodecahedron)
    // -------------------------------------------------------------
    const innerGeo = new THREE.DodecahedronGeometry(globeRadius * 0.72, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    // -------------------------------------------------------------
    // D. Core Energy Nucleus (Glowing Quantum AI Core)
    // -------------------------------------------------------------
    const nucleusGeo = new THREE.SphereGeometry(globeRadius * 0.35, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    globeGroup.add(nucleusMesh);

    // -------------------------------------------------------------
    // E. Futuristic Orbital Equatorial Rings
    // -------------------------------------------------------------
    const ring1Geo = new THREE.TorusGeometry(globeRadius * 1.22, 0.016, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.3;
    ring1.rotation.y = Math.PI / 8;
    globeGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(globeRadius * 1.34, 0.014, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.4
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2.6;
    ring2.rotation.z = Math.PI / 6;
    globeGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(globeRadius * 1.48, 0.009, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.35
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 4;
    ring3.rotation.y = Math.PI / 3;
    globeGroup.add(ring3);

    // -------------------------------------------------------------
    // F. Floating Satellite Quantum Nodes / Particle Cloud
    // -------------------------------------------------------------
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x00f0ff);
    const cViolet = new THREE.Color(0xa855f7);
    const cEmerald = new THREE.Color(0x00f5a0);

    for (let i = 0; i < particleCount; i++) {
      const radius = globeRadius * (0.9 + Math.random() * 0.95);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const choice = Math.random();
      const col = choice < 0.6 ? cCyan : choice < 0.85 ? cViolet : cEmerald;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleCloud = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particleCloud);

    // -------------------------------------------------------------
    // G. Dynamic Lighting
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.5, 30);
    cyanPoint.position.set(6, 4, 6);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0xa855f7, 3.0, 30);
    violetPoint.position.set(-6, -4, 5);
    scene.add(violetPoint);

    // -------------------------------------------------------------
    // H. Smooth Interactive Parallax Tracking & Drag Interaction
    // -------------------------------------------------------------
    let targetRotX = 0;
    let targetRotY = 0;
    let isUserDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const heroSection = document.getElementById('hero') || container;

    function handleMouseMove(e) {
      const rect = heroSection.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (!isUserDragging) {
        targetRotY = nx * 0.7;
        targetRotX = ny * 0.5;
      } else {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
      }
      prevMouse = { x: e.clientX, y: e.clientY };
    }

    heroSection.addEventListener('pointermove', handleMouseMove);

    container.addEventListener('pointerdown', (e) => {
      isUserDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      isUserDragging = false;
    });

    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;

      if (w < 768) {
        camera.position.z = 10.5;
      } else if (w < 1200) {
        camera.position.z = 9.2;
      } else {
        camera.position.z = 8.5;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // -------------------------------------------------------------
    // I. HARDWARE ADAPTIVE 60Hz / 120Hz+ DELTA-TIME RENDER LOOP
    // -------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate(currentTime) {
      requestAnimationFrame(animate);

      // Track frame rate dynamically
      fpsMonitor.tick(currentTime);

      // DELTA-TIME NORMALIZATION:
      // On 60Hz: delta ~ 0.0166s -> timeScale ~ 1.0
      // On 120Hz: delta ~ 0.0083s -> timeScale ~ 0.5
      // This guarantees rotation speed is perfectly identical on all displays,
      // while delivering 2x higher temporal smoothness on 120Hz/ProMotion displays!
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.1); // Clamp to prevent jump on tab focus
      const timeScale = delta * 60; // Base multiplier normalized to 60fps baseline

      const elapsedTime = clock.getElapsedTime();

      // Continuous autonomous rotation scaled by delta-time
      if (!isUserDragging) {
        globeGroup.rotation.y += 0.0035 * timeScale;
        globeGroup.rotation.x += 0.001 * timeScale;

        // Framerate-independent exponential spring lerp
        const lerpFactor = 1.0 - Math.exp(-4.0 * delta);
        globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * lerpFactor;
        globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * lerpFactor;
      }

      // Counter-rotations scaled by delta-time
      innerMesh.rotation.y -= 0.005 * timeScale;
      innerMesh.rotation.z += 0.003 * timeScale;

      ring1.rotation.z += 0.005 * timeScale;
      ring2.rotation.z -= 0.004 * timeScale;
      ring3.rotation.y += 0.006 * timeScale;

      particleCloud.rotation.y += 0.0018 * timeScale;

      // Soft breathing scale on nucleus
      const pulse = 1.0 + Math.sin(elapsedTime * 2.2) * 0.06;
      nucleusMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  /* ==========================================================================
     2. AMBIENT DEEP SPACE SYNAPSE CANVAS (Delta-Time Normalized)
     ========================================================================== */
  const bgCanvas = document.getElementById('webgl-bg-canvas');
  if (bgCanvas) {
    initSubtleBg(bgCanvas);
  }

  function initSubtleBg(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 800;
      starPos[i + 1] = (Math.random() - 0.5) * 600;
      starPos[i + 2] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 2.2,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const bgClock = new THREE.Clock();

    function loopBg() {
      requestAnimationFrame(loopBg);
      const bgDelta = Math.min(bgClock.getDelta(), 0.1);
      const bgScale = bgDelta * 60;
      starField.rotation.y += 0.0003 * bgScale;
      renderer.render(scene, camera);
    }
    loopBg();
  }

})();

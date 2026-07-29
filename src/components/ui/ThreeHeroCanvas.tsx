'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeHeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Gold & Emerald Ambient Glow)
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.5); // Deep emerald ambient
    scene.add(ambientLight);

    const mainGoldLight = new THREE.PointLight(0xf59e0b, 4, 30); // Warm gold spotlight
    mainGoldLight.position.set(5, 5, 8);
    scene.add(mainGoldLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 2); // Emerald rim light
    rimLight.position.set(-5, -5, 5);
    scene.add(rimLight);

    const backGlow = new THREE.PointLight(0xfcd34d, 2, 20); // Soft gold backlight
    backGlow.position.set(0, 0, -4);
    scene.add(backGlow);

    // 3. Create 3D Crescent Moon Geometry
    const crescentShape = new THREE.Shape();
    const R_outer = 1.8;
    const R_inner = 1.45;
    const offset_x = 0.55;

    // Outer Arc (Clockwise from top to bottom)
    crescentShape.absarc(0, 0, R_outer, Math.PI * 0.5, Math.PI * 1.5, true);
    // Inner Arc (Counter-clockwise back to top)
    crescentShape.absarc(offset_x, 0, R_inner, Math.PI * 1.4, Math.PI * 0.6, false);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const crescentGeo = new THREE.ExtrudeGeometry(crescentShape, extrudeSettings);
    crescentGeo.center();

    // Metallic Gold Material
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });

    const crescentMesh = new THREE.Mesh(crescentGeo, goldMaterial);
    crescentMesh.position.set(-1.2, 0.2, 0);
    crescentMesh.scale.set(0.95, 0.95, 0.95);

    // 4. Create 3D Star Geometry
    const starShape = new THREE.Shape();
    const numPoints = 5;
    const outerRadius = 0.55;
    const innerRadius = 0.25;

    for (let i = 0; i < numPoints * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / numPoints - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const starGeo = new THREE.ExtrudeGeometry(starShape, starSettings);
    starGeo.center();

    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xb45309,
      emissiveIntensity: 0.3,
    });

    const starMesh = new THREE.Mesh(starGeo, starMaterial);
    starMesh.position.set(1.4, 0.6, 0.5);

    // Group Moon & Star
    const celestialGroup = new THREE.Group();
    celestialGroup.add(crescentMesh);
    celestialGroup.add(starMesh);
    scene.add(celestialGroup);

    // 5. Create Floating 3D Gold Stardust Particles (Option 3)
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      particleScales[i] = Math.random() * 0.08 + 0.02;
      particleSpeeds[i] = Math.random() * 0.008 + 0.003;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Canvas Texture for glowing circular particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(252, 211, 77, 1)');
      gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.8)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particleSystem);

    // 6. Mouse Interaction & Tilt Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / rect.width - 0.5) * 2;
      mouseY = -(y / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Group Floating & Rotation
      celestialGroup.rotation.y = elapsedTime * 0.35 + targetX * 0.4;
      celestialGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1 - targetY * 0.3;
      celestialGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

      // Independent Star Rotation
      starMesh.rotation.z = -elapsedTime * 0.5;
      starMesh.rotation.y = elapsedTime * 0.8;

      // Animate Particles (Floating upwards)
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        positions[i * 3] += Math.sin(elapsedTime + i) * 0.002;

        // Reset particle if out of bounds
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = -6;
          positions[i * 3] = (Math.random() - 0.5) * 18;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulsing Lights
      mainGoldLight.intensity = 3.5 + Math.sin(elapsedTime * 2) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      crescentGeo.dispose();
      goldMaterial.dispose();
      starGeo.dispose();
      starMaterial.dispose();
      particleGeo.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

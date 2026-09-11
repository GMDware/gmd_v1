'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Accessibility: Honor reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsLowPower(true);
      return;
    }

    // 2. Mobile / low-power detection
    const isMobile = window.innerWidth < 768;
    const isLowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    if (isMobile && isLowConcurrency) {
      setIsLowPower(true);
      return;
    }

    // 3. Setup Three.js Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080f, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 12, 38);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
    } catch {
      setIsLowPower(true);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    container.appendChild(renderer.domElement);

    // 4. Construct Architectural Coordinate Grid Plane
    const gridHelper = new THREE.GridHelper(80, 40, 0x0066ff, 0x0a162e);
    gridHelper.position.y = -8;
    scene.add(gridHelper);

    // 5. Construct Interconnected Architectural Compute Nodes
    const nodeCount = isMobile ? 18 : 36;
    const nodes: THREE.Vector3[] = [];
    const nodeGroup = new THREE.Group();

    const nodeGeometry = new THREE.SphereGeometry(0.35, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.2) * 16 - 4,
        (Math.random() - 0.5) * 35
      );
      nodes.push(pos);

      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      mesh.position.copy(pos);
      nodeGroup.add(mesh);
    }
    scene.add(nodeGroup);

    // 6. Construct Conduit Vector Lines between proximate nodes
    const linePositions: number[] = [];
    const maxDistance = isMobile ? 14 : 18;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < maxDistance) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // 7. Mouse Interactivity / Camera Parallax
    let targetX = 0;
    let targetY = 12;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseNormX * 4;
      targetY = 12 + mouseNormY * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Subtle rotation of spatial network
      nodeGroup.rotation.y = elapsedTime * 0.03;
      lines.rotation.y = elapsedTime * 0.03;

      // Pulse grid subtly
      gridHelper.position.z = (elapsedTime * 1.5) % 2;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Geometries & Materials
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      gridHelper.geometry.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (isLowPower) {
    return (
      <div className="absolute inset-0 blueprint-grid opacity-25 pointer-events-none" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};

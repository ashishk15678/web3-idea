"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Create material with custom shader
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.y += sin(pos.x * 2.0 + uTime) * 0.1;
          pos.x += cos(pos.y * 2.0 + uTime) * 0.1;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          vec3 color = mix(
            vec3(0.1, 0.2, 0.3),
            vec3(0.2, 0.3, 0.4),
            sin(uTime + vUv.x * 10.0) * 0.5 + 0.5
          );
          
          gl_FragColor = vec4(color, 0.8 * (1.0 - dist * 2.0));
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Add mouse interaction
    const mouse = new THREE.Vector2();
    const targetMouse = new THREE.Vector2();
    let isHovering = false;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Position camera
    camera.position.z = 3;

    // Animation
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      particlesMaterial.uniforms.uTime.value = elapsedTime;

      // Smooth mouse movement
      targetMouse.x += (mouse.x - targetMouse.x) * 0.05;
      targetMouse.y += (mouse.y - targetMouse.y) * 0.05;

      // Rotate particles based on mouse position
      particlesMesh.rotation.x +=
        (targetMouse.y * 0.5 - particlesMesh.rotation.x) * 0.05;
      particlesMesh.rotation.y +=
        (targetMouse.x * 0.5 - particlesMesh.rotation.y) * 0.05;

      // Add water-like movement when hovering
      if (isHovering) {
        particlesMesh.position.x += Math.sin(elapsedTime * 2) * 0.001;
        particlesMesh.position.y += Math.cos(elapsedTime * 2) * 0.001;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden rounded-[80px]"
      style={{ background: theme === "dark" ? "#000" : "#fafafa" }}
    />
  );
}

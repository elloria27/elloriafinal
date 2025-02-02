import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const Avatar3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 1.5, 2);
    camera.lookAt(0, 1, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Load avatar model
    const loader = new GLTFLoader();
    console.log('Starting to load model...');
    
    loader.load(
      '/models/female-avatar.glb',
      (gltf) => {
        console.log('Model loaded successfully:', gltf);
        modelRef.current = gltf.scene;
        
        // Setup model
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(1, 1, 1);
        scene.add(gltf.scene);

        // Setup animations if they exist
        if (gltf.animations && gltf.animations.length) {
          console.log('Animations found:', gltf.animations.length);
          mixerRef.current = new THREE.AnimationMixer(gltf.scene);
          const action = mixerRef.current.clipAction(gltf.animations[0]);
          action.play();
        }

        // Animation loop
        let lastTime = 0;
        const animate = (time: number) => {
          const delta = (time - lastTime) / 1000;
          lastTime = time;

          if (mixerRef.current) {
            mixerRef.current.update(delta);
          }

          if (modelRef.current) {
            modelRef.current.rotation.y += 0.005;
          }

          controls.update();
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };

        animate(0);
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log('Loading progress:', percentComplete.toFixed(2) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden"
    />
  );
};
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const metrics = [
  {
    category: "Absorption Capacity",
    elloria: 95,
    always: 85,
    kotex: 80,
    color: "#9b87f5",
    icon: "💧"
  },
  {
    category: "Eco-friendliness",
    elloria: 90,
    always: 60,
    kotex: 65,
    color: "#F2FCE2",
    icon: "🌱"
  },
  {
    category: "Comfort and Fit",
    elloria: 98,
    always: 75,
    kotex: 78,
    color: "#D3E4FD",
    icon: "✨"
  },
  {
    category: "Price Value",
    elloria: 85,
    always: 70,
    kotex: 72,
    color: "#D6BCFA",
    icon: "💎"
  }
];

// Helper function to create a 3D bar
const createBar = (
  scene: THREE.Scene,
  position: THREE.Vector3,
  color: string,
  height: number
) => {
  const geometry = new THREE.BoxGeometry(0.3, height, 0.3);
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.8,
    shininess: 100
  });
  const bar = new THREE.Mesh(geometry, material);
  bar.position.copy(position);
  scene.add(bar);
  return bar;
};

export const CompetitorComparison = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create bar groups
    metrics.forEach((metric, index) => {
      const groupOffset = (index - (metrics.length - 1) / 2) * 2;
      
      // Elloria bar
      createBar(
        scene,
        new THREE.Vector3(groupOffset, metric.elloria / 50 - 1, 0),
        metric.color,
        metric.elloria / 50
      );
      
      // Always bar
      createBar(
        scene,
        new THREE.Vector3(groupOffset - 0.4, metric.always / 50 - 1, 0),
        "#8E9196",
        metric.always / 50
      );
      
      // Kotex bar
      createBar(
        scene,
        new THREE.Vector3(groupOffset + 0.4, metric.kotex / 50 - 1, 0),
        "#6E59A5",
        metric.kotex / 50
      );
    });

    // Animation
    let rotationSpeed = 0.001;
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sceneRef.current) {
        sceneRef.current.rotation.y += rotationSpeed;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      
      rotationSpeed = x * 0.001;
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-accent-purple/10 to-white overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
            Why Choose Elloria?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience the difference with our innovative products that set new industry standards
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            ref={containerRef} 
            className="w-full h-[400px] rounded-2xl shadow-xl bg-white/50 backdrop-blur-sm border border-white/20"
          />
          
          <div className="space-y-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.category}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{metric.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{metric.category}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Elloria</span>
                      <span className="text-sm font-medium text-primary">{metric.elloria}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.elloria}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Always</span>
                      <span className="text-sm font-medium text-gray-600">{metric.always}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.always}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: (index * 0.2) + 0.1 }}
                        className="h-full rounded-full bg-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Kotex</span>
                      <span className="text-sm font-medium text-gray-600">{metric.kotex}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.kotex}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: (index * 0.2) + 0.2 }}
                        className="h-full rounded-full bg-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Learn Why Women Choose Elloria
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
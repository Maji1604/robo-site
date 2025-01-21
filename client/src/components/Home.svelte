<script>
    import * as THREE from "three";
    import { onMount } from "svelte";
    import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
    import ellipse from "$lib/images/Ellipse 22.png";
    import hero1 from "$lib/images/Group 3445 (1).png";
    import waves from "$lib/images/pngwing.com (2) 1.png";

    let scene, camera, renderer, mesh;
    let angle = 0; // For controlling rotation and expansion

    onMount(() => {
        const container = document.getElementById("stl-container");
        if (!container) {
            console.error("STL container not found!");
            return;
        }

        // Create scene
        scene = new THREE.Scene();

        // Set up camera
        camera = new THREE.PerspectiveCamera(50, 900 / 900, 0.01, 1000);
        camera.position.set(0, 0, 200); // Adjusted distance

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(900, 900);
        container.appendChild(renderer.domElement);

        // Load STL model
        const loader = new STLLoader();
        loader.load("/output (2).stl", (geometry) => {
            // Compute bounding box to find center of "A" and "I"
            geometry.computeBoundingBox();
            const bbox = geometry.boundingBox;
            const center = new THREE.Vector3();
            bbox.getCenter(center);

            // Offset geometry to center the rotation point
            geometry.translate(-center.x, -center.y, -center.z);

            // Create material and mesh
            const material = new THREE.MeshNormalMaterial();
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            if (mesh) {
                angle += 0.02; // Controls rotation speed

                // Apply rotation to X and Y axis (spherical motion)
                mesh.rotation.y = angle;
                mesh.rotation.x = Math.sin(angle) * 0 + THREE.MathUtils.degToRad(0);

                // Expand & contract effect (illusion of depth)
                const scaleFactor = 0.4 + 0.01 * Math.sin(angle); // Expands on one side
                mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }

            renderer.render(scene, camera);
        };
        animate();
    });
</script>

<section class="h-[100vh] relative bg-gradient-to-r from-[#1A023E] to-[#1E0445]">
    <!-- Waves Image (Fixed at Bottom) -->
    <div class="absolute right-0 bottom-0 w-full">
        <img src={waves} class="w-full" alt="Hero Graphic">
    </div>

    <!-- Ellipse Image -->
    <div class="absolute right-0 top-0">
        <img src={ellipse} class="w-[500px]" alt="Decorative Ellipse">
    </div>

    <!-- Hero Image -->
    <div class="absolute -right-96 top-[50%] transform -translate-y-1/2">
        <img src={hero1} class="w-[1600px]" alt="Hero Graphic">
    </div>

    <!-- 3D Hero2 Model -->
    <div id="stl-container" class="absolute right-[0.5%] top-[44%] transform -translate-y-1/2"></div>

    <div class="px-20  w-[70%] h-full flex flex-col justify-center gap-10 ">
        <h1 class="text-white z-10  text-5xl font-bold tracking-wide leading-loose">
            Empowering Minds, <br />
Transforming Futures with AI Innovation
        </h1>
        <p class="text-white text-xl leading-loose w-[80%]">
            Empowering young minds with cutting edge AI, STEM, Robotics and Electronics education, enabling them to innovate and lead in a technology-driven world.
        </p>
        <button class="p-5 font-medium text-xl z-10 w-fit text-white whitespace-nowrap rounded-full bg-gradient-to-l from-[#6504B0] to-[#C961DE]">
            Unleash Potential
        </button>
    </div>
</section>


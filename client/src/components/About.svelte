
<section id="about" class="about-section">
    <div class="container">
      <div class="about-content">
        <h2 class="about-title">About Us</h2>
        <p class="about-subtitle">
          Empowering young minds with cutting-edge AI, STEM, Robotics, and Electronics education.
        </p>
        <div class="about-grid">
          <div class="about-text">
            <p>
              We are a team of passionate educators and technologists dedicated to fostering innovation and creativity in the next generation. Our mission is to provide students with the tools and knowledge they need to excel in a technology-driven world.
            </p>
            <p>
              Through hands-on learning experiences, we inspire students to explore, experiment, and innovate. Join us in shaping the future of education!
            </p>
            <button class="about-button">Learn More</button>
          </div>
          <div class="about-image">
            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img src="/path/to/about-image.jpg" width="100%" height="100%" alt="About Us Image" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <style>
    .about-section {
      background: linear-gradient(to right, #6504b0, #c961de); /* Gradient from hero section */
      color: white;
      padding: 80px 20px;
    }
  
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
  
    .about-content {
      text-align: center;
    }
  
    .about-title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    }
  
    .about-subtitle {
      font-size: 1.5rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }
  
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }
  
    .about-text {
      text-align: left;
    }
  
    .about-text p {
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 20px;
      opacity: 0.9;
    }
  
    .about-button {
      background: white;
      color: #6504b0;
      border: none;
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 30px;
      cursor: pointer;
      transition: background 0.3s ease, color 0.3s ease;
    }
  
    .about-button:hover {
      background: #f0f0f0;
      color: #c961de;
    }
  
    .about-image img {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    /* Responsive Design */
    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
      }
  
      .about-image {
        order: -1; /* Move image above text on mobile */
      }
  
      .about-title {
        font-size: 2.5rem;
      }
  
      .about-subtitle {
        font-size: 1.2rem;
      }
    }
  </style>
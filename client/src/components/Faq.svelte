<script>
    // Import Iconify component
    import  Icon  from '@iconify/svelte';
  </script>
  
  <style>

  
    .section {
      padding: 4rem 2rem;
      background-color: #f9fafb;
      text-align: center;
    }
  
    .section h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
    }
  
    .section p {
      font-size: 1.1rem;
      color: #64748b;
      max-width: 800px;
      margin: 0 auto 3rem;
    }
  
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
    }
  
    .card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  
    .card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 1rem 0;
    }
  
    .card p {
      font-size: 1rem;
      color: #64748b;
      line-height: 1.6;
    }
  
    .icon {
      font-size: 2.5rem;
      color: rgba(112, 50, 195, 1);
      margin-bottom: 1rem;
    }
  
    @media (max-width: 768px) {
      .section {
        padding: 2rem 1rem;
      }
  
      .section h2 {
        font-size: 2rem;
      }
  
      .section p {
        font-size: 1rem;
      }
  
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
  
  <section class="section font-ubuntu">
    <h2>Why CreoLeap Technologies?</h2>
    <p>
      CreoLeap Technologies empowers the next generation with AI-driven STEM education, robotics, and hands-on learning experiences.
    </p>
  
    <div class="grid">
      <!-- Card 1: AI-Based Robotics Education -->
      <div class="card">
        <div class="icon">
          <Icon icon="carbon:education" width="48" height="48" />
        </div>
        <h3>AI-Based Robotics Education</h3>
        <p>
          Smart robotic kits designed for K-12 students. AI-powered learning integrated with real-world applications. Hands-on experience in automation, coding, and robotics.
        </p>
      </div>
  
      <!-- Card 2: AI-Driven STEM Curriculum -->
      <div class="card">
        <div class="icon">
          <Icon icon="solar:notebook-bookmark-bold-duotone" width="48" height="48" />
        </div>
        <h3>AI-Driven STEM Curriculum</h3>
        <p>
          Customized AI-infused STEM learning programs. Aligned with NEP 2020 and global educational standards. Adaptive learning with AI-based assessments for personalized growth.
        </p>
      </div>
  
      <!-- Card 3: AI-Powered Learning Platform -->
      <div class="card">
        <div class="icon">
          <Icon icon="mdi:laptop" width="48" height="48" />
        </div>
        <h3>AI-Powered Learning Platform</h3>
        <p>
          Interactive online modules for immersive robotics education. Virtual AI simulations in STEM, Robotics, and Electronics.
        </p>
      </div>
  
      <!-- Card 4: AI Training & Workshops -->
      <div class="card">
        <div class="icon">
          <Icon icon="prime:microchip-ai" width="52" height="52" />
        </div>
        <h3>AI Training & Workshops</h3>
        <p>
          AI and robotics boot camps for students and professionals. Faculty training programs to enhance AI literacy. AI readiness initiatives for institutions and educators.
        </p>
      </div>
    </div>
  </section>
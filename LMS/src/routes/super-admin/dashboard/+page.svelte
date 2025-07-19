<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Accordion from '$lib/components/ui/accordion';
  import { writableGlobalStore } from '$lib/stores/global-store';
  import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
  // Reactive state for collapsible sections
  let activeSection = $state('overview');

  // Placeholder data for stats (no API)
  const stats = $state({
    totalSchools: 120,
    totalTeachers: 450,
    totalClients: 3200,
    activeCourses: 85,
  });

  // Placeholder data for recent activity
  const recentActivities = $state([
    { id: 1, action: 'New school added: RoboTech Academy', timestamp: '2025-05-20 10:00 AM' },
    { id: 2, action: 'Teacher registered: Jane Doe', timestamp: '2025-05-20 09:30 AM' },
    { id: 3, action: 'Client enrolled: John Smith', timestamp: '2025-05-19 04:15 PM' },
  ]);

  // Toggle active section
  function setActiveSection(section: string) {
    activeSection = section;
  }
  const schoolsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12, 19, 3, 5, 2, 3],
    label: 'Number of Schools',
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgba(59, 130, 246, 1)',
  };

  const teachersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [120, 150, 130, 170, 140, 160],
    label: 'Number of Teachers',
    backgroundColor: 'rgba(16, 185, 129, 0.5)',
    borderColor: 'rgba(16, 185, 129, 1)',
  };

  let schoolsCanvas: HTMLCanvasElement;
  let teachersCanvas: HTMLCanvasElement;

  onMount(() => {
    // Initialize Charts
    const schoolsCtx = schoolsCanvas.getContext('2d');
    const teachersCtx = teachersCanvas.getContext('2d');

    new Chart(schoolsCtx, {
      type: 'bar',
      data: {
        labels: schoolsData.labels,
        datasets: [{
          label: schoolsData.label,
          data: schoolsData.data,
          backgroundColor: schoolsData.backgroundColor,
          borderColor: schoolsData.borderColor,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(teachersCtx, {
      type: 'line',
      data: {
        labels: teachersData.labels,
        datasets: [{
          label: teachersData.label,
          data: teachersData.data,
          backgroundColor: teachersData.backgroundColor,
          borderColor: teachersData.borderColor,
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
</script>

<div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
  <!-- Assuming sidebar is included via layout or component -->
  <main class="flex-1 p-6">

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Stats Overview -->
      <Card.Root class="col-span-1 lg:col-span-3 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <Card.Header>
          <Card.Title class="text-xl font-semibold text-gray-800">Platform Overview</Card.Title>
          <Card.Description>Key metrics for your robotics learning platform</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-300">
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:school" class="h-6 w-6" />
                <h3 class="text-lg font-semibold">Total Schools</h3>
              </div>
              <p class="text-3xl font-bold mt-2">{stats.totalSchools}</p>
            </div>
            <div class="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-300">
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:account-group" class="h-6 w-6" />
                <h3 class="text-lg font-semibold">Total Teachers</h3>
              </div>
              <p class="text-3xl font-bold mt-2">{stats.totalTeachers}</p>
            </div>
            <div class="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-300">
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:account-multiple" class="h-6 w-6" />
                <h3 class="text-lg font-semibold">Total Clients</h3>
              </div>
              <p class="text-3xl font-bold mt-2">{stats.totalClients}</p>
            </div>
            <div class="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-4 rounded-lg hover:scale-105 transition-transform duration-300">
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:book-open-variant" class="h-6 w-6" />
                <h3 class="text-lg font-semibold">Active Courses</h3>
              </div>
              <p class="text-3xl font-bold mt-2">{stats.activeCourses}</p>
            </div>
          </div>
        </Card.Content>
      </Card.Root>

      <!-- Charts Section -->
      <Card.Root class="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <Card.Header>
          <Card.Title class="text-xl font-semibold text-gray-800">Analytics</Card.Title>
          <Card.Description>Visual insights into platform performance</Card.Description>
        </Card.Header>
        <Card.Content>
          <Accordion.Root>
            <Accordion.Item value="client-growth">
              <Accordion.Trigger class="flex items-center space-x-2">
                <Icon icon="mdi:chart-line" class="h-5 w-5 text-blue-600" />
                <span>Client Growth Trend</span>
              </Accordion.Trigger>
              <Accordion.Content>
                <div class="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <canvas bind:this={schoolsCanvas} id="schoolsChart"></canvas>
                </div>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="school-distribution">
              <Accordion.Trigger class="flex items-center space-x-2">
                <Icon icon="mdi:chart-pie" class="h-5 w-5 text-green-600" />
                <span>School Distribution</span>
              </Accordion.Trigger>
              <Accordion.Content>
                <div class="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <canvas bind:this={teachersCanvas} id="teachersChart"></canvas>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Card.Content>
      </Card.Root>

      <!-- Recent Activity -->
      <Card.Root class="col-span-1 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <Card.Header>
          <Card.Title class="text-xl font-semibold text-gray-800">Recent Activity</Card.Title>
          <Card.Description>Latest updates on the platform</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul class="space-y-4">
            {#each recentActivities as activity}
              <li class="flex items-center space-x-3 border-b border-gray-200 pb-3">
                <Icon icon="mdi:history" class="h-5 w-5 text-blue-500" />
                <div>
                  <p class="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p class="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </li>
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>

      <!-- School Management -->
      <Card.Root class="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <Card.Header>
          <Card.Title class="text-xl font-semibold text-gray-800">School Management</Card.Title>
          <Card.Description>Manage schools on the platform</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
              on:click={() => goto('/super-admin/school-overview')}
            >
              <Icon icon="mdi:school" class="h-5 w-5" />
              <span>View All Schools</span>
            </button>
            <button
              class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2"
              on:click={() => goto('/super-admin/school-overview')}
            >
              <Icon icon="mdi:plus" class="h-5 w-5" />
              <span>Add New School</span>
            </button>
          </div>
        </Card.Content>
      </Card.Root>

      <!-- Teacher Management -->
      <Card.Root class="col-span-1 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <Card.Header>
          <Card.Title class="text-xl font-semibold text-gray-800">Teacher Management</Card.Title>
          <Card.Description>Manage teachers on the platform</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="grid grid-cols-1 gap-4">
            <button
              class="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2"
              on:click={() => goto('/super-admin/admin-management')}
            >
              <Icon icon="mdi:account-group" class="h-5 w-5" />
              <span>View All Teachers</span>
            </button>
            <button
              class="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-300 flex items-center space-x-2"
              on:click={() => goto('/super-admin/admin-management')}
            >
              <Icon icon="mdi:plus" class="h-5 w-5" />
              <span>Add New Teacher</span>
            </button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  </main>
</div>

<style>
  /* Custom animations for card hover */
  .card:hover {
    transform: translateY(-4px);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  /* Gradient background for a futuristic look */
  .bg-gradient-to-br {
    background: linear-gradient(135deg, #f3f4f6, #bfdbfe);
  }

  /* Custom button hover effects */
  button:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }
</style>
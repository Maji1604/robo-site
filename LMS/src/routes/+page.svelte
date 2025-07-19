<script lang="ts">
  import { writableGlobalStore } from '$lib/stores/global-store';
  import { goto } from '$app/navigation';
  import { _axios } from '$lib/_axios';
  import { createMutation } from '@tanstack/svelte-query';
  import { toast } from 'svelte-sonner';
  import { z } from 'zod';
  import Icon from '@iconify/svelte';

  // Schema for form validation
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
  });

  type LoginData = z.infer<typeof schema>;

  // Form state
  let email = '';
  let password = '';
  let passwordShown = false;

  // Function to get cookie value by name
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log('Cookie value:', value); // Log the cookie value for debugging
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  // Login mutation with loading state
  let loginMutation = createMutation({
    mutationFn: (data: LoginData) => _axios.post('/auth/login', data),
    onSuccess({ data }) {
      const role = data.data.user.role;
      const username = data.data.user.username;
      const schoolId = data.data.user.schoolId;

      // Update the global store with role-specific details
      if (role === 'super_admin') {
        writableGlobalStore.update(store => ({
          ...store,
          role: role,
          details: {
            adminName: username,
            // Add any other super admin specific fields here
          }
        }));
      } else if (role === 'admin') {
        writableGlobalStore.update(store => ({
          ...store,
          role: role,
          details: {
            adminName: username,
            schoolId: schoolId,
          }
        }));
      } else if (role === 'teacher') {
        writableGlobalStore.update(store => ({
          ...store,
          role: role,
          details: {
            teacherName: username,
            schoolId: schoolId,
          }
        }));
      }

      localStorage.setItem('token', data.data.token);

      // Redirect based on role
      if (role === 'super_admin') {
        console.log('Redirecting to super admin dashboard'); // Log redirection
        goto('/super-admin/dashboard');
      } else if (role === 'admin') {
        console.log('Redirecting to admin dashboard'); // Log redirection
        goto('/admin/dashboard');
      } else if (role === 'teacher') {
        console.log('Redirecting to teacher dashboard'); // Log redirection
        goto('/teacher/dashboard');
      } else {
        console.log('Redirecting to default dashboard'); // Log redirection
        // Fallback redirect if role is not recognized
        goto('/dashboard');
      }

      toast(data.message, {});
    },
    onError(error, variables, context) {
      console.error('onError', error, variables, context);
      toast('An error occurred during login. Please try again.');
    }
  });

  // Derived loading state
  $: isLoading = $loginMutation.isPending;

  function login(e: Event) {
    e.preventDefault();
    try {
      const data = schema.parse({
        email,
        password
      });
      $loginMutation.mutate(data);
    } catch (error) {
      console.error(error);
      toast('Invalid email or password');
    }
  }
</script>


<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="flex w-full max-w-5xl h-[600px] rounded-2xl shadow-2xl overflow-hidden">
    <!-- Left Side: Logo and Background -->
    <div class="w-1/2 bg-gradient flex items-center justify-center">
      <div class="text-center">
        <img src="/images/Logo.png" alt="Logo" class="w-auto  mx-auto mb-4">
       
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-1/2 bg-white p-8 flex items-center justify-center">
      <div class="w-full max-w-md flex items-center flex-col">
        <h1 class="text-3xl font-bold text-black">Welcome</h1>
        <p class="text-gray-800 mt-2 pb-10">Sign in to access your account</p>
        <form on:submit|preventDefault={login}>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1A0C52] focus:border-[#1A0C52] outline-none"
              placeholder="Enter your email"
              required
            >
          </div>
          <div class="mb-6 relative">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={passwordShown ? 'text' : 'password'}
              id="password"
              bind:value={password}
              class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1A0C52] focus:border-[#1A0C52] outline-none pr-10"
              placeholder="Enter your password"
              required
            >
            <Icon
              onclick={() => { passwordShown = !passwordShown; }}
              icon={!passwordShown ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
              class="absolute right-3 bottom-3 cursor-pointer text-gray-400 hover:text-gray-600 text-xl"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-[#1A0C52] text-white py-2 rounded-lg hover:bg-[#2B1A7A] transition-colors flex items-center justify-center"
          >
            {#if isLoading}
              <Icon icon="mdi:loading" class="animate-spin mr-2" />
              Logging in...
            {:else}
              Login
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .bg-gradient {
    background: linear-gradient(135deg, #1A0C52 0%, #2B1A7A 100%);
  }
</style>

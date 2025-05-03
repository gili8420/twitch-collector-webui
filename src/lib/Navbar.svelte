<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
    import { NavBrand, NavHamburger, Button } from 'flowbite-svelte';
  
    const dispatch = createEventDispatcher();
    const openSubmitModal = () => dispatch('openSubmitModal');
  
    $: current = $page.url.pathname;
    const links = [
      { href: '/recordings', label: 'Recordings' },
      { href: '/streamers',  label: 'Streamers'  },
      { href: '/streams',    label: 'Streams'    },
      { href: '/messages',   label: 'Messages'   },
      { href: '/chatters',   label: 'Chatters'   }
    ];
  </script>
  
  <nav class="bg-gray-50 border-b border-gray-200 px-4 py-2">
    <div class="grid grid-cols-3 items-center">
      <!-- Left cell: Logo + title -->
      <div class="flex items-center">
        <NavBrand class="flex items-center p-0">
          <img src="/images/logo.webp" alt="Logo" class="h-8 w-8 mr-2" />
          <span class="text-xl font-semibold text-gray-800">
            Streamiverse Collector
          </span>
        </NavBrand>
      </div>
  
      <!-- Center cell: nav links -->
      <div class="flex justify-center">
        <ul class="flex space-x-6">
          {#each links as { href, label }}
            <li>
              <a
                href={href}
                class="px-1 py-2 text-gray-700 hover:text-blue-600"
                class:text-blue-600={current === href}
                class:font-semibold={current === href}
              >
                {label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
  
      <!-- Right cell: submit button + mobile toggle -->
      <div class="flex justify-end items-center space-x-2">
        <Button size="sm" color="purple" on:click={openSubmitModal}>
          Submit streamer
        </Button>
        <NavHamburger />
      </div>
    </div>
  </nav>
  
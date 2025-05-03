<script lang="ts">
    import { Toast } from 'flowbite-svelte';
    import { CloseCircleSolid } from 'flowbite-svelte-icons';
  
    /** 
     * SvelteKit passes `status` and `error` (now a string) here.
     */
    export let status: number;
    export let error: string;
  
    let showToast = true;
    const close = () => (showToast = false);
  </script>
  
  {#if showToast}
    <div class="fixed top-4 right-4 z-50">
      <Toast color="red" on:close={close}>
        <svelte:fragment slot="icon">
          <CloseCircleSolid class="w-5 h-5" />
          <span class="sr-only">Error icon</span>
        </svelte:fragment>
        Request failed.
      </Toast>
    </div>
  {/if}
  
  <section class="p-6">
    <h1 class="text-4xl font-bold mb-4">Error {status}</h1>
    <p class="text-lg text-red-700">{error}</p>
  </section>
  
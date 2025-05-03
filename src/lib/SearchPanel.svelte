<script lang="ts">
    import { Select, Input, Button, Toast } from 'flowbite-svelte';
    import { CloseCircleSolid } from 'flowbite-svelte-icons';
  
    export let fields: { value: string; label: string }[] = [];
    export let selectedField!: string;
    export let value: string = '';
    export let pattern: string | undefined = undefined;
    export let placeholder: string = 'Enter…';
    export let onSearch!: () => void;
  
    let showInvalid = false;
  
    function handleClick() {
      if (pattern && !new RegExp(pattern).test(value)) {
        showInvalid = true;
        return;
      }
      onSearch();
    }
  
    function closeToast() {
      showInvalid = false;
    }
  </script>
  
  <div class="flex items-center justify-start space-x-2 mb-4">
    <Select bind:value={selectedField} size="sm" class="w-auto min-w-max">
      {#each fields as f}
        <option value={f.value}>{f.label}</option>
      {/each}
    </Select>
  
    <Input
      size="sm"
      {placeholder}
      bind:value
      class="w-48"
      title={pattern ? 'UUID format required' : undefined}
    />
  
    <Button size="sm" color="alternative" on:click={handleClick}>
      Search
    </Button>
  </div>
  
  {#if showInvalid}
    <div class="fixed top-4 right-4 z-50">
      <Toast color="red" on:close={closeToast}>
        <svelte:fragment slot="icon">
          <CloseCircleSolid class="w-5 h-5" />
          <span class="sr-only">Error icon</span>
        </svelte:fragment>
        Not valid uuid.
      </Toast>
    </div>
  {/if}
  
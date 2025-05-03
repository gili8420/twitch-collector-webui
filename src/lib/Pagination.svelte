<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { PaginationItem } from 'flowbite-svelte';
    import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
    import { getPageWindow } from '$lib/pagination';

    const dispatch = createEventDispatcher<{ pageChange: number }>();

    export let page: number;
    export let totalPages: number;
    export let windowSize = 10;

    $: pages = getPageWindow(page, totalPages, windowSize);

    function goTo(p: number) {
        if (p >= 1 && p <= totalPages) {
            dispatch('pageChange', p);
        }
    }
</script>

<div class="flex justify-center items-center space-x-1 mt-6">
    <PaginationItem class="px-2 py-1" disabled={page===1} on:click={() => goTo(1)}>
        First
    </PaginationItem>
    <PaginationItem class="px-2 py-1 flex items-center" disabled={page===1} on:click={() => goTo(page-1)}>
        <ChevronLeftOutline class="w-4 h-4 mr-1"/>Prev
    </PaginationItem>

    {#each pages as p}
        <PaginationItem
            class="px-3 py-1"
            active={p===page}
            on:click={() => goTo(p as number)}
        >
            {p}
        </PaginationItem>
    {/each}

    <PaginationItem class="px-2 py-1 flex items-center" disabled={page===totalPages} on:click={() => goTo(page+1)}>
        Next<ChevronRightOutline class="w-4 h-4 ml-1"/>
    </PaginationItem>
    <PaginationItem class="px-2 py-1" disabled={page===totalPages} on:click={() => goTo(totalPages)}>
        Last
    </PaginationItem>
</div>

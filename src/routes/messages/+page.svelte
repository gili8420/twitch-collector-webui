<script lang="ts">
  import {
    Table, TableHead, TableHeadCell,
    TableBody, TableBodyRow, TableBodyCell
  } from 'flowbite-svelte';
  import type { Message } from './+page';
  import SearchPanel from '$lib/SearchPanel.svelte';
  import Pagination from '$lib/Pagination.svelte';
  import { page } from '$app/stores';

  export let data: {
    messages: Message[];
    currentPage: number;
    totalPages: number;
  };
  const { messages, currentPage, totalPages } = data;

  const fields = [
    { value: 'message',      label: 'Message'     },
    { value: 'streamer_id',  label: 'Streamer ID' },
    { value: 'stream_id',    label: 'Stream ID'   },
    { value: 'chatter_id',   label: 'Chatter ID'  }
  ];

  let selectedField = fields[0].value;
  let searchValue = '';
  $: {
    const params = $page.url.searchParams;
    if (params.has('message'))     selectedField = 'message';
    else if (params.has('streamer_id')) selectedField = 'streamer_id';
    else if (params.has('stream_id'))   selectedField = 'stream_id';
    else if (params.has('chatter_id'))  selectedField = 'chatter_id';
    searchValue = params.get(selectedField) ?? '';
  }

  function handleSearch() { /* same */ }
  function handlePageChange(e: CustomEvent<number>) { /* same */ }
  function goToFilter(filter: Record<string,string>) { /* same */ }
</script>

<section class="p-6 bg-white rounded-lg shadow">
  <h1 class="text-3xl font-semibold mb-4 text-center">Messages</h1>

  <SearchPanel
    {fields}
    bind:selectedField
    bind:value={searchValue}
    placeholder="Enter…"
    onSearch={handleSearch}
  />

  <div class="overflow-x-auto">
    <Table hoverable striped>
      <TableHead>
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Text</TableHeadCell>
        <TableHeadCell>Streamer</TableHeadCell>
        <TableHeadCell>Stream</TableHeadCell>
        <TableHeadCell>Chatter</TableHeadCell>
        <TableHeadCell>Created</TableHeadCell>
        <TableHeadCell>Recordings</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each messages as m}
          <TableBodyRow>
            <TableBodyCell class="font-mono text-sm">
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ message_id: m.id })}
              >{m.id}</button>
            </TableBodyCell>
            <TableBodyCell>{m.message}</TableBodyCell>
            <TableBodyCell>
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ streamer_id: m.streamer.id })}
              >{m.streamer.login}</button>
            </TableBodyCell>
            <TableBodyCell>
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ stream_id: m.stream.id })}
              >{m.stream.title}</button>
            </TableBodyCell>
            <TableBodyCell>
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ chatter_id: m.chatter.id })}
              >{m.chatter.login}</button>
            </TableBodyCell>
            <TableBodyCell>{new Date(m.created_at).toLocaleString()}</TableBodyCell>
            <TableBodyCell>
              {#if m.recordings.length === 0}
                —
              {:else}
                <div class="flex space-x-2 overflow-x-auto">
                  {#each m.recordings as rec}
                    <button
                      class="p-0 bg-transparent focus:outline-none"
                      on:click={() => goToFilter({ recording_id: rec.id })}
                      aria-label="Recording {rec.id}"
                    >
                      <img src={rec.thumbnail_url} alt="thumb" />
                    </button>
                  {/each}
                </div>
              {/if}
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>

  <Pagination
    page={currentPage}
    totalPages={totalPages}
    on:pageChange={handlePageChange}
  />
</section>

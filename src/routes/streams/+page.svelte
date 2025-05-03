<script lang="ts">
  import {
    Table, TableHead, TableHeadCell,
    TableBody, TableBodyRow, TableBodyCell
  } from 'flowbite-svelte';
  import type { Stream } from './+page';
  import SearchPanel from '$lib/SearchPanel.svelte';
  import Pagination from '$lib/Pagination.svelte';
  import { page } from '$app/stores';

  export let data: {
    streams: Stream[];
    currentPage: number;
    totalPages: number;
  };
  const { streams, currentPage, totalPages } = data;

  const fields = [
    { value: 'streamer_id', label: 'Streamer ID' },
    { value: 'title',       label: 'Title'       },
    { value: 'category',    label: 'Category'    },
    { value: 'language',    label: 'Language'    }
  ];
  const uuidPattern =
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

  let selectedField = fields[0].value;
  let searchValue = '';
  $: {
    const params = $page.url.searchParams;
    if (params.has('streamer_id')) selectedField = 'streamer_id';
    else if (params.has('title'))       selectedField = 'title';
    else if (params.has('category'))    selectedField = 'category';
    else if (params.has('language'))    selectedField = 'language';
    searchValue = params.get(selectedField) ?? '';
  }

  function handleSearch() { /* same as above */ }
  function handlePageChange(e: CustomEvent<number>) { /* same */ }
  function goToFilter(filter: Record<string,string>) { /* same */ }
</script>

<section class="p-6 bg-white rounded-lg shadow">
  <h1 class="text-3xl font-semibold mb-4 text-center">Streams</h1>

  <SearchPanel
    {fields}
    bind:selectedField
    bind:value={searchValue}
    pattern={selectedField === 'streamer_id' ? uuidPattern : undefined}
    placeholder="Enter…"
    onSearch={handleSearch}
  />

  <div class="overflow-x-auto">
    <Table hoverable striped>
      <TableHead>
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Category</TableHeadCell>
        <TableHeadCell>Language</TableHeadCell>
        <TableHeadCell>Started</TableHeadCell>
        <TableHeadCell>Streamer</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each streams as s}
          <TableBodyRow>
            <TableBodyCell class="font-mono text-sm">
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ stream_id: s.id })}
              >{s.id}</button>
            </TableBodyCell>
            <TableBodyCell>{s.title}</TableBodyCell>
            <TableBodyCell>{s.category}</TableBodyCell>
            <TableBodyCell>{s.language}</TableBodyCell>
            <TableBodyCell>{new Date(s.stream_started_at).toLocaleString()}</TableBodyCell>
            <TableBodyCell>
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ streamer_id: s.streamer.id })}
              >{s.streamer.login}</button>
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

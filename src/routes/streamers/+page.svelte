<script lang="ts">
  import {
    Table, TableHead, TableHeadCell,
    TableBody, TableBodyRow, TableBodyCell
  } from 'flowbite-svelte';
  import type { Streamer } from './+page';
  import SearchPanel from '$lib/SearchPanel.svelte';
  import Pagination from '$lib/Pagination.svelte';
  import { page } from '$app/stores';

  export let data: {
    streamers: Streamer[];
    currentPage: number;
    totalPages: number;
  };
  const { streamers, currentPage, totalPages } = data;

  const fields = [
    { value: 'twitch_id', label: 'Twitch ID' },
    { value: 'login',     label: 'Login'     },
    { value: 'name',      label: 'Name'      }
  ];

  let selectedField = fields[0].value;
  let searchValue = '';
  $: {
    const params = $page.url.searchParams;
    if (params.has('twitch_id')) selectedField = 'twitch_id';
    else if (params.has('login')) selectedField = 'login';
    else if (params.has('name'))  selectedField = 'name';
    searchValue = params.get(selectedField) ?? '';
  }

  function handleSearch() { /* same */ }
  function handlePageChange(e: CustomEvent<number>) { /* same */ }
  function goToFilter(filter: Record<string,string>) { /* same */ }
</script>

<section class="p-6 bg-white rounded-lg shadow">
  <h1 class="text-3xl font-semibold mb-4 text-center">Streamers</h1>

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
        <TableHeadCell>Twitch ID</TableHeadCell>
        <TableHeadCell>Login</TableHeadCell>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Created</TableHeadCell>
        <TableHeadCell>Updated</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each streamers as s}
          <TableBodyRow>
            <TableBodyCell class="font-mono text-sm">
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ streamer_id: s.id })}
              >{s.id}</button>
            </TableBodyCell>
            <TableBodyCell>{s.twitch_id}</TableBodyCell>
            <TableBodyCell>
              <button
                class="text-blue-600 hover:underline"
                on:click={() => goToFilter({ login: s.login })}
              >{s.login}</button>
            </TableBodyCell>
            <TableBodyCell>{s.name}</TableBodyCell>
            <TableBodyCell>{new Date(s.created_at).toLocaleDateString()}</TableBodyCell>
            <TableBodyCell>{new Date(s.updated_at).toLocaleDateString()}</TableBodyCell>
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

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
  const KEY_FIELD = 'streamers_lastField';
  const KEY_VALUE = 'streamers_lastValue';

  $: {
      const params = $page.url.searchParams;
      const match = fields.find(f => params.has(f.value));
      if (match) {
          selectedField = match.value;
          searchValue = params.get(match.value)!;
      } else {
          const sf = sessionStorage.getItem(KEY_FIELD);
          if (sf && fields.some(f => f.value === sf)) {
              selectedField = sf;
              searchValue = sessionStorage.getItem(KEY_VALUE) ?? '';
          } else {
              selectedField = fields[0].value;
              searchValue = '';
          }
      }
  }

  function handleSearch() {
      sessionStorage.setItem(KEY_FIELD, selectedField);
      sessionStorage.setItem(KEY_VALUE, searchValue);

      const params = new URLSearchParams();
      params.set('page', '1');
      params.set(selectedField, searchValue);
      window.location.search = params.toString();
  }

  function handlePageChange(e: CustomEvent<number>) {
      const params = new URLSearchParams(location.search);
      params.set('page', String(e.detail));
      window.location.search = params.toString();
  }

  function goToFilter(filter: Record<string, string>) {
      const params = new URLSearchParams();
      params.set('page', '1');
      Object.entries(filter).forEach(([k, v]) => params.set(k, v));
      window.location.search = params.toString();
  }
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

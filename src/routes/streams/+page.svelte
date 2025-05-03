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
  const KEY_FIELD = 'streams_lastField';
  const KEY_VALUE = 'streams_lastValue';

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

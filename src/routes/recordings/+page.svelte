<script lang="ts">
  import {
      Table, TableHead, TableHeadCell,
      TableBody, TableBodyRow, TableBodyCell
  } from 'flowbite-svelte';
  import type { Recording } from './+page';
  import SearchPanel from '$lib/SearchPanel.svelte';
  import Pagination from '$lib/Pagination.svelte';
  import { page } from '$app/stores';

  export let data: {
      recordings: Recording[];
      currentPage: number;
      totalPages: number;
  };
  const { recordings, currentPage, totalPages } = data;

  const fields = [
      { value: 'streamer_id', label: 'Streamer ID' },
      { value: 'stream_id',   label: 'Stream ID'   }
  ];
  const uuidPattern =
      '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

  let selectedField = fields[0].value;
  let searchValue = '';

  // session-storage keys:
  const KEY_FIELD = 'recordings_lastField';
  const KEY_VALUE = 'recordings_lastValue';

  $: {
      const params = $page.url.searchParams;
      // 1) If URL has one of our filters, use that:
      const match = fields.find(f => params.has(f.value));
      if (match) {
          selectedField = match.value;
          searchValue = params.get(match.value)!;
      } else {
          // 2) else, if we stored a previous search, use that
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
      // stash for next time
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
      // stash nothing here (URL will drive selection)
      const params = new URLSearchParams();
      params.set('page', '1');
      Object.entries(filter).forEach(([k, v]) => params.set(k, v));
      window.location.search = params.toString();
  }
</script>

<section class="p-6 bg-white rounded-lg shadow">
  <h1 class="text-3xl font-semibold mb-4 text-center">Recordings</h1>

  <SearchPanel
      {fields}
      bind:selectedField
      bind:value={searchValue}
      pattern={selectedField.endsWith('_id') ? uuidPattern : undefined}
      placeholder="Enter UUID…"
      onSearch={handleSearch}
  />

  <div class="overflow-x-auto">
      <Table hoverable striped>
          <TableHead>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>THUMBNAIL</TableHeadCell>
              <TableHeadCell>READY</TableHeadCell>
              <TableHeadCell>VIEWERS</TableHeadCell>
              <TableHeadCell>CREATED</TableHeadCell>
              <TableHeadCell>VIDEO</TableHeadCell>
              <TableHeadCell>STREAMER</TableHeadCell>
              <TableHeadCell>STREAM</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
              {#each recordings as rec}
                  <TableBodyRow>
                      <TableBodyCell class="font-mono text-sm">
                          <button
                              class="text-blue-600 hover:underline"
                              on:click={() => goToFilter({ recording_id: rec.id })}
                          >{rec.id}</button>
                      </TableBodyCell>
                      <TableBodyCell>
                          <img
                              src={rec.thumbnail_url}
                              alt="thumb"
                              class="h-14 object-cover rounded"
                          />
                      </TableBodyCell>
                      <TableBodyCell>{rec.ready ? '✅' : '❌'}</TableBodyCell>
                      <TableBodyCell>{rec.viewers}</TableBodyCell>
                      <TableBodyCell>{new Date(rec.created_at).toLocaleString()}</TableBodyCell>
                      <TableBodyCell>
                          <a href={rec.video_url} target="_blank" class="text-blue-600 hover:underline">
                              Watch
                          </a>
                      </TableBodyCell>
                      <TableBodyCell>
                          <button
                              class="text-blue-600 hover:underline"
                              on:click={() => goToFilter({ streamer_id: rec.streamer.id })}
                          >{rec.streamer.login}</button>
                      </TableBodyCell>
                      <TableBodyCell>
                          <button
                              class="text-blue-600 hover:underline block mb-1"
                              on:click={() => goToFilter({ stream_id: rec.stream.id })}
                          >{rec.stream.title}</button>
                          <span class="text-sm text-gray-500">
                              {new Date(rec.stream.stream_started_at).toLocaleDateString()}
                          </span>
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

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
      { value: 'message',     label: 'Message'     },
      { value: 'streamer_id', label: 'Streamer ID' },
      { value: 'stream_id',   label: 'Stream ID'   },
      { value: 'chatter_id',  label: 'Chatter ID'  }
  ];
  let selectedField = fields[0].value;
  let searchValue = '';
  const KEY_FIELD = 'messages_lastField';
  const KEY_VALUE = 'messages_lastValue';

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
                      <TableBodyCell>
                          {new Date(m.created_at).toLocaleString()}
                      </TableBodyCell>
                      <TableBodyCell>
                          {#if m.recordings.length === 0}
                              —
                          {:else}
                            <div class="flex flex-nowrap space-x-2 overflow-x-auto">
                              {#each m.recordings as rec}
                                <button
                                  class="p-0 bg-transparent focus:outline-none"
                                  on:click={() => goToFilter({ recording_id: rec.id })}
                                  aria-label="Recording {rec.id}"
                                >
                                  <img
                                    src={rec.thumbnail_url}
                                    alt="thumb"
                                    class="w-16 h-9 object-cover rounded"
                                  />
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

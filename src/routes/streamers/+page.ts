import type { PageLoad } from './$types';
import { error as kitError } from '@sveltejs/kit';
import { buildErrorMessage } from '$lib/buildErrorMessage';

export interface Streamer {
  id: string;
  twitch_id: string;
  login: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
  const currentPage = Number(url.searchParams.get('page') ?? 1);
  const limit = 30;
  const offset = (currentPage - 1) * limit;

  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });
  for (const f of ['twitch_id', 'login', 'name', 'streamer_id']) {
    const v = url.searchParams.get(f);
    if (v) params.set(f, v);
  }

  const res = await fetch(`http://localhost:8080/api/v1/streamers?${params}`);
  const json = await res.json();

  if (!res.ok) {
    throw kitError(res.status, buildErrorMessage(json));
  }

  return {
    streamers: json.streamers as Streamer[],
    currentPage,
    totalPages: Math.ceil(json.total_count / limit)
  };
};

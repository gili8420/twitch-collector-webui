import type { PageLoad } from './$types';
import { error as kitError } from '@sveltejs/kit';
import { buildErrorMessage } from '$lib/buildErrorMessage';

export interface Stream {
  id: string;
  title: string;
  category: string;
  language: string;
  stream_started_at: string;
  streamer: { id: string; login: string };
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
  const sid = url.searchParams.get('streamer_id');
  if (sid) params.set('streamer_id', sid);

  const res = await fetch(`http://localhost:8080/api/v1/streams?${params}`);
  const json = await res.json();

  if (!res.ok) {
    throw kitError(res.status, buildErrorMessage(json));
  }

  return {
    streams: json.streams as Stream[],
    currentPage,
    totalPages: Math.ceil(json.total_count / limit)
  };
};

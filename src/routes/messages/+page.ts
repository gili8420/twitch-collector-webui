import type { PageLoad } from './$types';
import { error as kitError } from '@sveltejs/kit';
import { buildErrorMessage } from '$lib/buildErrorMessage';

export interface Message {
  id: string;
  message: string;
  created_at: string;
  updated_at: string;
  streamer: { id: string; login: string };
  stream: { id: string; title: string };
  chatter: { id: string; login: string };
  recordings: { id: string; thumbnail_url: string }[];
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
  for (const f of ['streamer_id','stream_id','chatter_id','recording_id']) {
    const v = url.searchParams.get(f);
    if (v) params.set(f, v);
  }

  const res = await fetch(`http://localhost:8080/api/v1/messages?${params}`);
  const json = await res.json();

  if (!res.ok) {
    throw kitError(res.status, buildErrorMessage(json));
  }

  return {
    messages: json.messages as Message[],
    currentPage,
    totalPages: Math.ceil(json.total_count / limit)
  };
};

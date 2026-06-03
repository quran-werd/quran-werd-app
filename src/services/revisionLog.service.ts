import {werdApiRequest} from './werdApi';
import {Werd} from './revisionPlan.service';

export type TodayWerd = {
  werd: Werd | null;
  status: 'pending' | 'completed' | 'skipped';
};

export type RevisionLogEntry = {
  _id: string;
  werdId: string;
  status: 'completed' | 'skipped';
  date: string;
};

export const getTodayWerd = () =>
  werdApiRequest<TodayWerd>('/revision-log/today');

export const completeWerd = (werdId: string) =>
  werdApiRequest<RevisionLogEntry>('/revision-log/complete', {
    method: 'POST',
    data: {werdId},
  });

export const skipWerd = (werdId: string) =>
  werdApiRequest<RevisionLogEntry>('/revision-log/skip', {
    method: 'POST',
    data: {werdId},
  });

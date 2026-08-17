import {werdApiRequest} from './werdApi';

export type Werd = {
  _id: string;
  order: number;
  surah: number;
  range: {from: number; to: number};
};

export type CompletedWerd = Werd & {completedAt: string};

export type RevisionPlan = {
  _id: string;
  userId: string;
  dailyCapacity: number;
  incompleteAwrad: Werd[];
  completedAwrad: CompletedWerd[];
};

export const getRevisionPlan = () =>
  werdApiRequest<RevisionPlan>('/revision-plan');

export const generateRevisionPlan = (dailyCapacity: number) =>
  werdApiRequest<RevisionPlan>('/revision-plan/generate', {
    method: 'POST',
    data: {dailyCapacity},
  });

export const updatePlanCapacity = (dailyCapacity: number) =>
  werdApiRequest<RevisionPlan>('/revision-plan/capacity', {
    method: 'PUT',
    data: {dailyCapacity},
  });

export type WerdStatus = 'pending' | 'completed' | 'finished';

export type TodayWerdResponse = {
  werd: Werd | CompletedWerd | null;
  status: WerdStatus;
};

export type CompleteWerdResponse = {
  werd: Werd | CompletedWerd;
  status: 'completed';
  alreadyCompleted: boolean;
};

export const getTodayWerd = () =>
  werdApiRequest<TodayWerdResponse>('/revision-plan/today');

export const completeWerd = (werdId: string) =>
  werdApiRequest<CompleteWerdResponse>('/revision-plan/complete', {
    method: 'POST',
    data: {werdId},
  });

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

export type PlanStatus = 'active' | 'finished' | 'no-plan';

export type CurrentWerdResponse = {
  current: {werd: Werd | CompletedWerd; isCompleted: boolean} | null;
  next: Werd | null;
  planStatus: PlanStatus;
};

export type CompleteWerdResponse = {
  werd: Werd | CompletedWerd;
  status: 'completed';
  alreadyCompleted: boolean;
};

export const getCurrentWerd = () =>
  werdApiRequest<CurrentWerdResponse>('/revision-plan/current');

export const completeWerd = (werdId: string) =>
  werdApiRequest<CompleteWerdResponse>('/revision-plan/complete', {
    method: 'POST',
    data: {werdId},
  });

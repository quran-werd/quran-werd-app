import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {updateCapacity} from '../../../features/RevisionPlan/revisionPlanAction';
import {
  selectRevisionPlan,
  selectRevisionPlanError,
} from '../../../features/RevisionPlan/revisionPlanSlice';
import {toArabicNumerals} from '../../../content';

export type CapacityMode = 'daily' | 'weekly';

export const DEFAULT_CAPACITY = 20;
const DEFAULT_ACTIVE_DAYS = new Set([6, 0, 1, 2, 3]); // Sat, Sun, Mon, Tue, Wed

export function usePlanCapacity() {
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectRevisionPlan);
  const error = useAppSelector(selectRevisionPlanError);

  const [capacity, setCapacity] = useState(String(DEFAULT_CAPACITY));
  const [justSaved, setJustSaved] = useState(false);
  const [mode, setMode] = useState<CapacityMode>('daily');
  const [activeDays, setActiveDays] =
    useState<Set<number>>(DEFAULT_ACTIVE_DAYS);

  useEffect(() => {
    if (plan?.dailyCapacity) {
      setCapacity(String(plan.dailyCapacity));
    }
  }, [plan?.dailyCapacity]);

  const dailyCapacityValue = parseInt(capacity, 10) || 0;
  const displayValue =
    mode === 'daily' ? dailyCapacityValue : dailyCapacityValue * 7;

  const handleCapacityChange = (value: string) => {
    setJustSaved(false);
    if (mode === 'daily') {
      setCapacity(value);
    } else {
      const weekly = parseInt(value, 10) || 0;
      setCapacity(String(Math.max(1, Math.round(weekly / 7))));
    }
  };

  const handleUpdateCapacity = async () => {
    const value = parseInt(capacity, 10);
    if (value > 0) {
      setJustSaved(false);
      try {
        await dispatch(updateCapacity(value)).unwrap();
        setJustSaved(true);
      } catch {
        // error surfaced via selectRevisionPlanError
      }
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'daily' ? 'weekly' : 'daily'));
  };

  const toggleDay = (dayIndex: number) => {
    setActiveDays(prev => {
      const next = new Set(prev);
      if (next.has(dayIndex)) {
        next.delete(dayIndex);
      } else {
        next.add(dayIndex);
      }
      return next.size > 0 ? next : prev;
    });
  };

  const perDayLabel = useMemo(() => {
    const weekly = dailyCapacityValue * 7;
    const perDay = activeDays.size > 0 ? weekly / activeDays.size : weekly;
    const rounded = Math.round(perDay * 2) / 2;
    return toArabicNumerals(rounded);
  }, [dailyCapacityValue, activeDays]);

  return {
    mode,
    toggleMode,
    activeDays,
    toggleDay,
    displayValue,
    justSaved,
    error,
    perDayLabel,
    handleCapacityChange,
    handleUpdateCapacity,
  };
}

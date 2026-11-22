import type {TFunction} from 'i18next';
import {toArabicNumerals} from '../content';

export type CountedNoun = 'verses' | 'surahs' | 'ranges' | 'awrad' | 'days';

type CountForm = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

// Which form of the counted noun Arabic uses after [n] (the CLDR plural
// rules): ٣ آيات, ١١ آية, ١٠٣ آيات, ١٠٠ آية. Done by hand because Hermes
// may lack Intl.PluralRules.
function countForm(n: number): CountForm {
  if (n === 0) {
    return 'zero';
  }
  if (n === 1) {
    return 'one';
  }
  if (n === 2) {
    return 'two';
  }
  const lastTwo = n % 100;
  if (lastTwo >= 3 && lastTwo <= 10) {
    return 'few';
  }
  if (lastTwo >= 11) {
    return 'many';
  }
  return 'other';
}

/**
 * Formats [n] with the right form of [noun], e.g. "آيتان" or "٧ آيات".
 */
export function formatCount(t: TFunction, noun: CountedNoun, n: number) {
  return t(`counts.${noun}.${countForm(n)}`, {n: toArabicNumerals(n)});
}

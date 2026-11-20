import {ViewStyle} from 'react-native';

// Shadow / elevation styles — see docs/design.md §1.5.
// RN shadows need iOS (shadow*) + Android (elevation) pairs; CSS inset
// highlights have no RN equivalent and are omitted.
export const shadows = {
  mushafPage: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
  homeWardCard: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 10,
  } as ViewStyle,
  surahCardExpanded: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 9,
  } as ViewStyle,
  surahCardDefault: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  } as ViewStyle,
  primaryCta: {
    shadowColor: '#C49A3C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  } as ViewStyle,
  saveButton: {
    shadowColor: '#C49A3C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  } as ViewStyle,
  deleteModal: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 24},
    shadowOpacity: 0.6,
    shadowRadius: 60,
    elevation: 16,
  } as ViewStyle,
  notificationToast: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
  mergeNotification: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
  reviewFinishButton: {
    shadowColor: '#C49A3C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  } as ViewStyle,
  toggleThumb: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  todayWerdCard: {
    shadowColor: '#C49A3C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 3,
  } as ViewStyle,
  phoneFrame: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 40},
    shadowOpacity: 0.6,
    shadowRadius: 80,
    elevation: 20,
  } as ViewStyle,
} as const;

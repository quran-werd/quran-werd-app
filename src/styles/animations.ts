// Reanimated Keyframe transitions — see docs/designs/screens/HomeScreen-design.md §7.
import {Keyframe} from 'react-native-reanimated';

export const pillEnter = new Keyframe({
  0: {opacity: 0, transform: [{scale: 0.85}]},
  100: {opacity: 1, transform: [{scale: 1}]},
}).duration(250);

export const pillExit = new Keyframe({
  0: {opacity: 1},
  100: {opacity: 0},
}).duration(250);

export const ctaEnter = new Keyframe({
  0: {opacity: 0, transform: [{translateY: 8}]},
  100: {opacity: 1, transform: [{translateY: 0}]},
}).duration(250);

export const ctaExit = new Keyframe({
  0: {opacity: 1, transform: [{translateY: 0}]},
  100: {opacity: 0, transform: [{translateY: -6}]},
}).duration(250);

export const nextWerdEnter = new Keyframe({
  0: {opacity: 0, transform: [{translateY: 10}]},
  100: {opacity: 1, transform: [{translateY: 0}]},
})
  .duration(300)
  .delay(150);

export const nextWerdExit = new Keyframe({
  0: {opacity: 1, transform: [{translateY: 0}]},
  100: {opacity: 0, transform: [{translateY: -6}]},
}).duration(300);

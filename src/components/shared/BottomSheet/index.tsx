import React from 'react';
import {Modal, Pressable, View, StyleSheet} from 'react-native';
import {BlurView} from 'expo-blur';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import Typography from '../Typography';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Generic bottom sheet primitive — see docs/design.md §2.11.
//
// Uses Modal's own native slide transition rather than a reanimated
// shared-value transform: Reanimated's UI-thread-driven animations don't
// reliably attach to views mounted inside RN's Modal (a separate native
// surface), which left the sheet parked off-screen at its initial value.
export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
          <View style={styles.backdropTint} />
        </BlurView>
      </Pressable>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        {title ? (
          <Typography family="amiriBold" style={styles.title} align="center">
            {title}
          </Typography>
        ) : null}
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.modalBackdropLight,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '72%',
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl2,
    borderTopRightRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});

import React from 'react';
import {Modal, View, Pressable, StyleSheet} from 'react-native';
import {BlurView} from 'expo-blur';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {shadows} from '../../../styles/shadows';
import Typography from '../Typography';

interface DeleteConfirmationModalProps {
  visible: boolean;
  title: string;
  message: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel: string;
  confirmLabel: string;
}

// Centered delete confirmation modal — see docs/design.md §2.12.
export default function DeleteConfirmationModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel,
}: DeleteConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <BlurView intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={[styles.modal, shadows.deleteModal]}>
          <View style={styles.iconCircle}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7"
                stroke={colors.destructive}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M10 11v6M14 11v6"
                stroke={colors.destructive}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <Typography
            variant="subtitle"
            family="amiri"
            weight="bold"
            align="center"
            style={styles.title}>
            {title}
          </Typography>
          <Typography color="muted" align="center" style={styles.message}>
            {message}
          </Typography>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Typography color="muted" weight="semibold" variant="label">
                {cancelLabel}
              </Typography>
            </Pressable>
            <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Typography color="destructive" weight="semibold" variant="label">
                {confirmLabel}
              </Typography>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,14,24,0.78)',
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 300,
    borderRadius: radius.xl,
    padding: 24,
    backgroundColor: colors.elevatedCard,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.2)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(212,24,61,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,24,61,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    lineHeight: 13 * 1.7,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.mutedTintSubtle,
    borderWidth: 1,
    borderColor: colors.mutedBorderMedium,
  },
  confirmButton: {
    backgroundColor: 'rgba(212,24,61,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,24,61,0.25)',
  },
});

import React from 'react';
import {Linking, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import Typography from '../../../components/shared/Typography';
import SettingsCard from './SettingsCard';
import Row from './Row';
import Divider from './Divider';
import {colors} from '../../../styles/colors';
const pkg = require('../../../../package.json');

function ExternalLinkIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path
        d="M9 2h5v5M14 2l-7 7M6 4H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3"
        stroke={colors.mutedForeground}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function AppInfoSection() {
  const {t} = useTranslation();

  return (
    <SettingsCard>
      <Row
        label={t('settings.app.rate')}
        trailing={<ExternalLinkIcon />}
        onPress={() => Linking.openURL('https://play.google.com/store')}
      />
      <Divider />
      <Row
        label={t('settings.app.contact')}
        trailing={<ExternalLinkIcon />}
        onPress={() => Linking.openURL('mailto:support@example.com')}
      />
      <Divider />
      <Row
        label={t('settings.app.versionLabel')}
        trailing={
          <Typography family="cairo" style={styles.versionValue}>
            {pkg.version}
          </Typography>
        }
      />
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  versionValue: {
    fontSize: 13,
    color: 'rgba(138,154,184,0.5)',
  },
});

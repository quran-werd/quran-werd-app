import React from 'react';
import Typography from '../Typography';

interface ScreenTitleProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export default function ScreenTitle({children, align = 'left'}: ScreenTitleProps) {
  return (
    <Typography variant="title" family="amiriBold" align={align}>
      {children}
    </Typography>
  );
}

'use client';
import { styled, Typography } from '@mui/material';

export const SettingsHeading = styled(Typography)(({ theme }) => ({
    margin: '0',
    fontWeight: theme.typography.fontWeightSemiBold,
    fontSize: theme.typography.pxToRem(16),
    textTransform: 'uppercase',
    letterSpacing: '.1rem',
    color: (theme.vars || theme).palette.text.tertiary,
})) as typeof Typography;

export const SettingsSubHeading = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: theme.typography.fontWeightSemiBold,
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'uppercase',
    letterSpacing: '.1rem',
    color: (theme.vars || theme).palette.text.tertiary,
})) as typeof Typography;

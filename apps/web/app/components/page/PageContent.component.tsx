'use client';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

export default function PageContentComponent({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <Box
            // display="flex"
            // justifyContent="space-between"
            // alignItems="center"
            mt={2}
            component={Paper}
            elevation={0}
            sx={{
                px: 2,
                py: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: (theme) => theme.palette.divider,
            }}
        >
            {children}
        </Box>
    );
}

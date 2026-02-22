import React from 'react';
import { Card, Box, Typography, CardContent, List } from '@mui/material';

const ListCard = ({ title, icon: Icon, children }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
        {/*card header*/}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', bgcolor: '#fafafa' }}>
            <Icon color="action" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
                {title}
            </Typography>
        </Box>
        {/*card content(scrollable)*/}
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, maxHeight: 300, overflow: 'auto' }}>
            <List disablePadding>
                {children}
            </List>
        </CardContent>
    </Card>
  );
};

export default ListCard;
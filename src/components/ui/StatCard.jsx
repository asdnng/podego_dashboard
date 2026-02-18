import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const StatCard = ({ title, value, icon, color, textColor, trend }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: '#fff', boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        {/* icon */}
        <Box sx={{ p: 2, borderRadius: '50%', bgcolor: color, mr: 2, display: 'flex', boxShadow: 1 }}>
            {React.cloneElement(icon, { color: textColor })}
        </Box>
        {/* text */}
        <Box>
            <Typography variant="caption" color="textSecondary" textTransform="uppercase" fontWeight="bold">
                {title}
            </Typography>
            <Typography variant="h5" component="div" fontWeight="800" color={textColor}>
                {String(value)}
            </Typography>
            {/* for trend(dau) */}
            {trend && (
                <Typography variant="caption" sx={{ color: textColor, fontWeight: 'bold', mt: 0.5, display: 'block' }}>
                    {trend}
                </Typography>
            )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
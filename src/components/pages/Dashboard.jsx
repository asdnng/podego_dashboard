import { Container, Grid, Typography, CircularProgress, Button, Box, Alert, ListItem, Chip, ListItemText } from '@mui/material';

//api hook
import { useDashboardData } from '../hooks/UseDashboardData';

//data processing logic
import { 
  getDAUInfo, getTotalApiRequests, getAvgErrorRate, getSignupList,
  getCountryList, getFeatureList, getResponseList, getQuoteList
} from '../utils/DataProcessLogic';

//ui
import StatCard from '../ui/StatCard';
import ListCard from '../ui/ListCard';

//icons
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import GroupIcon from '@mui/icons-material/Group';
import HttpIcon from '@mui/icons-material/Http';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PublicIcon from '@mui/icons-material/Public';
import SpeedIcon from '@mui/icons-material/Speed';
import AppsIcon from '@mui/icons-material/Apps';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const Dashboard = ({ token }) => {
  
  const { data, loading, error } = useDashboardData(token);

  //if loading, show spinner
  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>Loading dashboard data...</Typography>
    </Box>
  );

  //use data processing functions to get display-ready info
  const dauInfo = getDAUInfo(data);
  const totalApiRequests = getTotalApiRequests(data);
  const avgErrorRate = getAvgErrorRate(data);
  const signupList = getSignupList(data);
  const countryList = getCountryList(data);
  const featureList = getFeatureList(data);
  const responseList = getResponseList(data);
  const quoteList = getQuoteList(data);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box>
            <Typography variant="h4" component="h1" fontWeight="800" color="primary">
            Podego Admin
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
            Welcome back! Here's your dashboard overview.
            </Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>        

          <StatCard 
            title="System Health" 
            value={data.health?.status || "OK"} 
            icon={HealthAndSafetyIcon}
            color={data.health?.status === 'Down' ? '#ffebee' : '#e8f5e9'}
            textColor={data.health?.status === 'Down' ? 'error' : 'success'}
          />

          <StatCard 
            title="Daily Active Users" 
            value={dauInfo.current.toLocaleString()} 
            icon={GroupIcon}
            color={dauInfo.diff >= 0 ? "#e3f2fd" : "#ffebee"} 
            textColor={dauInfo.diff >= 0 ? "primary" : "error"}
            trend={`${dauInfo.diff >= 0 ? '▲' : '▼'} ${Math.abs(dauInfo.diff)} (${dauInfo.rate}%)`}
          />

          <StatCard 
            title="API Requests (24h)" 
            value={totalApiRequests.toLocaleString()} 
            icon={HttpIcon}
            color="#fff3e0"
            textColor="warning"
          />

          <StatCard 
            title="Avg Error Rate" 
            value={`${avgErrorRate}%`} 
            icon={ErrorOutlineIcon}
            color={avgErrorRate > 5 ? "#ffebee" : "#e8f5e9"}
            textColor={avgErrorRate > 5 ? "error" : "success"}
            trend="Avg across endpoints"
          />

          <ListCard title="New Signups (Last 7 Days)" icon={PersonAddIcon}>
            {signupList.length > 0 ? (
              signupList.map((item, idx) => (
                <ListItem key={idx} divider sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">{item.date}</Typography>
                  <Chip label={`+${item.count} Users`} color="primary" size="small" variant="outlined" />
                </ListItem>
              ))
            ) : (
              <Box p={2}>No data available</Box>
            )}
          </ListCard>

          <ListCard title="Top Users by Country" icon={PublicIcon}>
            {countryList.length > 0 ? (
              countryList.map((item, idx) => (
                <ListItem key={idx} divider sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                  <Chip label={`${item.value.toLocaleString()} Users`} color="primary" variant="outlined" size="small" />
                </ListItem>
              ))
            ) : (
              <Box p={2}>No Data</Box>
            )}
          </ListCard>

          <ListCard title="Feature Usage (%)" icon={AppsIcon}>
            {featureList.map((item, idx) => (
              <ListItem key={idx} divider sx={{ display: 'block' }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#eee', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <Box sx={{ width: `${Math.min(item.value, 100)}%`, bgcolor: 'primary.main', height: '100%' }} />
                </Box>
              </ListItem>
            ))}
          </ListCard>

          <ListCard title="Avg Response Times (ms)" icon={SpeedIcon}>
            {responseList.map((item, idx) => (
              <ListItem key={idx} divider sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </Typography>
                <Chip
                  label={`${item.value} ms`}
                  color={item.value > 500 ? "error" : item.value > 200 ? "warning" : "success"}
                  size="small"
                />
              </ListItem>
            ))}
          </ListCard>

          <ListCard title="Today's Quotes" icon={FormatQuoteIcon}>
            {quoteList.length > 0 ? (
              quoteList.map((item, idx) => (
                <ListItem key={idx} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{item.text}"
                      </Typography>
                    }
                    secondary={`- ${item.author}`}
                  />
                </ListItem>
              ))
            ) : (
              <Box p={2}>No quotes available</Box>
            )}
          </ListCard>

      </Grid>
    </Container>
  );
};

export default Dashboard;
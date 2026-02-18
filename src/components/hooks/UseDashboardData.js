import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const useDashboardData = (token) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  //initialize 
  const [data, setData] = useState({
    health: {},
    quotes: [],
    dailyUsers: {},
    apiRequests: {},
    signups: {},
    errorRate: {},
    featureUsage: {},
    usersByCountry: {},
    responseTimes: {}
  });

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // parallel API calls
        const results = await Promise.allSettled([
          axios.get(`/api/health`), 
          axios.get(`/api/quotes?n=10`, { headers }),
          axios.get(`/api/metrics/daily_active_users`, { headers }),
          axios.get(`/api/metrics/api_requests`, { headers }),
          axios.get(`/api/metrics/new_signups`, { headers }),
          axios.get(`/api/metrics/endpoint_error`, { headers }),
          axios.get(`/api/metrics/feature_usage`, { headers }),
          axios.get(`/api/metrics/country_metrics`, { headers }),
          axios.get(`/api/metrics/response_times`, { headers })
        ]);

        setData({
          health: results[0].status === 'fulfilled' ? results[0].value.data : { status: 'Unknown' },
          quotes: results[1].status === 'fulfilled' ? results[1].value.data : [],
          dailyUsers: results[2].status === 'fulfilled' ? results[2].value.data : {},
          apiRequests: results[3].status === 'fulfilled' ? results[3].value.data : {},
          signups: results[4].status === 'fulfilled' ? results[4].value.data : {},
          errorRate: results[5].status === 'fulfilled' ? results[5].value.data : {},
          featureUsage: results[6].status === 'fulfilled' ? results[6].value.data : {},
          usersByCountry: results[7].status === 'fulfilled' ? results[7].value.data : {},
          responseTimes: results[8].status === 'fulfilled' ? results[8].value.data : {},
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Critical Error:", err);
        setError("Failed to load data. Please try agian later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { data, loading, error };
};
//data_active_users
export const getDAUInfo = (data) => {
  if (!data.dailyUsers?.counts?.length) return { current: 0, diff: 0, rate: 0 };
  
  const counts = data.dailyUsers.counts;
  const current = counts[counts.length - 1];
  const previous = counts[counts.length - 2] || current;
  const diff = current - previous;
  const rate = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : 0;
  
  return { current, diff, rate };
};

//api_requests
export const getTotalApiRequests = (data) => {
  if (!data.apiRequests?.counts) return 0;
  return data.apiRequests.counts.reduce((sum, num) => sum + num, 0);
};

//endpoint_error
export const getAvgErrorRate = (data) => {
  if (!data.errorRate?.counts?.length) return 0;
  const total = data.errorRate.counts.reduce((sum, num) => sum + num, 0);
  return (total / data.errorRate.counts.length).toFixed(2);
};

//new_signups
export const getSignupList = (data) => {
  if (!data.signups?.dates || !data.signups?.counts) return [];

  return data.signups.dates.map((date, idx) => ({
    date: date,
    count: data.signups.counts[idx]
  })).reverse();
};

//country_metrics
export const getCountryList = (data) => {
  if (!data.usersByCountry?.country || !data.usersByCountry?.counts) return [];
  
  const combined = data.usersByCountry.country.map((c, i) => ({
    name: c || "Others",
    value: data.usersByCountry.counts[i]
  }));

  return combined.sort((a, b) => b.value - a.value);
};

//feature_usage
export const getFeatureList = (data) => {
  if (!data.featureUsage?.feature || !data.featureUsage?.fraction) return [];
  
  return data.featureUsage.feature.map((f, i) => ({
    name: f,
    value: (data.featureUsage.fraction[i] * 100).toFixed(1)
  })).sort((a, b) => b.value - a.value);
};

//response_times
export const getResponseList = (data) => {
  if (!data.responseTimes?.endpoint || !data.responseTimes?.response_time) return [];

  return data.responseTimes.endpoint.map((endpointName, idx) => {
    const histogram = data.responseTimes.response_time[idx];
    if (!histogram) return { name: endpointName, value: 0 };

    const bins = histogram.bins_left_edge;
    const counts = histogram.counts; 

    const totalCount = counts.reduce((sum, n) => sum + n, 0);
    const targetIndex = totalCount / 2; // median

    let currentCount = 0;
    let resultValue = 0;

    //finding median value
    for (let i = 0; i < counts.length; i++) {
      currentCount += counts[i];
      if (currentCount >= targetIndex) {
        resultValue = bins[i]; 
        break;
      }
    }

    return {
      name: endpointName,
      value: resultValue
    };
  }).sort((a, b) => a.value - b.value);
};

//quotes
export const getQuoteList = (data) => {
  if (!data.quotes || !Array.isArray(data.quotes)) return [];
  
  return data.quotes.map(q => ({
    text: q.quote ||"no quote",
    author: q.author || "Unknown"
  }));
};
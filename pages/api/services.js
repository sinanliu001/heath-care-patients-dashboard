// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const getAuthToken = () => {
  // In a real application, you would retrieve this token from a secure source
  const username = 'coalition';
  const password = 'skills-test';
  const auth = btoa(`${username}:${password}`);
  return auth;
};

const getPatientData = async (authToken, setPatientsList, setSelectedPatient) => {
  const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    setPatientsList(data);
    setSelectedPatient(data.find(patient => patient.name === 'Jessica Taylor'));
  } else {
    throw new Error('Network response was not ok');
  }
};

export {
  getAuthToken,
  getPatientData,
};

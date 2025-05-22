// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { useAuth } from '../context/AuthContext';

// const RequestAccess = () => {
//   const { token, role, user } = useAuth();
//   const [softwares, setSoftwares] = useState([]);
//   const [selectedSoftware, setSelectedSoftware] = useState('');
//   const [accessType, setAccessType] = useState('');
//   const [reason, setReason] = useState('');
//   const [message, setMessage] = useState('');
//   const [accessLevels, setAccessLevels] = useState([]);
//   const [myRequests, setMyRequests] = useState([]);
//   const [showRequests, setShowRequests] = useState(false);

//   if (role === undefined) return <p>Loading...</p>;
//   if (!role || !['Admin', 'Employee'].includes(role)) return <p>Access denied.</p>;

//   const fetchSoftwares = async () => {
//     try {
//       const res = await api.get('/software');
//       setSoftwares(res.data.software);
//     } catch (error) {
//       setMessage('Error fetching software list');
//     }
//   };

//   const fetchMyRequests = async () => {
//     try {
//       const res = await api.get('/my-requests');
//       const allRequests = res.data.requests;
//       const filtered = role === 'Employee' && user?.email
//         ? allRequests.filter(req => req.user?.email === user.email)
//         : allRequests;

//       setMyRequests(filtered);
//       setShowRequests(true);
//     } catch (error) {
//       setMessage('Error fetching your requests');
//     }
//   };

//   useEffect(() => {
//     fetchSoftwares();
//   }, []);

//   useEffect(() => {
//     if (selectedSoftware) {
//       const software = softwares.find(s => s.id === parseInt(selectedSoftware));
//       setAccessLevels(software ? software.accessLevels : []);
//       setAccessType('');
//     }
//   }, [selectedSoftware, softwares]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedSoftware || !accessType || !reason) {
//       setMessage('Please fill all fields');
//       return;
//     }

//     try {
//       await api.post('/requests', {
//         softwareId: selectedSoftware,
//         accessType,
//         reason,
//       });
//       setMessage('Access request submitted!');
//       setSelectedSoftware('');
//       setAccessType('');
//       setReason('');
//       setAccessLevels([]);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error submitting request');
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       width: '100vw',
//       padding: '20px',
//       boxSizing: 'border-box',
//       backgroundColor: '#f9f9f9',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'flex-start',
//       fontFamily: 'Arial, sans-serif',
//     }}>
//       {/* <h2>Request Access</h2> */}

//       {message && (
//         <p style={{ color: message.includes('submitted') ? 'green' : 'red' }}>
//           {message}
//         </p>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         style={{
//           width: '100%',
//           maxWidth: '600px',
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '8px',
//           boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//           marginBottom: '30px',
//         }}
//       >
//         <h2>Request Access</h2>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Software:</label><br />
//           <select
//             value={selectedSoftware}
//             onChange={e => setSelectedSoftware(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', fontSize: '16px' }}
//           >
//             <option value="">--Select Software--</option>
//             {softwares.map(s => (
//               <option key={s.id} value={s.id}>{s.name}</option>
//             ))}
//           </select>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Access Type:</label><br />
//           <select
//             value={accessType}
//             onChange={e => setAccessType(e.target.value)}
//             required
//             disabled={!accessLevels.length}
//             style={{ width: '100%', padding: '8px', fontSize: '16px' }}
//           >
//             <option value="">--Select Access Type--</option>
//             {accessLevels.map(level => (
//               <option key={level} value={level}>{level}</option>
//             ))}
//           </select>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Reason:</label><br />
//           <textarea
//             value={reason}
//             onChange={e => setReason(e.target.value)}
//             required
//             rows={4}
//             style={{ width: '100%', padding: '8px', fontSize: '16px', resize: 'vertical' }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             padding: '10px 20px',
//             fontSize: '16px',
//             cursor: 'pointer',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//           }}
//         >
//           Submit Request
//         </button>
//       </form>

//       <button
//         onClick={fetchMyRequests}
//         style={{
//           padding: '10px 20px',
//           fontSize: '16px',
//           cursor: 'pointer',
//           marginBottom: '20px',
//           backgroundColor: '#28a745',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           maxWidth: '600px',
//           width: '100%',
//         }}
//       >
//         {showRequests ? 'Refresh All Requests' : 'View All Requests'}
//       </button>

//       {showRequests && myRequests.length > 0 && (
//         <div
//           style={{
//             width: '100%',
//             maxWidth: '900px',
//             overflowX: 'auto',
//             backgroundColor: 'white',
//             padding: '20px',
//             borderRadius: '8px',
//             boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//           }}
//         >
//           <h3>All Previous Requests</h3>
//           <table
//             border="1"
//             cellPadding="5"
//             style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}
//           >
//             <thead style={{ backgroundColor: '#f0f0f0' }}>
//               <tr>
//                 <th>Software</th>
//                 <th>Access Type</th>
//                 <th>Reason</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myRequests.map((req) => (
//                 <tr key={req.id}>
//                   <td>{req.software?.name || 'N/A'}</td>
//                   <td>{req.accessType}</td>
//                   <td>{req.reason}</td>
//                   <td>{req.status || 'Pending'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RequestAccess;



import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RequestAccess = () => {
  const { token, role, user } = useAuth();
  const [softwares, setSoftwares] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [accessType, setAccessType] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  if (role === undefined) return <p>Loading...</p>;
  if (!role || !['Admin', 'Employee'].includes(role)) return <p>Access denied.</p>;

  const fetchSoftwares = async () => {
    try {
      const res = await api.get('/software');
      setSoftwares(res.data.software);
    } catch (error) {
      setMessage('Error fetching software list');
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/my-requests');
      const allRequests = res.data.requests;
      const filtered = role === 'Employee' && user?.email
        ? allRequests.filter(req => req.user?.email === user.email)
        : allRequests;

      setMyRequests(filtered);
      setShowRequests(true);
    } catch (error) {
      setMessage('Error fetching your requests');
    }
  };

  useEffect(() => {
    fetchSoftwares();
  }, []);

  useEffect(() => {
    if (selectedSoftware) {
      const software = softwares.find(s => s.id === parseInt(selectedSoftware));
      setAccessLevels(software ? software.accessLevels : []);
      setAccessType('');
    }
  }, [selectedSoftware, softwares]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSoftware || !accessType || !reason) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      await api.post('/requests', {
        softwareId: selectedSoftware,
        accessType,
        reason,
      });
      setMessage('Access request submitted!');
      setSelectedSoftware('');
      setAccessType('');
      setReason('');
      setAccessLevels([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting request');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      {/* Centered Heading */}
     

      {message && (
        <p
          style={{
            color: message.includes('submitted') ? 'green' : 'red',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '35px 50px',
          borderRadius: '12px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
         <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Request Access
      </h2>
        <div>
          <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#555' }}>
            Software:
          </label>
          <select
            value={selectedSoftware}
            onChange={e => setSelectedSoftware(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => e.target.style.borderColor = '#007bff'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          >
            <option value="">--Select Software--</option>
            {softwares.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#555' }}>
            Access Type:
          </label>
          <select
            value={accessType}
            onChange={e => setAccessType(e.target.value)}
            required
            disabled={!accessLevels.length}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              transition: 'border-color 0.3s',
              backgroundColor: !accessLevels.length ? '#e9ecef' : 'white',
              cursor: !accessLevels.length ? 'not-allowed' : 'pointer',
            }}
            onFocus={e => !accessLevels.length ? e.target.blur() : e.target.style.borderColor = '#007bff'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          >
            <option value="">--Select Access Type--</option>
            {accessLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#555' }}>
            Reason:
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '5px 5px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              resize: 'vertical',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => e.target.style.borderColor = '#007bff'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 0',
            fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: '#5d0076',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#5d0060')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#5d0076')}
        >
          Submit Request
        </button>
      </form>

      <button
        onClick={fetchMyRequests}
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '30px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          fontWeight: '600',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => (e.target.style.backgroundColor = '#1e7e34')}
        onMouseLeave={e => (e.target.style.backgroundColor = '#28a745')}
      >
        {showRequests ? 'Refresh All Requests' : 'View All Requests'}
      </button>

      {showRequests && myRequests.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
            overflowX: 'auto',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            marginBottom: '40px',
          }}
        >
          <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>
            All Previous Requests
          </h3>
          <table
            border="1"
            cellPadding="8"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '15px',
              color: '#444',
            }}
          >
            <thead style={{ backgroundColor: '#f7f7f7' }}>
              <tr>
                <th style={{ padding: '12px' }}>Software</th>
                <th style={{ padding: '12px' }}>Access Type</th>
                <th style={{ padding: '12px' }}>Reason</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{req.software?.name || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{req.accessType}</td>
                  <td style={{ padding: '12px' }}>{req.reason}</td>
                  <td style={{ padding: '12px', fontWeight: '600', color: req.status === 'Approved' ? 'green' : req.status === 'Rejected' ? 'red' : '#555' }}>
                    {req.status || 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestAccess;

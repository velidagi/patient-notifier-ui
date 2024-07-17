import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchParams, setSearchParams] = useState({ name: '', gender: '', minAge: '', maxAge: '' });

  useEffect(() => {
    if (currentView === 'patients') {
      fetchPatients();
    } else if (currentView === 'notifications') {
      fetchNotifications();
    } else if (currentView === 'filteredPatients') {
      fetchFilteredPatients();
    }
  }, [currentView]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('There was an error fetching the patients!', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.post('http://localhost:8080/patients/sendNotifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('There was an error sending notifications!', error);
    }
  };

  const fetchFilteredPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/patients/filtered');
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('There was an error fetching filtered patients!', error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8080/patients/search', {
        params: searchParams
      });
      setPatients(response.data);
    } catch (error) {
      console.error('There was an error searching the patients!', error);
    }
  };

  return (
    <div className="app">
      <h1>Notification System</h1>
      <div className="buttons">
        <button onClick={() => setCurrentView('patients')}>Patient List</button>
        <button onClick={() => setCurrentView('addPatient')}>Add Patient</button>
        <button onClick={() => setCurrentView('notifications')}>Start</button>
        <button onClick={() => setCurrentView('filteredPatients')}>Filtered Patients</button>
      </div>

      {currentView === 'patients' && (
        <div>
          <PatientSearch searchParams={searchParams} onSearchChange={handleSearchChange} onSearch={handleSearch} />
          <PatientList patients={patients} refresh={fetchPatients} />
        </div>
      )}
      {currentView === 'addPatient' && <AddPatient refresh={fetchPatients} onClose={() => setCurrentView('patients')} />}
      {currentView === 'notifications' && <NotificationList notifications={notifications} />}
      {currentView === 'filteredPatients' && <FilteredPatientList filteredPatients={filteredPatients} />}
    </div>
  );
}

function PatientSearch({ searchParams, onSearchChange, onSearch }) {
  return (
    <div className="patient-search">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={searchParams.name}
        onChange={onSearchChange}
        className="search-input"
      />
      <input
        type="number"
        name="minAge"
        placeholder="Min Age"
        value={searchParams.minAge}
        onChange={onSearchChange}
        className="search-input"
      />
      <input
        type="number"
        name="maxAge"
        placeholder="Max Age"
        value={searchParams.maxAge}
        onChange={onSearchChange}
        className="search-input"
      />
      <select name="gender" value={searchParams.gender} onChange={onSearchChange} className="search-input">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <button onClick={onSearch} className="search-button">Search</button>
    </div>
  );
}



function PatientList({ patients, refresh }) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/patients/${id}`);
        refresh(); // refresh the list of patients
      } catch (error) {
        console.error('There was an error deleting the patient!', error);
      }
    }
  };

  return (
    <div>
      <h2>Patient List</h2>
      <div className="patient-list">
        <div className="patient-header">
          <strong>Name</strong>
          <strong>Birth Date</strong>
          <strong>Gender</strong>
          <strong>National ID</strong>
          <strong>Passport Number</strong>
          <strong>Email</strong>
          <strong>Phone Number</strong>
          <strong>Notification Preference</strong>
          <strong>Age</strong>
          <strong>Actions</strong>
        </div>
        {patients.map((patient) => (
          <div key={patient.id} className="patient-item">
            <span>{patient.name}</span>
            <span>{patient.birthDate}</span>
            <span>{patient.gender}</span>
            <span>{patient.nationalId}</span>
            <span>{patient.passportNumber}</span>
            <span>{patient.email}</span>
            <span>{patient.phoneNumber}</span>
            <span>{patient.notificationPreference}</span>
            <span>{patient.age}</span>
            <button 
              className="delete-button"
              onClick={() => handleDelete(patient.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddPatient({ refresh, onClose }) {
  const [newPatient, setNewPatient] = useState({
    name: '',
    birthDate: '',
    gender: '',
    nationalId: '',
    passportNumber: '',
    email: '',
    phoneNumber: '',
    notificationPreference: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/patients', newPatient);
      refresh(); // refresh the patient list
      setNewPatient({
        name: '',
        birthDate: '',
        gender: '',
        nationalId: '',
        passportNumber: '',
        email: '',
        phoneNumber: '',
        notificationPreference: ''
      });
      onClose();
    } catch (error) {
      console.error('There was an error saving the patient!', error);
    }
  };

  return (
    <div>
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newPatient.name}
          onChange={handleChange}
          className="add-input"
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Birth Date"
          value={newPatient.birthDate}
          onChange={handleChange}
          className="add-input"
        />
        <select
          name="gender"
          value={newPatient.gender}
          onChange={handleChange}
          className="add-input"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="nationalId"
          placeholder="National ID"
          value={newPatient.nationalId}
          onChange={handleChange}
          className="add-input"
        />
        <input
          type="text"
          name="passportNumber"
          placeholder="Passport Number"
          value={newPatient.passportNumber}
          onChange={handleChange}
          className="add-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={handleChange}
          className="add-input"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={newPatient.phoneNumber}
          onChange={handleChange}
          className="add-input"
        />
        <select
          name="notificationPreference"
          value={newPatient.notificationPreference}
          onChange={handleChange}
          className="add-input"
        >
          <option value="">Notification Preference</option>
          <option value="SMS">SMS</option>
          <option value="Email">Email</option>
        </select>
        <button type="submit" className="add-button">Add Patient</button>
      </form>
    </div>
  );
}

function NotificationList({ notifications }) {
  return (
    <div>
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <span>{notification.patientName}</span>
            <span>{notification.notificationType}</span>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilteredPatientList({ filteredPatients }) {
  return (
    <div>
      <h2>Filtered Patients</h2>
      <div className="filtered-patient-list">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="filtered-patient-item">
            <span>{patient.name}</span>
            <span>{patient.age}</span>
            <span>{patient.gender}</span>
            <span>{patient.criteria}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

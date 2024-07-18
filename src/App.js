import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.scss';
import { Button, Dialog, FormHelperText , Input, DialogActions, DialogContent, DialogTitle, Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

 // State variables for managing the current view and data
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

  // Function to fetch the list of patients
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
  // Function to fetch the target list of patients
  const fetchFilteredPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/patients/filtered');
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('There was an error fetching filtered patients!', error);
    }
  };
  // Handler for updating search parameters
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  // Function to handle search based on search parameters
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
  // Function to handle deletion of a patient
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/patients/${id}`);
        fetchPatients(); // refresh the list of patients
      } catch (error) {
        console.error('There was an error deleting the patient!', error);
      }
    }
  };
  // Render the main app component
  return (
    <div className="app">
      <Typography variant="h1" gutterBottom>Patient Notifier</Typography>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item>
          <Button variant={currentView === 'patients' ? 'contained' : 'outlined'} onClick={() => setCurrentView('patients')}>Patient List</Button>
        </Grid>
        <Grid item>
          <Button variant={currentView === 'addPatient' ? 'contained' : 'outlined'} onClick={() => setCurrentView('addPatient')}>Add Patient</Button>
        </Grid>
        <Grid item>
          <Button variant={currentView === 'notifications' ? 'contained' : 'outlined'} onClick={() => setCurrentView('notifications')}>Start Sending</Button>
        </Grid>
        <Grid item>
          <Button variant={currentView === 'filteredPatients' ? 'contained' : 'outlined'} onClick={() => setCurrentView('filteredPatients')}>Target Table</Button>
        </Grid>
      </Grid>

      {currentView === 'patients' && (
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <PatientSearch searchParams={searchParams} onSearchChange={handleSearchChange} onSearch={handleSearch} />
          </Grid>
          <Grid item xs={12}>
            <PatientList patients={patients} onDelete={handleDelete} />
          </Grid>
        </Grid>
      )}
      {currentView === 'addPatient' && (
        <Grid container justify="center">
          <Grid item xs={12} md={8} lg={6}>
            <AddPatient refresh={fetchPatients} onClose={() => setCurrentView('patients')} />
          </Grid>
        </Grid>
      )}
      {currentView === 'notifications' && (
        <Grid container justify="center">
          <Grid item xs={12} md={8} lg={6}>
            <NotificationList notifications={notifications} />
          </Grid>
        </Grid>
      )}
      {currentView === 'filteredPatients' && (
        <Grid container justify="center">
          <Grid item xs={12} md={8} lg={6}>
            <FilteredPatientList filteredPatients={filteredPatients} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
// Component for searching patients
function PatientSearch({ searchParams, onSearchChange, onSearch }) {
  return (
    <div className="patient-search">
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            name="name"
            label="Name"
            value={searchParams.name}
            onChange={onSearchChange}
          />
        </Grid>
        <Grid container alignItems="center" spacing={2} className="age-range-container">
      <Grid item>
      </Grid>
      <Grid item>
        <TextField
          name="minAge"
          label="Min Age"
          type="number"
          value={searchParams.minAge}
          onChange={onSearchChange}
          className="age-range-input"
        />
      </Grid>
      <Grid item className="age-range-separator">
        <Typography variant="subtitle1">-</Typography>
      </Grid>
      <Grid item>
        <TextField
          name="maxAge"
          label="Max Age"
          type="number"
          value={searchParams.maxAge}
          onChange={onSearchChange}
          className="age-range-input"
        />
      </Grid>
    </Grid>
        <Grid item>
      <FormControl style={{ minWidth: 200 }}>
        <InputLabel>Select Gender</InputLabel>
        <Select
          name="gender"
          value={searchParams.gender}
          onChange={onSearchChange}
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
    </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={onSearch}>Search</Button>
        </Grid>
      </Grid>
    </div>
  );
}
// Component for displaying the list of patients
function PatientList({ patients, onDelete }) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [updatedPatient, setUpdatedPatient] = useState({
    id: '',
    name: '',
    birthDate: '',
    gender: '',
    nationalId: '',
    passportNumber: '',
    email: '',
    phoneNumber: '',
    notificationPreference: '',
  });
  const [formErrors, setFormErrors] = useState({
    nameError: false,
    birthDateError: false,
    genderError: false,
    notificationPreferenceError: false
    // Add more errors as needed
  });

  const handleUpdateClick = (patient) => {
    setSelectedPatient(patient);
    setUpdatedPatient({
      id: patient.id,
      name: patient.name,
      birthDate: patient.birthDate,
      gender: patient.gender,
      nationalId: patient.nationalId,
      passportNumber: patient.passportNumber,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      notificationPreference: patient.notificationPreference,
    });
    setOpenUpdateDialog(true);
  };
  // Handler for closing the update dialog
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedPatient(null);
    setUpdatedPatient({
      id: '',
      name: '',
      birthDate: '',
      gender: '',
      nationalId: '',
      passportNumber: '',
      email: '',
      phoneNumber: '',
      notificationPreference: '',
    });
    setFormErrors({
      nameError: false,
      birthDateError: false,
      genderError: false,
      notificationPreferenceError: false
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Restrict future dates for birthDate field
    if (name === 'birthDate') {
      const today = new Date();
      const selectedDate = new Date(value);
      
      if (selectedDate > today) {
        console.log('Invalid birth date');
        return;
      }
    }
  
    setUpdatedPatient({
      ...updatedPatient,
      [name]: value,
    });
  
    // Clear error when user starts typing again
    setFormErrors({
      ...formErrors,
      [`${name}Error`]: false
    });
  };
  const handleUpdateSubmit = async () => {
    let hasError = false;
    Object.keys(updatedPatient).forEach(key => {
      if (updatedPatient[key] === '' && key !== 'nationalId' && key !== 'passportNumber' && key !== 'email' && key !== 'phoneNumber') {
        setFormErrors(prevState => ({
          ...prevState,
          [`${key}Error`]: true
        }));
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    try {
      await axios.put(`http://localhost:8080/patients/${updatedPatient.id}`, updatedPatient);
      // Refresh patient list or perform necessary actions after update
      handleCloseUpdateDialog();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };
// Render the list of patients and the update dialog
  return (
    <div>
      <Typography variant="h2" gutterBottom>Patient List</Typography>
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
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleUpdateClick(patient)}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onDelete(patient.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} aria-labelledby="update-patient-dialog">
        <DialogTitle id="update-patient-dialog-title">Update Patient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={updatedPatient.name}
                onChange={handleChange}
                fullWidth
                required
                error={formErrors.nameError}
                helperText={formErrors.nameError && "Name is required"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="birthDate"
                label="Birth Date"
                type="date"
                value={updatedPatient.birthDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                error={formErrors.birthDateError}
                helperText={formErrors.birthDateError && "Birth Date is required"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.genderError}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={updatedPatient.gender}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={formErrors.notificationPreferenceError}>
                <InputLabel>Notification Preference</InputLabel>
                <Select
                  name="notificationPreference"
                  value={updatedPatient.notificationPreference}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">Select Notification Preference</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="SMS">SMS</MenuItem>
                </Select>
                {formErrors.notificationPreferenceError && <FormHelperText error>Notification Preference is required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="nationalId"
                label="National ID"
                value={updatedPatient.nationalId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="passportNumber"
                label="Passport Number"
                value={updatedPatient.passportNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={updatedPatient.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                value={updatedPatient.phoneNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
// Component for adding a new patient
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

  const [errorText, setErrorText] = useState('');
 // Handler for input changes in the add patient form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPatient.email && !newPatient.phoneNumber) {
      setErrorText("Please enter at least one of Email or Phone number");
      return;
    }
    if (!newPatient.nationalId && !newPatient.passportNumber) {
      setErrorText("Please enter at least one of National ID or Passport Number");
      return;
    }
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    if (newPatient.birthDate > today) {
      setErrorText('Birth Date cannot be in the future!');
      return;
    }
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
      <Typography variant="h2" gutterBottom>Add Patient</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              value={newPatient.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="birthDate"
              label="Birth Date"
              type="date"
              value={newPatient.birthDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0], // Maximum allowed date is today
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={newPatient.gender}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="nationalId"
              label="National ID"
              value={newPatient.nationalId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="passportNumber"
              label="Passport Number"
              value={newPatient.passportNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={newPatient.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              value={newPatient.phoneNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Notification Preference</InputLabel>
              <Select
                name="notificationPreference"
                value={newPatient.notificationPreference}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Notification Preference</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="error">
              {errorText}
            </Typography>
            <Button type="submit" variant="contained" color="primary">Add Patient</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
function FilteredPatientList({ filteredPatients }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatientsList, setFilteredPatientsList] = useState(filteredPatients);

  useEffect(() => {
    setFilteredPatientsList(
      filteredPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.birthDate.includes(searchTerm) ||
        patient.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.nationalId.includes(searchTerm) ||
        patient.passportNumber.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber.includes(searchTerm) ||
        patient.notificationPreference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.targetCriteria.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.targetCriteria.targetCriteria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, filteredPatients]);


  return (
    <div className="filtered-patient-list-container">
      <Typography variant="h2">Target Table</Typography>
      <div className="filtered-patient-list">
        <div className="filtered-patient-header">
          <strong>Name</strong>
          <strong>Birth Date</strong>
          <strong>Gender</strong>
          <strong>Email</strong>
          <strong>Phone Number</strong>
          <strong>Notification Preference</strong>
          <strong>Target Criteria</strong>
        </div>
        {filteredPatientsList.map((patient) => (
          <div key={patient.id} className="filtered-patient-item">
            <span>{patient.name}</span>
            <span>{patient.birthDate}</span>
            <span>{patient.gender}</span>
            <span>{patient.email}</span>
            <span>{patient.phoneNumber}</span>
            <span>{patient.notificationPreference}</span>
            <span>{patient.targetCriteria.targetCriteria}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationList({ notifications }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);

  useEffect(() => {
    setFilteredNotifications(
      notifications.filter(notification =>
        notification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.notificationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.phoneNumber.includes(searchTerm) ||
        notification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, notifications]);

  return (
    <div className="notification-list-container">
      <Typography variant="h2">Notifications</Typography>

      <div className="notification-list">
        <div className="notification-header">
          <strong>Name</strong>
          <strong>Gender</strong>
          <strong>Notification Type</strong>
          <strong>Phone Number</strong>
          <strong>Message</strong>
        </div>
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <span>{notification.name}</span>
            <span>{notification.gender}</span>
            <span>{notification.notificationType}</span>
            <span>{notification.phoneNumber}</span>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

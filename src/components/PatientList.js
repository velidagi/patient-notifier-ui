import React from 'react';

const PatientList = ({ patients }) => {
    return (
        <div>
            <h2>Filtrelenmiş Hasta Listesi</h2>
            {patients.length > 0 ? (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.id}>
                            {patient.name} - {patient.gender} - {patient.birthDate} - {patient.notificationPreference}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Hiç hasta bulunamadı.</p>
            )}
        </div>
    );
};

export default PatientList;

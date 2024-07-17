import React, { useState } from 'react';

const FilterForm = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters({
            ...localFilters,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(localFilters);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>İsim:</label>
                <input type="text" name="name" value={localFilters.name} onChange={handleChange} />
            </div>
            <div>
                <label>Minimum Yaş:</label>
                <input type="number" name="minAge" value={localFilters.minAge} onChange={handleChange} />
            </div>
            <div>
                <label>Maksimum Yaş:</label>
                <input type="number" name="maxAge" value={localFilters.maxAge} onChange={handleChange} />
            </div>
            <div>
                <label>Bildirim Tercihi:</label>
                <select name="notificationPreference" value={localFilters.notificationPreference} onChange={handleChange}>
                    <option value="">Tümü</option>
                    <option value="None">None</option>
                    <option value="SMS">SMS</option>
                    <option value="Email">E-posta</option>
                </select>
            </div>
            <button type="submit">Filtrele</button>
        </form>
    );
};

export default FilterForm;

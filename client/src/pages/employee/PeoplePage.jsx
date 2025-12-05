import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PeopleDirectory from '../../components/attendance/PeopleDirectory';
import { API_ENDPOINTS } from '../../utils/api';

const PeoplePage = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const peopleLoadedRef = useRef(false);

  const fetchPeople = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setPeopleLoading(true);
      const { data } = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPeople(data || []);
      if (!selectedPerson && data?.length) {
        setSelectedPerson(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch teammates', error);
    } finally {
      setPeopleLoading(false);
      peopleLoadedRef.current = true;
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (!peopleLoadedRef.current) {
      fetchPeople();
    }
  }, [fetchPeople]);

  const handleBack = () => {
    navigate('/attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PeopleDirectory
          users={people}
          loading={peopleLoading}
          search={peopleSearch}
          setSearch={setPeopleSearch}
          onRefresh={fetchPeople}
          selected={selectedPerson}
          onSelect={setSelectedPerson}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default PeoplePage;


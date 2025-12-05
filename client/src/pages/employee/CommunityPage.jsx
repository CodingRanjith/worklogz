import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommunityHub from '../../components/attendance/CommunityHub';
import { API_ENDPOINTS } from '../../utils/api';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
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
    } catch (error) {
      console.error('Failed to fetch teammates', error);
    } finally {
      setPeopleLoading(false);
      peopleLoadedRef.current = true;
    }
  }, []);

  const fetchCommunityGroups = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await axios.get(API_ENDPOINTS.getCommunityGroups, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommunityGroups(data || []);
      if (!activeGroupId && data?.length) {
        setActiveGroupId(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch community groups', error);
    }
  }, [activeGroupId]);

  useEffect(() => {
    if (!peopleLoadedRef.current) {
      fetchPeople();
    }
  }, [fetchPeople]);

  useEffect(() => {
    if (communityGroups.length === 0) {
      fetchCommunityGroups();
    }
  }, [communityGroups.length, fetchCommunityGroups]);

  const handleBack = () => {
    navigate('/attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <CommunityHub
          users={people}
          onBack={handleBack}
          groups={communityGroups}
          setGroups={setCommunityGroups}
          activeGroupId={activeGroupId}
          setActiveGroupId={setActiveGroupId}
        />
      </div>
    </div>
  );
};

export default CommunityPage;


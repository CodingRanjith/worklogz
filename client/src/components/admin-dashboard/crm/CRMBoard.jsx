import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { FiFilter, FiLayers, FiPlus, FiRefreshCw, FiSearch, FiSettings } from 'react-icons/fi';
import Swal from 'sweetalert2';
import StageColumn from './StageColumn';
import LeadFormModal from './LeadFormModal';
import StageManagerModal from './StageManagerModal';
import {
  fetchCRMStages,
  fetchCRMLeads,
  createCRMLead,
  updateCRMLead,
  deleteCRMLead,
  moveCRMLead,
  createCRMStage,
  updateCRMStage,
  deleteCRMStage,
  reorderCRMStages,
  API_ENDPOINTS,
} from '../../../utils/api';

const CRMBoard = ({ pipelineType = 'course' }) => {
  const [stages, setStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [stageManagerOpen, setStageManagerOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [stageBusyId, setStageBusyId] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [filters, setFilters] = useState({ course: 'all', source: 'all', status: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const token = useMemo(() => localStorage.getItem('token'), []);

  const loadStages = async () => {
    try {
      setStagesLoading(true);
      const data = await fetchCRMStages(pipelineType, token);
      setStages(data);
    } catch (error) {
      console.error('Error loading CRM stages:', error);
      Swal.fire('Error', 'Failed to load stages. Please try again.', 'error');
    } finally {
      setStagesLoading(false);
    }
  };

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await fetchCRMLeads({ pipelineType }, token);
      setLeads(data);
    } catch (error) {
      console.error('Error loading CRM leads:', error);
      Swal.fire('Error', 'Failed to load leads. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(API_ENDPOINTS.getUsers, { headers });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const usersData = data.users || data || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadStages();
    loadLeads();
    loadUsers();
  }, [pipelineType]);

  const uniqueValues = useMemo(() => {
    const courses = new Set();
    const sources = new Set();
    const statuses = new Set();

    leads.forEach(lead => {
      if (lead.course) courses.add(lead.course);
      if (lead.source) sources.add(lead.source);
      if (lead.status) statuses.add(lead.status);
    });

    return {
      courses: Array.from(courses),
      sources: Array.from(sources),
      statuses: Array.from(statuses),
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesCourse = filters.course === 'all' || lead.course === filters.course;
      const matchesSource = filters.source === 'all' || lead.source === filters.source;
      const matchesStatus = filters.status === 'all' || (lead.status || 'new') === filters.status;
      const search = debouncedSearch.trim().toLowerCase();
      const matchesSearch = !search
        || lead.fullName?.toLowerCase().includes(search)
        || lead.phone?.toLowerCase().includes(search)
        || lead.email?.toLowerCase().includes(search);

      return matchesCourse && matchesSource && matchesStatus && matchesSearch;
    });
  }, [leads, filters, debouncedSearch]);

  const leadsByStage = useMemo(() => {
    const map = new Map();
    stages.forEach(stage => {
      map.set(stage._id, []);
    });

    filteredLeads.forEach(lead => {
      const stageId = lead.stage?._id || lead.stage;
      if (!map.has(stageId)) {
        map.set(stageId, []);
      }
      map.get(stageId).push(lead);
    });

    stages.forEach(stage => {
      const list = map.get(stage._id) || [];
      list.sort((a, b) => {
        const posA = typeof a.stagePosition === 'number' ? a.stagePosition : Number.MAX_SAFE_INTEGER;
        const posB = typeof b.stagePosition === 'number' ? b.stagePosition : Number.MAX_SAFE_INTEGER;
        if (posA !== posB) return posA - posB;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      map.set(stage._id, list);
    });

    return map;
  }, [filteredLeads, stages]);

  const openAddLeadModal = (stage) => {
    setActiveStage(stage);
    setEditingLead(null);
    setLeadFormOpen(true);
  };

  const openEditLeadModal = (lead) => {
    setEditingLead(lead);
    setActiveStage(stages.find(stage => (lead.stage?._id || lead.stage) === stage._id) || null);
    setLeadFormOpen(true);
  };

  const closeLeadModal = () => {
    setLeadFormOpen(false);
    setEditingLead(null);
    setActiveStage(null);
  };

  const handleLeadSubmit = async (payload) => {
    try {
      setLeadSubmitting(true);
      if (editingLead) {
        const formatted = { ...payload };
        if (!formatted.stage) {
          formatted.stage = editingLead.stage?._id || editingLead.stage;
        }
        await updateCRMLead(editingLead._id, formatted, token);
        Swal.fire('Updated', 'Lead details were updated successfully.', 'success');
      } else {
        await createCRMLead({ ...payload, stage: payload.stage || activeStage?._id, pipelineType }, token);
        Swal.fire('Created', 'Lead added to the pipeline.', 'success');
      }
      await loadLeads();
      closeLeadModal();
    } catch (error) {
      console.error('Error saving lead:', error);
      Swal.fire('Error', error.message || 'Failed to save lead', 'error');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleLeadDelete = async (lead) => {
    const confirmation = await Swal.fire({
      title: 'Delete lead?',
      text: `Are you sure you want to delete ${lead.fullName}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete',
    });
    if (!confirmation.isConfirmed) return;

    try {
      await deleteCRMLead(lead._id, token);
      setLeads(prev => prev.filter(item => item._id !== lead._id));
      Swal.fire('Deleted', 'Lead removed from CRM.', 'success');
    } catch (error) {
      console.error('Error deleting lead:', error);
      Swal.fire('Error', error.message || 'Failed to delete lead', 'error');
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const previousLeads = leads;

    setLeads(prev => {
      const map = new Map();
      stages.forEach(stage => {
        map.set(stage._id, []);
      });

      prev.forEach(lead => {
        const stageId = lead.stage?._id || lead.stage;
        if (!map.has(stageId)) {
          map.set(stageId, []);
        }
        map.get(stageId).push({ ...lead });
      });

      map.forEach(list => {
        list.sort((a, b) => {
          const posA = typeof a.stagePosition === 'number' ? a.stagePosition : Number.MAX_SAFE_INTEGER;
          const posB = typeof b.stagePosition === 'number' ? b.stagePosition : Number.MAX_SAFE_INTEGER;
          if (posA !== posB) return posA - posB;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });

      const sourceList = map.get(source.droppableId) || [];
      const destList = map.get(destination.droppableId) || [];
      const sourceIndex = sourceList.findIndex(item => item._id === draggableId);
      if (sourceIndex === -1) {
        return prev;
      }
      const [movedLead] = sourceList.splice(sourceIndex, 1);

      const stageObject = stages.find(stage => stage._id === destination.droppableId) || movedLead.stage;

      movedLead.stage = stageObject;
      movedLead.stagePosition = destination.index;

      destList.splice(destination.index, 0, movedLead);

      sourceList.forEach((lead, idx) => {
        lead.stagePosition = idx;
      });
      destList.forEach((lead, idx) => {
        lead.stagePosition = idx;
      });

      const output = [];
      map.forEach(list => {
        list.forEach(lead => {
          const existingIndex = output.findIndex(item => item._id === lead._id);
          if (existingIndex === -1) {
            output.push(lead);
          } else {
            output[existingIndex] = lead;
          }
        });
      });

      return output;
    });

    try {
      await moveCRMLead(draggableId, {
        stageId: destination.droppableId,
        position: destination.index,
      }, token);
    } catch (error) {
      console.error('Move lead failed:', error);
      setLeads(previousLeads);
      Swal.fire('Error', error.message || 'Failed to move lead', 'error');
    }
  };

  const handleStageCreate = async (payload) => {
    try {
      setStageBusyId('new');
      await createCRMStage(payload, token);
      await loadStages();
      Swal.fire('Added', 'Stage created successfully.', 'success');
    } catch (error) {
      console.error('Error creating stage:', error);
      Swal.fire('Error', error.message || 'Failed to create stage', 'error');
    } finally {
      setStageBusyId(null);
    }
  };

  const handleStageUpdate = async (stageId, payload) => {
    try {
      setStageBusyId(stageId);
      await updateCRMStage(stageId, payload, token);
      await loadStages();
    } catch (error) {
      console.error('Error updating stage:', error);
      Swal.fire('Error', error.message || 'Failed to update stage', 'error');
    } finally {
      setStageBusyId(null);
    }
  };

  const handleStageDelete = async (stage) => {
    const confirmation = await Swal.fire({
      title: 'Delete stage?',
      html: `<strong>${stage.name}</strong> will be removed. Make sure no leads are assigned to this stage.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete stage',
    });
    if (!confirmation.isConfirmed) return;

    try {
      setStageBusyId(stage._id);
      await deleteCRMStage(stage._id, token);
      await loadStages();
      await loadLeads();
      Swal.fire('Deleted', 'Stage removed successfully.', 'success');
    } catch (error) {
      console.error('Error deleting stage:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to delete stage', 'error');
    } finally {
      setStageBusyId(null);
    }
  };

  const handleStageReorder = async (payload) => {
    try {
      setStageBusyId('reorder');
      await reorderCRMStages(payload, token);
      await loadStages();
    } catch (error) {
      console.error('Error reordering stages:', error);
      Swal.fire('Error', error.message || 'Failed to reorder stages', 'error');
    } finally {
      setStageBusyId(null);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([loadStages(), loadLeads()]);
    Swal.fire({
      icon: 'success',
      title: 'Board refreshed',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <FiLayers className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {pipelineType === 'course'
                      ? 'Course CRM Pipeline'
                      : pipelineType === 'internship'
                        ? 'Internship CRM Pipeline'
                        : 'IT Projects CRM Pipeline'}
                  </h1>
                  <p className="text-sm text-gray-500">Track leads across every stage and never miss a follow-up.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setStageManagerOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiSettings className="h-4 w-4" />
                Manage Stages
              </button>
              <button
                onClick={() => openAddLeadModal(stages[0])}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                disabled={!stages.length}
              >
                <FiPlus className="h-4 w-4" />
                Add Lead
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiRefreshCw className={loading || stagesLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <FiSearch className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, email"
                className="w-full border-none text-sm focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <FiFilter className="h-4 w-4 text-gray-400" />
              <select
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                className="w-full border-none text-sm focus:outline-none focus:ring-0"
              >
                <option value="all">All Courses</option>
                {uniqueValues.courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <FiFilter className="h-4 w-4 text-gray-400" />
              <select
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                className="w-full border-none text-sm focus:outline-none focus:ring-0"
              >
                <option value="all">All Sources</option>
                {uniqueValues.sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <FiFilter className="h-4 w-4 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border-none text-sm focus:outline-none focus:ring-0"
              >
                <option value="all">All Status</option>
                {uniqueValues.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          {loading || stagesLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex min-w-full gap-4">
                  {stages.map(stage => (
                    <StageColumn
                      key={stage._id}
                      stage={stage}
                      leads={leadsByStage.get(stage._id) || []}
                      onAddLead={openAddLeadModal}
                      onEditLead={openEditLeadModal}
                      onEditStage={() => setStageManagerOpen(true)}
                    />
                  ))}
                  {!stages.length && (
                    <div className="flex h-64 w-full items-center justify-center text-sm text-gray-500">
                      No stages available. Use "Manage Stages" to set up your pipeline.
                    </div>
                  )}
                </div>
              </DragDropContext>
            </div>
          )}
        </section>
      </div>

      <LeadFormModal
        isOpen={leadFormOpen}
        onClose={closeLeadModal}
        onSubmit={handleLeadSubmit}
        stages={stages}
        pipelineType={pipelineType}
        initialData={editingLead || (activeStage ? { stage: activeStage._id } : null)}
        loading={leadSubmitting}
        users={users}
        usersLoading={usersLoading}
      />

      <StageManagerModal
        isOpen={stageManagerOpen}
        onClose={() => setStageManagerOpen(false)}
        stages={stages}
        pipelineType={pipelineType}
        onCreateStage={handleStageCreate}
        onUpdateStage={handleStageUpdate}
        onDeleteStage={handleStageDelete}
        onReorderStages={handleStageReorder}
        busyStageId={stageBusyId}
      />
    </div>
  );
};

export default CRMBoard;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Divider,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PersonAdd,
  PersonRemove,
  Group,
  Person,
  Search,
  Close
} from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../utils/api';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getTeams, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      Swal.fire('Error', 'Failed to fetch teams', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both array and object response formats
      const employeesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.users || response.data || []);
      console.log('Fetched employees:', employeesData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      console.error('Error response:', error.response?.data);
      Swal.fire('Error', 'Failed to fetch employees', 'error');
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Swal.fire('Error', 'Team name is required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.createTeam,
        {
          name: teamName,
          description: teamDescription,
          teamLead: teamLead || null,
          members: selectedMembers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire('Success', 'Team created successfully', 'success');
      setOpenDialog(false);
      resetForm();
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to create team', 'error');
    }
  };

  const handleUpdateTeam = async () => {
    if (!teamName.trim()) {
      Swal.fire('Error', 'Team name is required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.updateTeam(selectedTeam._id),
        {
          name: teamName,
          description: teamDescription,
          teamLead: teamLead || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire('Success', 'Team updated successfully', 'success');
      setOpenDialog(false);
      resetForm();
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to update team', 'error');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the team and all its data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(API_ENDPOINTS.deleteTeam(teamId), {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire('Deleted!', 'Team has been deleted', 'success');
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        Swal.fire('Error', 'Failed to delete team', 'error');
      }
    }
  };

  const handleAddMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        API_ENDPOINTS.addTeamMembers(selectedTeam._id),
        { members: selectedMembers },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire('Success', 'Members added successfully', 'success');
      setOpenMemberDialog(false);
      setSelectedMembers([]);
      fetchTeams();
    } catch (error) {
      console.error('Error adding members:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to add members', 'error');
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    const result = await Swal.fire({
      title: 'Remove Member?',
      text: 'Are you sure you want to remove this member from the team?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(API_ENDPOINTS.removeTeamMember(teamId, memberId), {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire('Removed!', 'Member has been removed from team', 'success');
        fetchTeams();
      } catch (error) {
        console.error('Error removing member:', error);
        Swal.fire('Error', 'Failed to remove member', 'error');
      }
    }
  };

  const openEditDialog = (team) => {
    setSelectedTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description || '');
    setTeamLead(team.teamLead?._id || '');
    setOpenDialog(true);
  };

  const openAddMembersDialog = (team) => {
    setSelectedTeam(team);
    const teamMemberIds = team.members?.map(m => m._id) || [];
    const available = employees.filter(emp => !teamMemberIds.includes(emp._id));
    setAvailableMembers(available);
    setSelectedMembers([]);
    setOpenMemberDialog(true);
  };

  const resetForm = () => {
    setTeamName('');
    setTeamDescription('');
    setTeamLead('');
    setSelectedTeam(null);
    setSelectedMembers([]);
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Create Team
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {filteredTeams.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Group color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {team.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog(team)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTeam(team._id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {team.description && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {team.description}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    Team Lead
                  </Typography>
                  {team.teamLead ? (
                    <Chip
                      avatar={<Avatar>{(team.teamLead.name || team.teamLead.firstName || 'U')?.[0]?.toUpperCase()}</Avatar>}
                      label={team.teamLead.name || `${team.teamLead.firstName || ''} ${team.teamLead.lastName || ''}`.trim()}
                      size="small"
                      color="primary"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No team lead assigned
                    </Typography>
                  )}
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Members ({team.members?.length || 0})
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<PersonAdd />}
                      onClick={() => openAddMembersDialog(team)}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {team.members?.slice(0, 3).map((member) => (
                      <Chip
                        key={member._id}
                        avatar={<Avatar>{(member.name || member.firstName || 'U')?.[0]?.toUpperCase()}</Avatar>}
                        label={member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
                        size="small"
                        onDelete={() => handleRemoveMember(team._id, member._id)}
                      />
                    ))}
                    {team.members?.length > 3 && (
                      <Chip
                        label={`+${team.members.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTeams.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No teams found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {searchQuery ? 'Try adjusting your search' : 'Create your first team to get started'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
            >
              Create Team
            </Button>
          )}
        </Paper>
      )}

      {/* Create/Edit Team Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTeam ? 'Edit Team' : 'Create New Team'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Team Lead</InputLabel>
              <Select
                value={teamLead}
                onChange={(e) => setTeamLead(e.target.value)}
                label="Team Lead"
              >
                <MenuItem value="">None</MenuItem>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <MenuItem key={emp._id || emp.id} value={emp._id || emp.id}>
                      {emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim()}
                      {emp.email ? ` (${emp.email})` : ''}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No employees available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={selectedTeam ? handleUpdateTeam : handleCreateTeam}
            variant="contained"
          >
            {selectedTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Members Dialog */}
      <Dialog open={openMemberDialog} onClose={() => setOpenMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Members to {selectedTeam?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Members</InputLabel>
              <Select
                multiple
                value={selectedMembers}
                onChange={(e) => setSelectedMembers(e.target.value)}
                label="Select Members"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const emp = employees.find(e => e._id === value);
                      return (
                        <Chip
                          key={value}
                          label={emp ? (emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim()) : value}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableMembers.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim()} ({emp.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {availableMembers.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                All employees are already members of this team
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddMembers}
            variant="contained"
            disabled={selectedMembers.length === 0}
          >
            Add Members
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;


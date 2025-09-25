import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  Box, Container, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, Button, Chip, Avatar, LinearProgress,
  Collapse, IconButton, Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircleOutline as ApprovedIcon,
  CancelOutlined as RejectedIcon,
  PendingOutlined as PendingIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
      },
    },
  },
});

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'Approved' && {
    
    color: theme.palette.success.dark,
  }),
  ...(status === 'Rejected' && {
    
    color: theme.palette.error.dark,
  }),
  ...(status === 'Pending' && {
    
    color: theme.palette.warning.dark,
  }),
}));

const MonthHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[1],
}));

const LeaveDetailRow = ({ label, value, icon: Icon }) => (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
    <Grid item xs={4} sm={3} md={2}>
      <Box display="flex" alignItems="center">
        {Icon && <Icon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={8} sm={9} md={10}>
      <Typography variant="body2">{value}</Typography>
    </Grid>
  </Grid>
);

const LeaveRequestsAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.getAllLeaves, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave requests', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(API_ENDPOINTS.updateLeaveStatus(id), { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Error updating leave status', err);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const groupedRequests = leaveRequests.reduce((acc, req) => {
    const month = dayjs(req.fromDate).format('YYYY-MM');
    if (!acc[month]) acc[month] = [];
    acc[month].push(req);
    return acc;
  }, {});

  const sortedMonths = Object.keys(groupedRequests).sort((a, b) => b.localeCompare(a));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <ApprovedIcon fontSize="small" />;
      case 'Rejected': return <RejectedIcon fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h6"
          component="h6"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 4,
          }}
        >
          Leave Requests Management
        </Typography>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {sortedMonths.length === 0 && !loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography variant="h6" color="textSecondary">
              No leave requests found
            </Typography>
          </Box>
        )}

        {sortedMonths.map((month) => (
          <Box key={month} mb={6}>
            <MonthHeader>
              <CalendarIcon sx={{ mr: 1 }} />
              <Typography sx={{ fontWeight: 600 }}>
                {dayjs(month + '-01').format('MMMM YYYY')}
              </Typography>
            </MonthHeader>

            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.light' }}>
                    
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Leave Period</TableCell>
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Actions</TableCell>
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600, width: '40px' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedRequests[month].map(req => {
                    const from = dayjs(req.fromDate);
                    const to = dayjs(req.toDate);
                    const noOfDays = to.diff(from, 'day') + 1;
                    const isExpanded = expandedRows[req._id];

                    return (
                      <React.Fragment key={req._id}>
                        <StyledTableRow>
                          
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              
                              <Box>
                                <Typography fontWeight={600}>{req.user?.name || 'N/A'}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {req.leaveType}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {from.format('DD MMM YYYY')} - {to.format('DD MMM YYYY')}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {noOfDays} day{noOfDays > 1 ? 's' : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusChip
                              icon={getStatusIcon(req.status)}
                              label={req.status}
                              status={req.status}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {req.status === 'Pending' ? (
                              <Box display="flex" gap={1}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                  onClick={() => updateStatus(req._id, 'Approved')}
                                  startIcon={<ApprovedIcon />}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => updateStatus(req._id, 'Rejected')}
                                  startIcon={<RejectedIcon />}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Reject
                                </Button>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No actions available
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleRowExpand(req._id)}
                            >
                              {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                            </IconButton>
                          </TableCell>
                        </StyledTableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Leave Details
                                      </Typography>
                                      <LeaveDetailRow 
                                        label="Applied On" 
                                        value={dayjs(req.createdAt).format('DD MMM YYYY hh:mm A')} 
                                        icon={CalendarIcon} 
                                      />
                                      <LeaveDetailRow 
                                      sx={{marginTop: 5}}
                                        label="Reason : " 
                                        value={req.reason} 
                                      />
                                      
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Status History
                                      </Typography>
                                      <LeaveDetailRow 
                                        label="Current Status" 
                                        value={req.status} 
                                      />
                                      <LeaveDetailRow 
                                        label="Last Updated" 
                                        value={dayjs(req.updatedAt).format('DD MMM YYYY hh:mm A')} 
                                      />
                                      {req.statusNotes && (
                                        <LeaveDetailRow 
                                          label="Admin Notes" 
                                          value={req.statusNotes} 
                                        />
                                      )}
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>

                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        ))}
      </Container>
    </ThemeProvider>
  );
};

export default LeaveRequestsAdmin;
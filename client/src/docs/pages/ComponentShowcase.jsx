import React, { useState } from 'react';
import DocsLayout from './DocsLayout';
import CodeBlock from '../components/CodeBlock';
import FeatureCard from '../components/FeatureCard';
import './ComponentShowcase.css';

// Importing actual components from the codebase
import AttendanceCards from '../../components/attendance/AttendanceCards';
import ProfileHeader from '../../components/attendance/ProfileHeader';
import DateStrip from '../../components/attendance/DateStrip';
import TodayAttendance from '../../components/attendance/TodayAttendance';
import WeeklyHours from '../../components/attendance/WeeklyHours';
import DailyEarningsCard from '../../components/attendance/DailyEarningsCard';
import ActivityLog from '../../components/attendance/ActivityLog';
import ActionButton from '../../components/attendance/ActionButton';
import QuickAccessCard from '../../components/employee/QuickAccessCard';
import EmployeeNavigation from '../../components/employee/EmployeeNavigation';
import { 
  FiHome, FiUsers, FiCalendar, FiBarChart2, FiSettings, FiLogOut,
  FiFileText, FiDollarSign, FiCamera, FiChevronRight, FiChevronDown, FiClipboard, FiBriefcase,
  FiMenu, FiChevronLeft, FiLayers, FiHelpCircle, FiPackage, FiTrendingUp,
  FiClock, FiTarget, FiAward, FiMail, FiFolder, FiGrid, FiCode, FiZap,
  FiShield, FiGlobe, FiStar, FiCheck, FiX, FiEdit, FiTrash, FiPlus,
  FiSearch, FiFilter, FiDownload, FiUpload, FiEye, FiLock, FiUnlock,
  FiBell, FiMessageCircle, FiShare2, FiHeart, FiBookmark, FiTag,
  FiAlertCircle, FiInfo, FiAlertTriangle, FiCheckCircle, FiXCircle, FiUser, FiType,
  FiMinus, FiList, FiBox, FiImage, FiLink, FiNavigation, FiRadio, FiToggleLeft, FiSliders, FiLoader
} from 'react-icons/fi';
import { 
  Box, Button, Card, CardContent, CardActions, TextField, 
  Select, MenuItem, FormControl, InputLabel, Checkbox, 
  Radio, RadioGroup, FormControlLabel, Switch, Slider,
  Chip, Badge, Avatar, Typography, Divider, Paper,
  Tabs, Tab, Accordion, AccordionSummary, AccordionDetails,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, LinearProgress, CircularProgress,
  Tooltip, IconButton, Fab, Stepper, Step, StepLabel,
  Breadcrumbs, Link, List, ListItem, ListItemText,
  ListItemIcon, ListItemButton, Drawer, AppBar, Toolbar,
  Grid, Container, Stack, AlertTitle
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const ComponentShowcase = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(30);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState('panel1');

  const components = [
    { name: 'Button', category: 'Actions', icon: <FiZap /> },
    { name: 'Card', category: 'Layout', icon: <FiGrid /> },
    { name: 'TextField', category: 'Forms', icon: <FiEdit /> },
    { name: 'Select', category: 'Forms', icon: <FiChevronDown /> },
    { name: 'Checkbox', category: 'Forms', icon: <FiCheck /> },
    { name: 'Radio', category: 'Forms', icon: <FiRadio /> },
    { name: 'Switch', category: 'Forms', icon: <FiToggleLeft /> },
    { name: 'Slider', category: 'Forms', icon: <FiSliders /> },
    { name: 'Chip', category: 'Display', icon: <FiTag /> },
    { name: 'Badge', category: 'Display', icon: <FiBell /> },
    { name: 'Avatar', category: 'Display', icon: <FiUser /> },
    { name: 'Typography', category: 'Typography', icon: <FiType /> },
    { name: 'Divider', category: 'Layout', icon: <FiMinus /> },
    { name: 'Paper', category: 'Layout', icon: <FiFileText /> },
    { name: 'Tabs', category: 'Navigation', icon: <FiLayers /> },
    { name: 'Accordion', category: 'Layout', icon: <FiChevronDown /> },
    { name: 'Dialog', category: 'Overlay', icon: <FiMessageCircle /> },
    { name: 'Snackbar', category: 'Feedback', icon: <FiBell /> },
    { name: 'Alert', category: 'Feedback', icon: <FiAlertCircle /> },
    { name: 'Progress', category: 'Feedback', icon: <FiLoader /> },
    { name: 'Tooltip', category: 'Overlay', icon: <FiInfo /> },
    { name: 'Fab', category: 'Actions', icon: <FiPlus /> },
    { name: 'Stepper', category: 'Navigation', icon: <FiList /> },
    { name: 'Breadcrumbs', category: 'Navigation', icon: <FiChevronRight /> },
    { name: 'List', category: 'Display', icon: <FiList /> },
    { name: 'Drawer', category: 'Navigation', icon: <FiMenu /> },
    { name: 'AppBar', category: 'Layout', icon: <FiMenu /> },
    { name: 'Grid', category: 'Layout', icon: <FiGrid /> },
    { name: 'Container', category: 'Layout', icon: <FiBox /> },
    { name: 'Stack', category: 'Layout', icon: <FiLayers /> },
    { name: 'IconButton', category: 'Actions', icon: <FiZap /> },
    { name: 'FormControl', category: 'Forms', icon: <FiEdit /> },
    { name: 'InputLabel', category: 'Forms', icon: <FiTag /> },
    { name: 'MenuItem', category: 'Forms', icon: <FiList /> },
    { name: 'CardContent', category: 'Layout', icon: <FiFileText /> },
    { name: 'CardActions', category: 'Layout', icon: <FiZap /> },
    { name: 'Tab', category: 'Navigation', icon: <FiLayers /> },
    { name: 'AccordionSummary', category: 'Layout', icon: <FiChevronDown /> },
    { name: 'AccordionDetails', category: 'Layout', icon: <FiFileText /> },
    { name: 'DialogTitle', category: 'Overlay', icon: <FiMessageCircle /> },
    { name: 'DialogContent', category: 'Overlay', icon: <FiFileText /> },
    { name: 'DialogActions', category: 'Overlay', icon: <FiZap /> },
    { name: 'AlertTitle', category: 'Feedback', icon: <FiAlertCircle /> },
    { name: 'Step', category: 'Navigation', icon: <FiList /> },
    { name: 'StepLabel', category: 'Navigation', icon: <FiTag /> },
    { name: 'ListItem', category: 'Display', icon: <FiList /> },
    { name: 'ListItemText', category: 'Display', icon: <FiFileText /> },
    { name: 'ListItemIcon', category: 'Display', icon: <FiImage /> },
    { name: 'ListItemButton', category: 'Actions', icon: <FiZap /> },
    { name: 'Toolbar', category: 'Layout', icon: <FiMenu /> },
    { name: 'Link', category: 'Navigation', icon: <FiLink /> },
    { name: 'Box', category: 'Layout', icon: <FiBox /> },
    { name: 'AttendanceCards', category: 'Custom', icon: <FiCalendar /> },
    { name: 'ProfileHeader', category: 'Custom', icon: <FiUser /> },
    { name: 'DateStrip', category: 'Custom', icon: <FiCalendar /> },
    { name: 'TodayAttendance', category: 'Custom', icon: <FiClock /> },
    { name: 'WeeklyHours', category: 'Custom', icon: <FiBarChart2 /> },
    { name: 'DailyEarningsCard', category: 'Custom', icon: <FiDollarSign /> },
    { name: 'ActivityLog', category: 'Custom', icon: <FiFileText /> },
    { name: 'ActionButton', category: 'Custom', icon: <FiZap /> },
    { name: 'QuickAccessCard', category: 'Custom', icon: <FiGrid /> },
    { name: 'EmployeeNavigation', category: 'Custom', icon: <FiNavigation /> },
  ];

  return (
    <DocsLayout>
      <div className="component-showcase">
        <h1>Component Showcase</h1>
        <p className="intro-subtitle">
          Explore all 60+ components available in Worklogz. This comprehensive showcase 
          demonstrates every UI component, form element, layout component, and custom 
          component used throughout the platform.
        </p>

        <div className="showcase-stats">
          <FeatureCard icon="📦" title="60+ Components" description="Comprehensive component library" />
          <FeatureCard icon="🎨" title="Material-UI" description="Built on Material Design" />
          <FeatureCard icon="⚡" title="Custom Components" description="Worklogz-specific components" />
          <FeatureCard icon="🔧" title="Fully Customizable" description="Easy to theme and modify" />
        </div>

        <h2 id="actions">Action Components ⚡</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Buttons</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button variant="contained" color="secondary">Secondary</Button>
                <Button variant="contained" color="success">Success</Button>
                <Button variant="contained" color="error">Error</Button>
                <Button variant="contained" disabled>Disabled</Button>
                <Button variant="contained" startIcon={<FiPlus />}>With Icon</Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Icon Buttons</Typography>
              <Stack direction="row" spacing={2}>
                <IconButton color="primary"><FiEdit /></IconButton>
                <IconButton color="secondary"><FiTrash /></IconButton>
                <IconButton color="success"><FiCheck /></IconButton>
                <IconButton color="error"><FiX /></IconButton>
                <IconButton disabled><FiLock /></IconButton>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Floating Action Button</Typography>
              <Fab color="primary" aria-label="add"><FiPlus /></Fab>
              <Fab color="secondary" sx={{ ml: 2 }}><FiEdit /></Fab>
              <Fab disabled sx={{ ml: 2 }}><FiLock /></Fab>
            </CardContent>
          </Card>
        </div>

        <h2 id="forms">Form Components 📝</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Text Fields</Typography>
              <Stack spacing={2}>
                <TextField label="Standard" variant="standard" />
                <TextField label="Outlined" variant="outlined" />
                <TextField label="Filled" variant="filled" />
                <TextField label="With Helper Text" helperText="Helper text" />
                <TextField label="Error State" error helperText="Error message" />
                <TextField label="Disabled" disabled />
                <TextField label="Password" type="password" />
                <TextField label="Multiline" multiline rows={4} />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Select Dropdowns</Typography>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Select Option</InputLabel>
                  <Select value={tabValue} label="Select Option" onChange={(e) => setTabValue(e.target.value)}>
                    <MenuItem value={0}>Option 1</MenuItem>
                    <MenuItem value={1}>Option 2</MenuItem>
                    <MenuItem value={2}>Option 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Outlined Select</InputLabel>
                  <Select value={tabValue} label="Outlined Select">
                    <MenuItem value={0}>Option A</MenuItem>
                    <MenuItem value={1}>Option B</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Checkboxes & Switches</Typography>
              <Stack spacing={2}>
                <FormControlLabel 
                  control={<Checkbox checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} />} 
                  label="Checkbox" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={true} disabled />} 
                  label="Checked Disabled" 
                />
                <FormControlLabel 
                  control={<Switch checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />} 
                  label="Switch" 
                />
                <FormControlLabel 
                  control={<Switch checked={false} disabled />} 
                  label="Disabled Switch" 
                />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Radio Buttons</Typography>
              <FormControl>
                <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                  <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                  <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                  <FormControlLabel value="option3" control={<Radio />} label="Option 3" disabled />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Slider</Typography>
              <Slider 
                value={sliderValue} 
                onChange={(e, val) => setSliderValue(val)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
              <Typography variant="body2" color="text.secondary">
                Value: {sliderValue}
              </Typography>
            </CardContent>
          </Card>
        </div>

        <h2 id="display">Display Components 🎨</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Chips & Badges</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Success" color="success" />
                <Chip label="Error" color="error" />
                <Chip label="Deletable" onDelete={() => {}} />
                <Badge badgeContent={4} color="primary">
                  <FiBell />
                </Badge>
                <Badge badgeContent={99} color="error">
                  <FiMail />
                </Badge>
                <Badge badgeContent={1000} color="primary" max={999}>
                  <FiMessageCircle />
                </Badge>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Avatars</Typography>
              <Stack direction="row" spacing={2}>
                <Avatar>JD</Avatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>AB</Avatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>CD</Avatar>
                <Avatar src="/broken-image.jpg" alt="User" />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Typography</Typography>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
              <Typography variant="body1">Body 1 - Regular text content</Typography>
              <Typography variant="body2">Body 2 - Smaller text content</Typography>
              <Typography variant="caption">Caption text</Typography>
              <Typography variant="overline">Overline text</Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Lists</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><FiHome /></ListItemIcon>
                  <ListItemText primary="Home" secondary="Main dashboard" />
                </ListItem>
                <ListItemButton>
                  <ListItemIcon><FiUsers /></ListItemIcon>
                  <ListItemText primary="Users" secondary="Manage users" />
                </ListItemButton>
                <ListItem>
                  <ListItemIcon><FiSettings /></ListItemIcon>
                  <ListItemText primary="Settings" secondary="System configuration" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </div>

        <h2 id="navigation">Navigation Components 🧭</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tabs</Typography>
              <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
              <Box sx={{ p: 3 }}>
                <Typography>Content for Tab {tabValue + 1}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Breadcrumbs</Typography>
              <Breadcrumbs>
                <Link color="inherit" href="#">Home</Link>
                <Link color="inherit" href="#">Documentation</Link>
                <Typography color="text.primary">Components</Typography>
              </Breadcrumbs>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Stepper</Typography>
              <Stepper activeStep={1}>
                <Step>
                  <StepLabel>Select campaign settings</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Create an ad group</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Create an ad</StepLabel>
                </Step>
              </Stepper>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Drawer</Typography>
              <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250, p: 2 }}>
                  <Typography variant="h6">Drawer Content</Typography>
                  <List>
                    <ListItemButton><ListItemText primary="Item 1" /></ListItemButton>
                    <ListItemButton><ListItemText primary="Item 2" /></ListItemButton>
                    <ListItemButton><ListItemText primary="Item 3" /></ListItemButton>
                  </List>
                </Box>
              </Drawer>
            </CardContent>
          </Card>
        </div>

        <h2 id="feedback">Feedback Components 💬</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Alerts</Typography>
              <Stack spacing={2}>
                <Alert severity="error">Error alert message</Alert>
                <Alert severity="warning">Warning alert message</Alert>
                <Alert severity="info">Info alert message</Alert>
                <Alert severity="success">Success alert message</Alert>
                <Alert severity="error" onClose={() => {}}>Closable error</Alert>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Alert with title
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Progress Indicators</Typography>
              <Stack spacing={2}>
                <LinearProgress />
                <LinearProgress color="secondary" />
                <LinearProgress variant="determinate" value={60} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CircularProgress />
                  <CircularProgress color="secondary" />
                  <CircularProgress variant="determinate" value={75} />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Snackbar</Typography>
              <Button onClick={() => setSnackbarOpen(true)}>Show Snackbar</Button>
              <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={() => setSnackbarOpen(false)}
                message="This is a snackbar message"
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tooltips</Typography>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Tooltip text">
                  <Button>Hover me</Button>
                </Tooltip>
                <Tooltip title="Long tooltip text that wraps">
                  <IconButton><FiInfo /></IconButton>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        </div>

        <h2 id="overlay">Overlay Components 🎭</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Dialog</Typography>
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogContent>
                  <Typography>This is dialog content. You can add any content here.</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)} variant="contained">Confirm</Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Accordion</Typography>
              <Accordion expanded={accordionExpanded === 'panel1'} onChange={() => setAccordionExpanded('panel1')}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Accordion 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Content for accordion panel 1</Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={accordionExpanded === 'panel2'} onChange={() => setAccordionExpanded('panel2')}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Accordion 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Content for accordion panel 2</Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <h2 id="layout">Layout Components 📐</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cards</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Card Title</Typography>
                      <Typography variant="body2">Card content goes here</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Action</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Outlined Card</Typography>
                      <Typography variant="body2">With outline variant</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6">Paper Component</Typography>
                    <Typography variant="body2">Elevated paper</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Grid System</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>xs=12 sm=6 md=4</Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>xs=12 sm=6 md=4</Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>xs=12 sm=6 md=4</Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Stack & Container</Typography>
              <Container maxWidth="sm">
                <Stack spacing={2}>
                  <Paper sx={{ p: 2 }}>Stack Item 1</Paper>
                  <Paper sx={{ p: 2 }}>Stack Item 2</Paper>
                  <Paper sx={{ p: 2 }}>Stack Item 3</Paper>
                </Stack>
              </Container>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Divider</Typography>
              <Typography>Content above</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>Content below</Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            </CardContent>
          </Card>
        </div>

        <h2 id="custom">Custom Worklogz Components 🚀</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Attendance Components</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These are custom components built specifically for Worklogz attendance features.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>AttendanceCards</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Displays attendance status cards with check-in/check-out functionality
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>ProfileHeader</Typography>
                    <Typography variant="body2" color="text.secondary">
                      User profile header with avatar and basic information
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>DateStrip</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date navigation strip for selecting dates
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>TodayAttendance</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Today's attendance summary component
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>WeeklyHours</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Weekly hours tracking visualization
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>DailyEarningsCard</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Daily earnings display card
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>ActivityLog</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activity log display component
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>ActionButton</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Custom action button for attendance actions
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Employee Components</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>QuickAccessCard</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quick access card for employee features
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>EmployeeNavigation</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Employee-specific navigation component
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>

        <h2 id="usage">Usage Examples</h2>
        <div className="component-section">
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Basic Button Usage</Typography>
              <CodeBlock language="jsx">
{`import { Button } from '@mui/material';

function MyComponent() {
  return (
    <Button variant="contained" color="primary">
      Click Me
    </Button>
  );
}`}
              </CodeBlock>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Form with Validation</Typography>
              <CodeBlock language="jsx">
{`import { TextField, Button } from '@mui/material';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  return (
    <form>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        helperText={error ? "Invalid email" : ""}
        fullWidth
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
}`}
              </CodeBlock>
            </CardContent>
          </Card>
        </div>

        <h2 id="summary">Component Summary</h2>
        <div className="component-section">
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Total Components: 60+</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Action Components</Typography>
                <Typography variant="body2" color="text.secondary">8 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Form Components</Typography>
                <Typography variant="body2" color="text.secondary">12 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Display Components</Typography>
                <Typography variant="body2" color="text.secondary">10 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Navigation Components</Typography>
                <Typography variant="body2" color="text.secondary">8 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Feedback Components</Typography>
                <Typography variant="body2" color="text.secondary">6 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Overlay Components</Typography>
                <Typography variant="body2" color="text.secondary">4 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Layout Components</Typography>
                <Typography variant="body2" color="text.secondary">10 components</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Custom Components</Typography>
                <Typography variant="body2" color="text.secondary">10+ components</Typography>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    </DocsLayout>
  );
};

export default ComponentShowcase;


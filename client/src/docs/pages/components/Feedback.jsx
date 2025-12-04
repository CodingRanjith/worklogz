import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const Feedback = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Feedback Components</h1>
        <p className="intro-subtitle">
          Components for user feedback: Alerts, Snackbars, Progress indicators, and Tooltips.
        </p>

        <h2 id="alert">Alert</h2>
        <CodeBlock language="jsx">
{`import { Alert, AlertTitle, Stack } from '@mui/material';

function MyAlerts() {
  return (
    <Stack spacing={2}>
      <Alert severity="error">Error message</Alert>
      <Alert severity="warning">Warning message</Alert>
      <Alert severity="info">Info message</Alert>
      <Alert severity="success">Success message</Alert>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Alert with title
      </Alert>
    </Stack>
  );
}`}
        </CodeBlock>

        <h2 id="snackbar">Snackbar</h2>
        <CodeBlock language="jsx">
{`import { Snackbar, Button } from '@mui/material';

function MySnackbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show Snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="This is a snackbar message"
      />
    </>
  );
}`}
        </CodeBlock>

        <h2 id="progress">Progress</h2>
        <CodeBlock language="jsx">
{`import { LinearProgress, CircularProgress, Box } from '@mui/material';

function MyProgress() {
  return (
    <>
      <LinearProgress />
      <LinearProgress variant="determinate" value={60} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <CircularProgress />
        <CircularProgress variant="determinate" value={75} />
      </Box>
    </>
  );
}`}
        </CodeBlock>

        <h2 id="tooltip">Tooltip</h2>
        <CodeBlock language="jsx">
{`import { Tooltip, Button } from '@mui/material';

function MyTooltip() {
  return (
    <Tooltip title="This is a tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  );
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default Feedback;


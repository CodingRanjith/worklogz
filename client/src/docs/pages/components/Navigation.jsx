import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const Navigation = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Navigation Components</h1>
        <p className="intro-subtitle">
          Navigation components: Tabs, Breadcrumbs, Drawer, Stepper, and Menu components.
        </p>

        <h2 id="tabs">Tabs</h2>
        <CodeBlock language="jsx">
{`import { Tabs, Tab, Box } from '@mui/material';

function MyTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {value === 0 && <div>Tab 1 Content</div>}
        {value === 1 && <div>Tab 2 Content</div>}
        {value === 2 && <div>Tab 3 Content</div>}
      </Box>
    </>
  );
}`}
        </CodeBlock>

        <h2 id="breadcrumbs">Breadcrumbs</h2>
        <CodeBlock language="jsx">
{`import { Breadcrumbs, Link, Typography } from '@mui/material';

function MyBreadcrumbs() {
  return (
    <Breadcrumbs>
      <Link href="#">Home</Link>
      <Link href="#">Category</Link>
      <Typography>Current Page</Typography>
    </Breadcrumbs>
  );
}`}
        </CodeBlock>

        <h2 id="drawer">Drawer</h2>
        <CodeBlock language="jsx">
{`import { Drawer, List, ListItem, ListItemText, Button } from '@mui/material';

function MyDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List>
          <ListItem>
            <ListItemText primary="Item 1" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}`}
        </CodeBlock>

        <h2 id="stepper">Stepper</h2>
        <CodeBlock language="jsx">
{`import { Stepper, Step, StepLabel } from '@mui/material';

function MyStepper() {
  return (
    <Stepper activeStep={1}>
      <Step>
        <StepLabel>Step 1</StepLabel>
      </Step>
      <Step>
        <StepLabel>Step 2</StepLabel>
      </Step>
      <Step>
        <StepLabel>Step 3</StepLabel>
      </Step>
    </Stepper>
  );
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default Navigation;


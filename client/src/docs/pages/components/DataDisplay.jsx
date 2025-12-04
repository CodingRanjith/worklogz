import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const DataDisplay = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Data Display Components</h1>
        <p className="intro-subtitle">
          Components for displaying data: Cards, Chips, Badges, Avatars, Typography, Lists, and Tables.
        </p>

        <h2 id="card">Card</h2>
        <CodeBlock language="jsx">
{`import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

function MyCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Card Title</Typography>
        <Typography>Card content goes here</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Action</Button>
      </CardActions>
    </Card>
  );
}`}
        </CodeBlock>

        <h2 id="chip">Chip</h2>
        <CodeBlock language="jsx">
{`import { Chip, Stack } from '@mui/material';

function MyChips() {
  return (
    <Stack direction="row" spacing={1}>
      <Chip label="Default" />
      <Chip label="Primary" color="primary" />
      <Chip label="Deletable" onDelete={() => {}} />
    </Stack>
  );
}`}
        </CodeBlock>

        <h2 id="badge">Badge</h2>
        <CodeBlock language="jsx">
{`import { Badge, IconButton } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

function MyBadge() {
  return (
    <Badge badgeContent={4} color="primary">
      <IconButton>
        <MailIcon />
      </IconButton>
    </Badge>
  );
}`}
        </CodeBlock>

        <h2 id="avatar">Avatar</h2>
        <CodeBlock language="jsx">
{`import { Avatar, Stack } from '@mui/material';

function MyAvatars() {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar>JD</Avatar>
      <Avatar sx={{ bgcolor: 'primary.main' }}>AB</Avatar>
      <Avatar src="/user.jpg" alt="User" />
    </Stack>
  );
}`}
        </CodeBlock>

        <h2 id="typography">Typography</h2>
        <CodeBlock language="jsx">
{`import { Typography } from '@mui/material';

function MyTypography() {
  return (
    <>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="body1">Body text</Typography>
      <Typography variant="caption">Caption text</Typography>
    </>
  );
}`}
        </CodeBlock>

        <h2 id="list">List</h2>
        <CodeBlock language="jsx">
{`import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

function MyList() {
  return (
    <List>
      <ListItem>
        <ListItemIcon>Icon</ListItemIcon>
        <ListItemText primary="Item 1" secondary="Secondary text" />
      </ListItem>
    </List>
  );
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default DataDisplay;


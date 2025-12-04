import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const LayoutComponents = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Layout Components</h1>
        <p className="intro-subtitle">
          Layout components help structure your application's UI. Learn how to use Grid, Container, 
          Stack, Paper, and other layout components.
        </p>

        <h2 id="grid">Grid System</h2>
        <p>The Grid component provides a flexible grid layout system:</p>
        <CodeBlock language="jsx">
{`import { Grid, Paper } from '@mui/material';

function MyLayout() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper>Item 1</Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper>Item 2</Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper>Item 3</Paper>
      </Grid>
    </Grid>
  );
}`}
        </CodeBlock>

        <h2 id="container">Container</h2>
        <p>Container centers content horizontally and sets max-width:</p>
        <CodeBlock language="jsx">
{`import { Container } from '@mui/material';

function MyPage() {
  return (
    <Container maxWidth="lg">
      <h1>Page Content</h1>
    </Container>
  );
}`}
        </CodeBlock>

        <h2 id="stack">Stack</h2>
        <p>Stack arranges children vertically or horizontally:</p>
        <CodeBlock language="jsx">
{`import { Stack, Button } from '@mui/material';

function MyButtons() {
  return (
    <Stack direction="row" spacing={2}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Stack>
  );
}`}
        </CodeBlock>

        <h2 id="paper">Paper</h2>
        <p>Paper provides elevation and background:</p>
        <CodeBlock language="jsx">
{`import { Paper, Typography } from '@mui/material';

function MyCard() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Card Title</Typography>
      <Typography>Card content</Typography>
    </Paper>
  );
}`}
        </CodeBlock>

        <h2 id="box">Box</h2>
        <p>Box is a versatile container component:</p>
        <CodeBlock language="jsx">
{`import { Box } from '@mui/material';

function MyBox() {
  return (
    <Box
      sx={{
        width: 300,
        height: 200,
        bgcolor: 'primary.main',
        p: 2,
        borderRadius: 2
      }}
    >
      Content
    </Box>
  );
}`}
        </CodeBlock>

        <h2 id="divider">Divider</h2>
        <p>Divider separates content sections:</p>
        <CodeBlock language="jsx">
{`import { Divider, Typography } from '@mui/material';

function MyContent() {
  return (
    <>
      <Typography>Content above</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography>Content below</Typography>
    </>
  );
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default LayoutComponents;


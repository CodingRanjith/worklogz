import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const Overlay = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Overlay Components</h1>
        <p className="intro-subtitle">
          Overlay components: Dialogs, Modals, and Accordions for layered content.
        </p>

        <h2 id="dialog">Dialog</h2>
        <CodeBlock language="jsx">
{`import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function MyDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          Dialog content goes here
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}`}
        </CodeBlock>

        <h2 id="accordion">Accordion</h2>
        <CodeBlock language="jsx">
{`import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function MyAccordion() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Accordion Title</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Accordion content goes here</Typography>
      </AccordionDetails>
    </Accordion>
  );
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default Overlay;


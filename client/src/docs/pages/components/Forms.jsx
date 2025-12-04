import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const FormComponents = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Form Components</h1>
        <p className="intro-subtitle">
          Form components for user input. Learn how to use TextField, Select, Checkbox, Radio, 
          Switch, and Slider components.
        </p>

        <h2 id="textfield">TextField</h2>
        <CodeBlock language="jsx">
{`import { TextField } from '@mui/material';

function MyForm() {
  const [value, setValue] = React.useState('');

  return (
    <TextField
      label="Email"
      type="email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      variant="outlined"
      fullWidth
      helperText="Enter your email address"
    />
  );
}`}
        </CodeBlock>

        <h2 id="select">Select Dropdown</h2>
        <CodeBlock language="jsx">
{`import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function MySelect() {
  const [value, setValue] = React.useState('');

  return (
    <FormControl fullWidth>
      <InputLabel>Department</InputLabel>
      <Select
        value={value}
        label="Department"
        onChange={(e) => setValue(e.target.value)}
      >
        <MenuItem value="it">IT</MenuItem>
        <MenuItem value="hr">HR</MenuItem>
        <MenuItem value="finance">Finance</MenuItem>
      </Select>
    </FormControl>
  );
}`}
        </CodeBlock>

        <h2 id="checkbox">Checkbox</h2>
        <CodeBlock language="jsx">
{`import { FormControlLabel, Checkbox } from '@mui/material';

function MyCheckbox() {
  const [checked, setChecked] = React.useState(false);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      }
      label="I agree to the terms"
    />
  );
}`}
        </CodeBlock>

        <h2 id="radio">Radio Buttons</h2>
        <CodeBlock language="jsx">
{`import { RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';

function MyRadio() {
  const [value, setValue] = React.useState('option1');

  return (
    <FormControl>
      <RadioGroup
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
      </RadioGroup>
    </FormControl>
  );
}`}
        </CodeBlock>

        <h2 id="switch">Switch</h2>
        <CodeBlock language="jsx">
{`import { FormControlLabel, Switch } from '@mui/material';

function MySwitch() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      }
      label="Enable notifications"
    />
  );
}`}
        </CodeBlock>

        <h2 id="slider">Slider</h2>
        <CodeBlock language="jsx">
{`import { Slider, Typography } from '@mui/material';

function MySlider() {
  const [value, setValue] = React.useState(30);

  return (
    <>
      <Typography>Value: {value}</Typography>
      <Slider
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        min={0}
        max={100}
        valueLabelDisplay="auto"
      />
    </>
  );
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default FormComponents;


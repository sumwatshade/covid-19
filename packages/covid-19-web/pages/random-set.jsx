import React, { useState } from 'react';
import {
  Button, TextField, Box, TextareaAutosize, Snackbar, IconButton, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import seedrandom from 'seedrandom';

/**
 * Gets a random set of values
 *
 * @param {number} minValue
 * @param {number} maxValue
 * @param {number} numberOfValues
 * @param {Any} seed
 */
function getSortedUniqueNumbers(minValue, maxValue, numberOfValues, seed) {
  const errors = [];

  if (minValue > maxValue) {
    errors.push('Invalid range specified');
  }

  if (numberOfValues > maxValue - minValue) {
    errors.push('You have specified more values than your max range');
  } else if (numberOfValues < 1) {
    errors.push('You must have at least one number');
  }

  let currentSeed = seed;
  const res = [];
  const usedValues = {};

  for (let i = 0; i < numberOfValues; i += 1) {
    seedrandom(currentSeed, { global: true });

    const candidateValue = Math.floor(Math.random() * (maxValue - minValue) + minValue);

    if (!usedValues[candidateValue]) {
      res.push(candidateValue);
      usedValues[candidateValue] = true;
    } else {
      i -= 1;
    }

    currentSeed += 100;
  }

  const values = res.sort((a, b) => a - b);

  return {
    errors,
    data: values,
  };
}

const RandomNumbers = () => {
  const [seed, setSeed] = useState(10);
  const [error, setError] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(8000);
  const [num, setNum] = useState(1000);

  const [randomNums, setRandomNums] = useState([]);

  function onSubmit() {
    const { errors, data } = getSortedUniqueNumbers(min, max, num, seed);

    if (errors.length) {
      setError(errors.join('\n'));
    } else {
      setRandomNums(data);
    }
  }

  const [open, setOpen] = React.useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function copyNumbers() {
    const numbers = document.getElementById('numbers');

    /* Select the text field */
    numbers.select();
    numbers.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand('copy');
    setOpen(true);
  }


  return (
    <Box display="flex" flexDirection="column">
      <Typography>This website generates a unique set of numbers within a given range.</Typography>
      <TextField placeholder={seed} onChange={(e) => setSeed(e.target.value)} label="Seed" type="number" />
      <TextField placeholder={num} onChange={(e) => setNum(e.target.value)} label="Number of unique values" type="number" />
      <TextField placeholder={min} onChange={(e) => setMin(e.target.value)} label="Minimum value" type="number" />
      <TextField placeholder={max} onChange={(e) => setMax(e.target.value)} label="Maximum value" type="number" />
      <Button onClick={onSubmit}>Generate List</Button>
      <Button onClick={copyNumbers}>Copy Numbers</Button>
      <TextareaAutosize id="numbers" value={error || randomNums.join(',\n')} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Values successfully copied to clipboard"
        action={(
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        )}
      />
    </Box>
  );
};

export default RandomNumbers;

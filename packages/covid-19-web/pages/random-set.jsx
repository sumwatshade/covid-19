import React, { useState } from 'react';
import {
  Button, TextField, Box, TextareaAutosize, Snackbar, IconButton,
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
  return values;
}

const RandomNumbers = () => {
  const [seed, setSeed] = useState(Date.now());
  const [min, setMin] = useState(Date.now());
  const [max, setMax] = useState(Date.now());
  const [num, setNum] = useState(Date.now());

  const [randomNums, setRandomNums] = useState([]);

  function onSubmit() {
    setRandomNums(getSortedUniqueNumbers(min, max, num, seed));
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
      <TextField onChange={(e) => setSeed(e.target.value)} label="Seed" type="number" />
      <TextField onChange={(e) => setNum(e.target.value)} label="Number of unique values" type="number" />
      <TextField onChange={(e) => setMin(e.target.value)} label="Minimum value" type="number" />
      <TextField onChange={(e) => setMax(e.target.value)} label="Maximum value" type="number" />
      <Button onClick={onSubmit}>Generate List</Button>
      <Button onClick={copyNumbers}>Copy Numbers</Button>
      <TextareaAutosize id="numbers" value={randomNums.join(',\n')} />
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

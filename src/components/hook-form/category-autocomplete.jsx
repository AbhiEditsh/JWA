import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const RHFAutocomplete1 = ({ control, name, label, categories = [] }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => {
      // Find the selected category by name
      const selectedCategory = categories.find((cat) => cat.name === value) || null;

      return (
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.name || ''} // Display category name
          value={selectedCategory} // Show selected category in the field
          onChange={(event, newValue) =>
            onChange(newValue ? newValue.name : '')
          } // Store category name
          isOptionEqualToValue={(option, val) =>
            option.name === val?.name
          } // Matching based on name
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      );
    }}
  />
);

RHFAutocomplete1.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  categories: PropTypes.array.isRequired,
};

export default RHFAutocomplete1;

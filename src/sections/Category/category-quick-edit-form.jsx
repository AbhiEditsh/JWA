import { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, Button } from '@mui/material';
import axios from 'axios';
import { useGetCategoriesList } from 'src/api/categories';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function CategoryQuickEditForm({ currentCategory, open, onClose }) {
  const { mutate } = useGetCategoriesList();
  const { enqueueSnackbar } = useSnackbar();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = {
    name: currentCategory?.name || '',
    description: currentCategory?.description || '',
  };

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/update/${
        currentCategory._id
      }`;

      const response = await axios.put(URL, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      enqueueSnackbar(response.data.message || 'Update successful', { variant: 'success' });
      mutate(); 
      onClose(); 
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Update failed';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Error Details:', error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update Category</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 3 }}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
              <RHFTextField name="name" label="Category Name" />
              <RHFTextField name="description" label="Description" />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

CategoryQuickEditForm.propTypes = {
  currentCategory: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

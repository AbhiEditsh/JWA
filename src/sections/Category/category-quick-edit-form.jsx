import { useCallback, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { useGetCategoriesList } from 'src/api/categories';
import FormProvider, { RHFUploadAvatar, RHFTextField } from 'src/components/hook-form';

export default function CategoryQuickEditForm({ currentCategory, open, onClose }) {
  const { mutate } = useGetCategoriesList();
  const { enqueueSnackbar } = useSnackbar();
  const [profilePic, setProfilePic] = useState(currentCategory?.ProductImage || null);

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = {
    name: currentCategory?.name || '',
    description: currentCategory?.description || '',
    ProductImage: null,
  };

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Product_category');
    formData.append('folder', 'product_profiles');

    try {
      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dnodeczn6/image/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error.response?.data?.message || error.message);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const productPictureUrl = profilePic ? await uploadImage(profilePic) : '';
    const payload = {
      name: data.name,
      description: data.description,
      ProductImage: productPictureUrl,
    };

    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/update/${
        currentCategory._id
      }`;

      const response = await axios.put(URL, payload, {
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setProfilePic(file);
        setValue('ProductImage', previewUrl);
      }
    },
    [setValue]
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ textAlign: 'center' }}>Quick Update Category</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <RHFUploadAvatar
                  name="ProductImage"
                  onDrop={handleDrop}
                  value={profilePic}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr' }} gap={2}>
                  <RHFTextField name="name" label="Category Name" />
                  <RHFTextField name="description" label="Description" />
                </Box>
              </Grid>
            </Grid>
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

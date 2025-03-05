import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader, Typography } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useEffect } from 'react';

import FormProvider, { RHFUploadAvatar, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { useState, useCallback } from 'react';

export default function CategoryNewEditForm({ categoryId }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const [profilePic, setProfilePic] = useState(null);

  // Validation Schema
  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
    description: Yup.string().required('Description is required'),
  });

  // React Hook Form Setup
  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
      ProductImage: null,
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Fetch Category Data for Editing
  useEffect(() => {
    if (categoryId) {
      const fetchCategoryById = async () => {
        try {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/${categoryId}`;
          const response = await axios.get(URL);
          const { category } = response.data;

          reset({
            name: category.name,
            description: category.description,
          });

          if (category.ProductImage) {
            setProfilePic(category.ProductImage); // Set the existing image URL
          }
        } catch (error) {
          console.error('Failed to fetch category:', error);
        }
      };

      fetchCategoryById();
    }
  }, [categoryId, reset]);

  // Handle File Upload
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setProfilePic(file);
        setValue('ProductImage', file);
      }
    },
    [setValue]
  );

  // Create or Update Category
  const onSubmit = handleSubmit(async (data) => {
    console.log('Form Data:', data);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);

      // Append the uploaded file only if it's a new file (not a URL)
      if (profilePic && typeof profilePic !== 'string') {
        formData.append('ProductImage', profilePic);
      }

      let response;
      if (categoryId) {
        // Update Existing Category
        response = await axios.put(
          `${import.meta.env.VITE_AUTH_API}/api/admin/categories/${categoryId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create New Category
        response = await axios.post(
          `${import.meta.env.VITE_AUTH_API}/api/admin/categories/create`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      console.log('Response:', response);
      enqueueSnackbar(response.data.message, {
        variant: 'success',
      });
      router.push(paths.dashboard.category.list);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred';
      console.error('Error:', error);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        {/* Main Form Section */}
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Personal Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Basic info, profile pic, role, qualification...
          </Typography>

          <Card sx={{ pt: 5, px: 3, mt: 5 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="profile-pic"
                onDrop={handleDrop}
                defaultValue={profilePic || ''}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Category Details" />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={1}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
                {/* Name Field */}
                <RHFTextField name="name" label="Name" />
                {/* Description Field */}
                <RHFTextField name="description" label="Description" />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Submit Button Section */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {categoryId ? 'Update Category' : 'Save Category'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
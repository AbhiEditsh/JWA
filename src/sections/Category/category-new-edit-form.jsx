import { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader, Typography } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFUploadAvatar, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function CategoryNewEditForm({ categoryId }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const [profilePic, setProfilePic] = useState(null);

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
    description: Yup.string().required('Description is required'),
  });
  console.log(categoryId);

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

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/${categoryId}`;
        const response = await axios.get(URL);
        reset({
          name: response?.data.name,
          description: response?.data.description,
        });
        setProfilePic(data.ProductImage);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };

    fetchCategory();
  }, [categoryId, reset]);

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);

      if (profilePic instanceof File) {
        formData.append('ProductImage', profilePic);
      }

      console.log(formData);

      const response = categoryId
        ? await axios.put(
            `${import.meta.env.VITE_AUTH_API}/api/admin/categories/update/${categoryId}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
        : await axios.post(
            `${import.meta.env.VITE_AUTH_API}/api/admin/categories/create`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

      enqueueSnackbar(response.data.message, { variant: 'success' });
      router.push(paths.dashboard.category.list);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            {!mdUp && <CardHeader title="Category Information" />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Card sx={{ p: 2 }}>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr' }} gap={3}>
                  <RHFUploadAvatar name="ProductImage" onDrop={handleDrop} />

                  <RHFTextField name="name" label="Category Name" />
                  <RHFTextField name="description" label="Description" />
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {categoryId ? 'Update Category' : 'Create Category'}
                  </LoadingButton>
                </Box>
              </Card>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CategoryNewEditForm.propTypes = {
  categoryId: PropTypes.string,
};

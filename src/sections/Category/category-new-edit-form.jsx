import { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { Card, Grid, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFUploadAvatar, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import PropTypes from 'prop-types';

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  description: Yup.string().required('Description is required'),
});

export default function CategoryNewEditForm({ categoryId }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const [profilePic, setProfilePic] = useState(null);

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues: { name: '', description: '', ProductImage: null },
  });

  const { handleSubmit, setValue, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (!categoryId) return;
    axios.get(`${import.meta.env.VITE_AUTH_API}/api/admin/categories/${categoryId}`)
      .then(({ data }) => {
        reset({ name: data.name, description: data.description });
        setProfilePic(data.ProductImage);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [categoryId, reset]);

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
    const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/${categoryId ? `update/${categoryId}` : 'create'}`;
    const method = categoryId ? axios.put : axios.post;

    const productPictureUrl = profilePic ? await uploadImage(profilePic) : '';

    try {
      const { data: response } = await method(URL, {
        ...data,
        ProductImage: productPictureUrl,
      });
      enqueueSnackbar(response.message, { variant: 'success' });
      router.push(paths.dashboard.category.list);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'Submission error', { variant: 'error' });
      console.error('Submission Error:', error);
    }
  });

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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            {!mdUp && <Typography variant="h6" sx={{ mb: 2 }}>Category Details</Typography>}
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFUploadAvatar name="ProductImage" onDrop={handleDrop} />
              <RHFTextField name="name" label="Category Name" />
              <RHFTextField name="description" label="Description" />
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
                {categoryId ? 'Update Category' : 'Create Category'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CategoryNewEditForm.propTypes = { categoryId: PropTypes.string };

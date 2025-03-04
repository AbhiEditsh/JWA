import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';

export default function CategoryNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
    description: Yup.string().required('Description is required'),
  });

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const createCategory = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_API}/api/admin/categories/create`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Creation failed. Please try again.');
    }
  };

  // Handle form submission
  const onSubmit = handleSubmit(async (data) => {
    console.log('Form Data:', data);
    try {
      const response = await createCategory(data);

      enqueueSnackbar(response.message, {
        variant: 'success',
      });
      router.push(paths.dashboard.category  .list);
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        {/* Main Form Section */}
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
            Save Category
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

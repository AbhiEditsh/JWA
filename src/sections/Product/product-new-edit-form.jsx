import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSnackbar } from 'src/components/snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader, Typography } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { fData } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { PRODUCT_GENDER } from 'src/_mock/_gender';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

export default function ProductNewEditForm() {
  const { user } = useMockedUser();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    category: Yup.string().required('Category is required'),
    available: Yup.string().required('Availability status is required'),
    description: Yup.string(),
    price: Yup.number().required('Price is required').positive('Price must be a positive number'),
    gender: Yup.string().required('Gender specification is required'),
    oldPrice: Yup.number().nullable().min(0, 'Old price cannot be negative'),
    rating: Yup.number()
      .nullable()
      .min(0, 'Rating cannot be negative')
      .max(5, 'Rating cannot exceed 5'),
    author: Yup.string().required('Author is required'),
    sku: Yup.string().required('SKU is required'),
    productImage: Yup.mixed().nullable().required('Product image is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues: {
      name: '',
      category: '',
      available: '',
      description: '',
      price: '',
      gender: '',
      oldPrice: '',
      rating: '',
      author: user._id,
      sku: '',
      productImage: null,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data)
      // const token = sessionStorage.getItem('token');
      // const submissionData = { ...data };
     
      enqueueSnackbar('Product successfully created!', { variant: 'success' });
      router.push(paths.dashboard.product.list);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const newFile = Object.assign(file, { preview: URL.createObjectURL(file) });
        setValue('productImage', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Image
          </Typography>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar
              name="productImage"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Product Details" />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="name" label="name" />
                <RHFTextField name="category" label="category" />
                <RHFTextField name="description" label="Description" />
                <RHFTextField name="available" label="Availability" />
                <RHFTextField name="price" label="Price" type="number" />
                <RHFTextField name="oldPrice" label="Old Price" type="number" />
                <RHFTextField name="rating" label="Rating (0-5)" type="number" />
                <RHFAutocomplete
                  name="gender"
                  label="Gender"
                  options={PRODUCT_GENDER}
                  getOptionLabel={(option) => option}
                />
                <RHFTextField name="sku" label="SKU" />
                <RHFTextField name="author" label="Author" defaultValues={user._id} />
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Product
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

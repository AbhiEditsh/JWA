import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';


import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

export default function ProductNewEditForm() {
  const mdUp = useResponsive('up', 'md');

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    category: Yup.string().required('Category is required'),
    available: Yup.string().required('Availability status is required'),
    description: Yup.string(),
    price: Yup.number().required('Price is required').positive('Price must be a positive number'),
    gender: Yup.string().required('Gender specification is required'),
    oldPrice: Yup.number().nullable().min(0, 'Old price cannot be negative'),
    rating: Yup.number().nullable().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5'),
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
      author: '',
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
    console.log(data);
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        setValue('productImage', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const productImageField = (
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
              sx={{ mt: 3, mx: 'auto', display: 'block', textAlign: 'center', color: 'text.disabled' }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif
              <br /> Max size: 3MB
            </Typography>
          }
        />
      </Box>
    </Grid>
  );

  const productDetails = (
    <Grid item xs={12} md={8}>
      <Card>
        {!mdUp && <CardHeader title="Product Details" />}
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Product Name" />
            <RHFTextField name="category" label="Category" />
            <RHFTextField name="available" label="Availability" />
            <RHFTextField name="price" label="Price" type="number" />
            <RHFTextField name="oldPrice" label="Old Price" type="number" />
            <RHFTextField name="rating" label="Rating (0-5)" type="number" />
            <RHFTextField name="gender" label="Gender" />
            <RHFTextField name="sku" label="SKU" />
            <RHFTextField name="author" label="Author" />
          </Box>
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        Save Product
      </LoadingButton>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        {productImageField}
        {productDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}


// ProductNewEditForm.propTypes = {
//   productId: PropTypes.string,
// };

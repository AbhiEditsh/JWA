import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader, Typography } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from 'axios';
import RHFAutocomplete1 from 'src/components/hook-form/category-autocomplete';
import { useGetCategoriesList } from 'src/api/product';
import { fData } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useResponsive } from 'src/hooks/use-responsive';
import { PRODUCT_GENDER } from 'src/_mock/_gender';
import PropTypes from 'prop-types';

export default function ProductNewEditForm({ productId }) {
  const { user } = useMockedUser();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { categories } = useGetCategoriesList();
  const [profilePic, setProfilePic] = useState(null);

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    category: Yup.string().required('Category is required'),
    Available: Yup.string().required('Availability status is required'),
    description: Yup.string(),
    price: Yup.number().required('Price is required').positive('Price must be a positive number'),
    gender: Yup.string().required('Gender specification is required'),
    oldPrice: Yup.number().nullable().min(0, 'Old price cannot be negative'),
    rating: Yup.number()
      .nullable()
      .min(0, 'Rating cannot be negative')
      .max(5, 'Rating cannot exceed 5'),
    ProductImage: Yup.mixed().nullable().required('Product image is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues: {
      name: '',
      category: '',
      Available: '',
      description: '',
      price: '',
      gender: '',
      oldPrice: '',
      rating: '',
      author: user.displayName,
      sku: '',
      ProductImage: null,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    control,
    reset,
  } = methods;

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`${import.meta.env.VITE_AUTH_API}/api/product/${productId}`)
      .then(({ data }) => {
        reset({
          name: data.product.name,
          description: data.product.description,
          category: data.product.category.name,
          price: data.product.price,
          gender: data.product.gender,
          oldPrice: data.product.oldPrice,
          rating: data.product.rating,
          sku: data.product.sku,
          author: data.product.author,
          Available: data.product.Available,
          author: user.displayName,
        });
        setProfilePic(data.product.ProductImage);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [productId, reset]);

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
      return null;
    }
  };

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     const productPictureUrl = profilePic ? await uploadImage(profilePic) : '';
  //     const payload = {
  //       name: data.name,
  //       category: data.category,
  //       description: data.description,
  //       price: data.price,
  //       gender: data.gender,
  //       oldPrice: data.oldPrice,
  //       rating: data.rating,
  //       author: user.id,
  //       sku: data.sku,
  //       Available: data.Available,
  //       ProductImage: productPictureUrl,
  //     };
  //     console.log(payload);

  //     const token = sessionStorage.getItem('token');
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_AUTH_API}/api/product/admin/create`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     enqueueSnackbar(response.data.message, { variant: 'success' });
  //     router.push(paths.dashboard.product.list);
  //   } catch (error) {
  //     enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
  //   }
  // });

  const onSubmit = handleSubmit(async (data) => {
    const URL = `${import.meta.env.VITE_AUTH_API}/api/product/admin/${
      productId ? `update/${productId}` : 'create'
    }`;
    const method = productId ? axios.put : axios.post;
  
    const token = sessionStorage.getItem('token');
  
    const productPictureUrl = profilePic ? await uploadImage(profilePic) : '';
  
    const payload = {
      name: data.name,
      category: data.category,
      description: data.description,
      price: data.price,
      gender: data.gender,
      oldPrice: data.oldPrice,
      rating: data.rating,
      author: user.id,
      sku: data.sku,
      Available: data.Available,
      ProductImage: productPictureUrl,
    };
  
    try {
      const { data: response } = await method(
        URL,
        payload, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      enqueueSnackbar(response.message, { variant: 'success' });
      router.push(paths.dashboard.product.list);
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
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Image
          </Typography>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar
              name="ProductImage"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{ mt: 3, mx: 'auto', textAlign: 'center', color: 'text.disabled' }}
                >
                  Allowed: *.jpeg, *.jpg, *.png, *.gif <br />
                  Max size: {fData(3145728)}
                </Typography>
              }
            />
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Product Details" />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                columnGap={2}
                rowGap={3}
              >
                <RHFTextField name="name" label="Product Name" />
                <RHFAutocomplete1
                  control={control}
                  name="category"
                  label="Category"
                  categories={categories}
                />
                <RHFTextField name="description" label="Description" />
                <RHFTextField name="Available" label="Availability" />
                <RHFTextField name="price" label="Price" type="number" />
                <RHFTextField name="oldPrice" label="Old Price" type="number" />
                <RHFTextField name="rating" label="Rating (0-5)" type="number" />
                <RHFAutocomplete name="gender" label="Gender" options={PRODUCT_GENDER} />
                <RHFTextField name="sku" label="SKU" />
                <RHFTextField name="author" label="Author" defaultValue={user.displayName} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Product
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = { productId: PropTypes.string };

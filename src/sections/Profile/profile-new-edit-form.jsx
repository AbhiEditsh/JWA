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
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useResponsive } from 'src/hooks/use-responsive';
import { PRODUCT_GENDER } from 'src/_mock/_gender';
import { paths } from 'src/routes/paths';

export default function ProfileNewEditForm() {
  const { user } = useMockedUser();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const [profilePic, setProfilePic] = useState(user.profilePicture);

  const ProfileSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string(),
    gender: Yup.string().required('Gender is required'),
    address: Yup.object().shape({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      postalCode: Yup.string(),
      country: Yup.string(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      username: user.displayName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      address: {
        street: user?.street || '',
        city: user?.city || '',
        state: user?.state || '',
        postalCode: user?.postalCode || '',
        country: user?.country || '',
      },
      profilePicture: user.profilePicture || '',
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    reset,
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
      return null;
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setProfilePic(file);
        setValue('profilePicture', file);
      }
    },
    [setValue]
  );
  // Submit Form and Send Data to Backend
  const onSubmit = handleSubmit(async (data) => {
    const ProfilePictureUrl = profilePic ? await uploadImage(profilePic) : '';
    const payload = {
      ...data,
      profilePicture: ProfilePictureUrl,
    };
    const token = sessionStorage.getItem('token');
    console.log(data);

    try {
      await axios.put(`${import.meta.env.VITE_AUTH_API}/api/users/update-user`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      router.push(paths.dashboard.product.root);
      window.location.reload();
    } catch (error) {
      enqueueSnackbar('Error updating profile!', { variant: 'error' });
      console.error('Update Error:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Profile Image
          </Typography>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar
              name="profilePicture"
              maxSize={3145728}
              onDrop={handleDrop}
              value={profilePic}
              helperText={
                <Typography
                  variant="caption"
                  sx={{ mt: 3, mx: 'auto', textAlign: 'center', color: 'text.disabled' }}
                >
                  Allowed: *.jpeg, *.jpg, *.png, *.gif <br />
                  Max size: 3MB
                </Typography>
              }
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Profile Details" />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                columnGap={2}
                rowGap={3}
              >
                <RHFTextField name="username" label="Username" />
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="phone" label="Phone" />
                <RHFAutocomplete name="gender" label="Gender" options={PRODUCT_GENDER} />
                <RHFTextField name="address.street" label="Street" />
                <RHFTextField name="address.city" label="City" />
                <RHFTextField name="address.state" label="State" />
                <RHFTextField name="address.postalCode" label="Postal Code" />
                <RHFTextField name="address.country" label="Country" />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Profile
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

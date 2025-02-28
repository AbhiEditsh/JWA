import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import {Card ,Grid,Stack} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';

import { Box,CardHeader, Typography, } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';


export default function ProductNewEditForm() {
  const mdUp = useResponsive('up', 'md');

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    contact: Yup.string().required('Phone number is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      contact: '',
      occupation: '',
      email: '',
      education: '',
      fatherName: '',
      father_contact: '',
      father_occupation: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;



  const onSubmit = handleSubmit(async (data) => {
  console.log(data)
  });

  const personalDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Personal Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Basic info, role, Occupation...
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Personal Details" />}
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
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="contact" label="Phone Number" />
              <RHFTextField name="occupation" label="Occupation" />
              <RHFTextField name="education" label="Education" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );


  const fatherDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Father Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Father info, Contact, Occupation...
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Father Details" />}
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
              <RHFTextField name="fatherName" label="Father Name" />
              <RHFTextField name="father_contact" label="Father Phone Number" />
              <RHFTextField name="father_occupation" label="Father Occupation" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );



  const renderActions = (
    <>
      {mdUp && <Grid item md={4} />}
      <Grid
        item
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
      >
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
"          Create Inquiry
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12} />
        {personalDetails}
        <Grid item xs={12} md={12} />
        {fatherDetails}

        <Grid item xs={12} md={12} />
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  productId: PropTypes.string,
};

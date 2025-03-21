import { useAuthContext } from 'src/auth/hooks';

export function useMockedUser() {
  const { user: authUser } = useAuthContext();
  

  const mockedUser = {
    id: authUser._id,
    displayName: authUser?.username || 'Guest',
    email: authUser?.email || 'guest@example.com',
    password: authUser?.password || '',
    profilePicture: authUser?.profilePicture,
    gender: authUser?.gender,
    phone: authUser.phone,
    country: authUser.address.country,
    street: authUser.address.street,
    state: authUser.address.state,
    city: authUser.address.city,
    postalCode: authUser.address.postalCode,
    role: authUser?.role || 'user',
    isPublic: true,
  };

  return { user: mockedUser };
}

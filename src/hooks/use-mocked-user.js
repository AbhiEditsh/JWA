import { useAuthContext } from 'src/auth/hooks';

export function useMockedUser() {
  const { user: authUser } = useAuthContext(); 

  const mockedUser = {
    id: authUser
    ._id,
    displayName: authUser?.username || 'Guest User',
    email: authUser?.email || 'guest@example.com',
    password: authUser?.password || '',
    // photoURL: authUser?.profileImage,
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: authUser?.role || 'user',
    isPublic: true,
  };

  return { user: mockedUser };
}

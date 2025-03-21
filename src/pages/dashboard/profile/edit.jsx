import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import ProfileEditView from 'src/sections/Profile/view/profile-edit-view';

// ----------------------------------------------------------------------
export default function ProfileEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Profile Edit</title>
      </Helmet>

      <ProfileEditView id={`${id}`} />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import DashboardView from 'src/sections/Dashbaord/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <DashboardView />
    </>
  );
}

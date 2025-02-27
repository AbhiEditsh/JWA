import { Helmet } from 'react-helmet-async';

import CategoryView from 'src/sections/Category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Category</title>
      </Helmet>

      <CategoryView />
    </>
  );
}

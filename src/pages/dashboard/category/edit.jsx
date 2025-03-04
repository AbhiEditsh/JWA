import { Helmet } from 'react-helmet-async';

import CategoryEditView from 'src/sections/Category/view/category-edit-view';


// ----------------------------------------------------------------------
export default function CategoryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: C Edit</title>
      </Helmet>

      <CategoryEditView/>
    </>
  );
}

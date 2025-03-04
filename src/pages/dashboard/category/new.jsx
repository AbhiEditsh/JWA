import { Helmet } from 'react-helmet-async';

import CategoryCreateView from 'src/sections/Category/view/category-create-view';

// ----------------------------------------------------------------------

function CategoryCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Category</title>
      </Helmet>

      <CategoryCreateView />
    </>
  );
}

export default CategoryCreatePage;

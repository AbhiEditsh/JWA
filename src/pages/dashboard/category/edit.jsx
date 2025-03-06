import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import CategoryEditView from 'src/sections/Category/view/category-edit-view';

// ----------------------------------------------------------------------
export default function CategoryEditPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: C Edit</title>
      </Helmet>

      <CategoryEditView id={`${id}`} />
    </>
  );
}

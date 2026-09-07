'use client';

import React, { use } from 'react';
import { useParams } from 'next/navigation';
import CategoryCollectionPage from '../page';

export default function SubCategoryCollectionPage({
  params,
}: {
  params?: Promise<{ category: string; subcategory: string }>;
}) {
  const routeParams = useParams();
  const unwrappedParams = params ? use(params) : null;

  const category = (unwrappedParams?.category || routeParams?.category || '') as string;
  const subcategory = (unwrappedParams?.subcategory || routeParams?.subcategory || '') as string;

  return (
    <CategoryCollectionPage
      forcedCategory={category}
      forcedSubCategory={subcategory}
    />
  );
}

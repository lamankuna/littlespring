"use client";
import { useState } from 'react';
import { Button } from '@littlespring/ui';
import { addToCartAction } from '../../cart/actions';
import type { ProductLite } from '@littlespring/core';

export function AddToCart({ product, canAdd }: { product: ProductLite; canAdd: boolean }) {
  const [pending, setPending] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <Button
        disabled={!canAdd || pending}
        onClick={async () => {
          try {
            setPending(true);
            await addToCartAction({ id: product.id, title: product.title, priceZar: product.priceZar, image: product.images[0] });
          } finally {
            setPending(false);
          }
        }}
      >
        {canAdd ? (pending ? 'Adding…' : 'Add to cart') : 'Unavailable'}
      </Button>
    </div>
  );
}


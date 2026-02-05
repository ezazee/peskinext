"use client";

import * as React from "react";
import AddressEditClient from "@features/address/AddressEditClient";

export default function AddressEditPageClient({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.JSX.Element {
  const { id } = React.use(params);

  return <AddressEditClient id={id} />;
}

'use client';

import * as React from 'react';
// @ts-expect-error broken lib typings
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';

export default function Page() {
  return <API apiDescriptionUrl={'/api/v1/specification'} router="hash" />;
}

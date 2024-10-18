'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { demarrerProjet } from '../../app/actions';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const initialState = {
  message: '',
  uuid: undefined
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Rechercher des aides
    </button>
  );
}

export function RechercherAidesForm() {
  const [formState, formAction] = useFormState(demarrerProjet, initialState);
  useEffect(() => {
    if (formState?.uuid) {
      redirect(`/projets/${formState?.uuid}`);
    }
  }, [formState]);

  return (
    <form action={formAction}>
      <label htmlFor="todo">Description </label>
      <input type="text" id="description" name="description" required />
      <SubmitButton />
      {formState?.uuid}
      <p aria-live="polite" className="sr-only" role="status">
        {formState?.message}
      </p>
    </form>
  );
}

// <form action={demarrerProjet}>
//     <FormControlLabel
//         control={
//             <TextareaAutosize
//                 onChange={(event) => setIsDark(event.target.checked)}
//                 inputProps={{"aria-label": "controlled"}}
//             />
//         }
//         label="Description"
//     />
//     <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
//         <Button variant="contained">Contained</Button>
//     </Stack>
// </form>

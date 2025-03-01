import * as React from 'react';
import { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';
import Input from '@codegouvfr/react-dsfr/Input';

import { ZoneGeographique } from '@/domain/models/zone-geographique';

export type TerritoireAutocompleteProps = {
  value: ZoneGeographique | null;
  setValue: Dispatch<SetStateAction<TerritoireAutocompleteProps['value']>>;
};

export default function TerritoireAutocomplete({ value, setValue }: TerritoireAutocompleteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly ZoneGeographique[]>([]);

  const memoizedFetchTerritoires = React.useMemo(
    () =>
      debounce((request: { input: string }, callback: (results?: readonly ZoneGeographique[]) => void) => {
        fetch(`/api/autocomplete/territoire?query=${request.input}`)
          .then((response) => response.json())
          .then(callback);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    memoizedFetchTerritoires({ input: inputValue }, (results?: readonly ZoneGeographique[]) => {
      if (active) {
        let newOptions: readonly ZoneGeographique[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="Aucunes correspondances"
      onChange={(event: SyntheticEvent, newValue: ZoneGeographique | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={({ id, disabled, InputProps, inputProps }) => (
        <>
          <Input
            label="Zone géographique"
            id={id}
            disabled={disabled}
            ref={InputProps.ref}
            nativeInputProps={{
              ...inputProps,
              name: 'territoire',
              placeholder: 'Nom de votre commune, EPCI, départment, etc.'
            }}
          />
          <input type="hidden" name="territoireId" value={value?.id} />
        </>
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const matches = match(option.description, inputValue);
        const parts = parse(option.description, matches);

        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {parts.map((part, index) => (
                  <Box key={index} component="span" sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}>
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {option.description}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

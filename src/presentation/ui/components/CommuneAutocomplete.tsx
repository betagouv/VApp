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

import { CommuneSearchResultDto } from '@/presentation/ui/dtos/commune-search-result.dto';

export type CommuneAutocompleteProps = {
  value: CommuneSearchResultDto | null;
  setValue: Dispatch<SetStateAction<CommuneAutocompleteProps['value']>>;
};

export default function CommuneAutocomplete({ value, setValue }: CommuneAutocompleteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly CommuneSearchResultDto[]>([]);

  const memoizedFetchCommunes = React.useMemo(
    () =>
      debounce((request: { input: string }, callback: (results?: readonly CommuneSearchResultDto[]) => void) => {
        fetch(
          `https://geo.api.gouv.fr/communes?nom=${request.input}&fields=code,nom,epci,region&boost=population&limit=5`
        )
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

    memoizedFetchCommunes({ input: inputValue }, (results?: readonly CommuneSearchResultDto[]) => {
      if (active) {
        let newOptions: readonly CommuneSearchResultDto[] = [];

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
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.nom)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="Aucunes correspondances"
      onChange={(event: SyntheticEvent, newValue: CommuneSearchResultDto | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={({ id, disabled, InputProps, inputProps }) => (
        <Input
          label="Commune"
          id={id}
          disabled={disabled}
          ref={InputProps.ref}
          nativeInputProps={{
            ...inputProps,
            name: 'commune'
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const matches = match(option.nom, inputValue);
        const parts = parse(option.nom, matches);

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
                  {option.code}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

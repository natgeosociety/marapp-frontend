/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconChevronDown from 'mdi-material-ui/ChevronDown';

import { useTranslation } from 'react-i18next';

import { cleanFilters, countFilters } from '../../utils/filters';
import './styles.scss';

interface IProps {
  open: boolean;
  onOpenToggle: (payload?) => void;
  onChange: (payload?) => void;
  filters: { [key: string]: string[] };
  availableFilters: { [key: string]: Array<{ [key: string]: any }> };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey['600'],
    '&$expanded': {
      margin: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {},
}));

const FilterBy = (props: IProps) => {
  const { open, availableFilters, filters, onOpenToggle, onChange } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [currentAvailableFilters, setCurrentAvailableFilters] = useState({});

  // Keep old available filters while new filters are fetched
  useEffect(() => availableFilters && setCurrentAvailableFilters(availableFilters), [
    availableFilters,
  ]);

  const numberOfFilters = countFilters(filters);

  const toggleFilter = (key: string, value: string) => {
    const filterGroup = filters[key] || [];
    const exists = filterGroup.includes(value);
    const newFilters = {
      [key]: exists ? filterGroup.filter((x) => x !== value) : [...filterGroup, value],
    };
    onChange({
      filters: cleanFilters({
        ...filters,
        ...newFilters,
      }),
    });
  };

  const clearCheckedFilters = () =>
    onChange({
      filters: {},
    });
  const openToggle = () => onOpenToggle(!open);

  return (
    <Accordion
      style={{ marginTop: '-16px' }}
      classes={{
        root: classes.root,
        expanded: classes.expanded,
      }}
    >
      <AccordionSummary expandIcon={<IconChevronDown />}>
        <Typography>
          <Typography component="span" variant="button">
            {t('Filters')}
          </Typography>{' '}
          {numberOfFilters > 0 && (
            <a
              className="marapp-qa-filterbyclear ng-link ng-nohover ng-text-weight-regular ng-text-capital"
              onClick={clearCheckedFilters}
            >
              {t('Clear')} {`(${numberOfFilters})`}
            </a>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Object.keys(currentAvailableFilters).map((key) => (
          <Grid key={key} container={true} spacing={1}>
            {currentAvailableFilters[key].map((filter, i) => {
              const checked = !!(filters[key] && filters[key].includes(filter.value));
              const disabled = filter.count === 0;

              return (
                <Grid key={`${filter.key}-${filter.value}`} item={true} xs={12} sm={6}>
                  <FormControlLabel
                    label={
                      <span>
                        {filter.label} <em>({filter.count})</em>
                      </span>
                    }
                    control={
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        value={filter.value}
                        onChange={(e: any) => toggleFilter(key, filter.value)}
                      />
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterBy;

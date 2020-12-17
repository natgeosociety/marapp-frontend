import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorBoundary } from './ErrorBoundary';

const DEFAULT_FALLBACK_TEXT = 'Unexpected error occurred';

const VALID_TEXT = 'Some valid text';

const ValidComponent = () => <h1>{VALID_TEXT}</h1>;

const InvalidComponent = () => {
  throw new Error('Some Error');
};

describe('<ErrorBoundary />', () => {
  it('should render valid children', () => {
    render(
      <ErrorBoundary>
        <ValidComponent />
      </ErrorBoundary>
    );

    const component = screen.getByText(VALID_TEXT);

    expect(component).toBeInTheDocument();
  });

  it('should catch error thrown by children and render default fallback "Unexpected error occurred"', () => {
    render(
      <ErrorBoundary>
        <InvalidComponent />
      </ErrorBoundary>
    );

    const component = screen.getByText(DEFAULT_FALLBACK_TEXT);

    expect(component).toBeInTheDocument();
  });

  it('should catch error thrown by children and render provided fallbackComponent instead of default fallback', () => {
    render(
      <ErrorBoundary fallbackComponent={<ValidComponent />}>
        <InvalidComponent />
      </ErrorBoundary>
    );

    const defaultFallback = screen.queryByText(DEFAULT_FALLBACK_TEXT);
    const providedFallback = screen.queryByText(VALID_TEXT);

    expect(defaultFallback).toBeNull();
    expect(providedFallback).toBeInTheDocument();
  });
});

export const SELECT_THEME = {
  borderRadius: 0,
  colors: {
    primary: 'var(--marapp-primary-color)',
    neutral0: 'var(--marapp-gray-8)',
    neutral10: 'var(--marapp-gray-2)',
    neutral20: 'var(--marapp-gray-2)',
    neutral30: 'var(--marapp-gray-2)',
    neutral50: 'var(--marapp-gray-1)',
    neutral60: 'var(--marapp-gray-1)',
    neutral80: 'var(--marapp-gray-8)'
  },
};

export const CUSTOM_STYLES = {
  valueContainer: (provided, state) => ({
    ...provided,
    boxShadow: 'none'
  }),
  input: () => ({
    boxShadow: 'none'
  }),
  container: () => ({
    boxShadow: 'none'
  }),
  menu: () => ({
    border: '1px solid var(--marapp-gray-1)',
    boxShadow: 'none',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'var(--marapp-gray-6)' : 'var(--marapp-gray-8)',
    padding: 10,
    boxShadow: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    padding: 10,
    boxShadow: 'none',
  }),
  multiValue: (provided, state) => ({
    ...provided,
    borderRadius: '50px',
    display: 'flex',
  }),
  multiValueRemove: () => ({
    color: 'var(--marapp-gray-9)',
    padding: '0px 10px',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    color: 'var(---marapp-gray-2)'
  }),
  clearIndicator: () => ({
    color: 'var(--marapp-gray-2)'
  }),
  dropdownIndicator: () => ({
    color: 'var(--marapp-gray-2)'
  })
};

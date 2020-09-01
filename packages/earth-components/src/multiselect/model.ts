export const SELECT_THEME = {
  borderRadius: 0,
  colors: {
    primary: '#0099A1',
    neutral0: '#343A40',
    neutral10: '#E9ECEF',
    neutral20: '#E9ECEF',
    neutral30: '#fff',
    neutral50: '#F8F9FA',
    neutral60: '#F8F9FA',
    neutral80: '#212529'
  },
};

export const CUSTOM_STYLES = {
  valueContainer: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    //   backgroundColor: 'blue',
  }),
  input: () => ({
    boxShadow: 'none',
  }),
  container: () => ({
    boxShadow: 'none',
    // backgroundColor: 'yellow',
    //  border: '1px solid red',
    // padding: 10,
  }),
  menu: () => ({
    border: '1px solid #F8F9FA',
    boxShadow: 'none',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#6C757D' : '#343A40',
    padding: 10,
    boxShadow: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    //  border: state.isFocused ? '1px solid red' : '1px solid blue',
    padding: 10,
    boxShadow: 'none',
  }),
  multiValue: (provided, state) => ({
    ...provided,
    borderRadius: '50px',
    display: 'flex',
  }),
  multiValueRemove: () => ({
    color: '#212529',
    padding: '0px 10px',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    // const opacity = state.isDisabled ? 0.5 : 1;
    // const transition = 'opacity 300ms';
    //
    // return { ...provided, opacity, transition };
  }),
};

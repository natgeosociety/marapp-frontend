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

import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import classnames from 'classnames';

import Input from './input';

import './styles.scss';

class Datepicker extends PureComponent {
  // renderCalendarHeader = ({
  //   date,
  //   changeYear,
  //   changeMonth,
  //   decreaseMonth,
  //   increaseMonth,
  //   prevMonthButtonDisabled,
  //   nextMonthButtonDisabled
  // }) => {
  //   const { settings } = this.props;
  //   const { minDate, maxDate } = settings;
  //   const maxMoment = moment(maxDate);
  //   const minMoment = moment(minDate);

  //   return (
  //     <div className="c-datepicker-header">
  //       <Button
  //         theme="theme-button-small square"
  //         className="menu-link prev-month"
  //         onClick={decreaseMonth}
  //         disabled={prevMonthButtonDisabled}
  //       >
  //         <Icon icon={arrowIcon} />
  //       </Button>
  //       <Dropdown
  //         className="c-date-dropdown"
  //         theme="theme-dropdown-native theme-dropdown-native-button"
  //         options={moment
  //           .months()
  //           .filter((m, i) => {
  //             if (date.getFullYear() === minMoment.year()) {
  //               return i >= minMoment.month();
  //             } else if (date.getFullYear() === maxMoment.year()) {
  //               return i <= maxMoment.month();
  //             }
  //             return true;
  //           })
  //           .map((m, i) => ({ value: i, label: m }))}
  //         onChange={changeMonth}
  //         value={date.getMonth()}
  //         native
  //       />
  //       <Dropdown
  //         className="c-date-dropdown"
  //         theme="theme-dropdown-native theme-dropdown-native-button"
  //         options={range(
  //           parseInt(minMoment.year(), 10),
  //           parseInt(maxMoment.year(), 10) + 1
  //         ).map(i => ({ value: i, label: i }))}
  //         onChange={changeYear}
  //         value={date.getFullYear()}
  //         native
  //       />
  //       <Button
  //         theme="theme-button-small square"
  //         className="menu-link next-month"
  //         onClick={increaseMonth}
  //         disabled={nextMonthButtonDisabled}
  //       >
  //         <Icon icon={arrowIcon} />
  //       </Button>
  //     </div>
  //   );
  // };

  renderCalendarContainer = ({ children }) => {
    return createPortal(
      <CalendarContainer>
        {children}
      </CalendarContainer>
    , document.body);
  };

  render() {
    const { className, onDateChange, settings, theme, date } = this.props;
    const { minDate, maxDate } = settings;

    return (
      <div
        ref={ref => { this.ref = ref; }}
        className={classnames('c-datepicker', 'marapp-qa-datepicker', theme, className)}
      >
        <ReactDatePicker
          className="datepicker-input"
          selected={date.toDate()}
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          dateFormat="dd MMM"
          // Custom components
          customInput={<Input />}
          // Popper
          popperContainer={this.renderCalendarContainer}
          popperPlacement="top-start"
          popperClassName="c-datepicker-popper"
          popperModifiers={{
            flip: {
              enabled: false
            },
            offset: {
              enabled: true,
              offset: '0px, -15px'
            },
            preventOverflow: {
              enabled: true,
              escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
              boundariesElement: 'viewport'
            }
          }}
          // Func
          onSelect={onDateChange}
          // renderCustomHeader={this.renderCalendarHeader}
        />
      </div>
    );
  }
}

Datepicker.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.object,
  onDateChange: PropTypes.func.isRequired,
  settings: PropTypes.object
};

export default Datepicker;
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Select from 'react-select';
import './App.css'; 

const WeeklySchedule = () => {
  const [selectedDate, setSelectedDate] = useState(moment().startOf('week')); 
  const [timezone, setTimezone] = useState('UTC');
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  useEffect(() => {
    fetchData(selectedDate, timezone);
  }, [selectedDate, timezone]);

  const fetchData = async (date, tz) => {
    try {
      const response = await import('./data.json');
      const data = response.default;

      setWeeklySchedule(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTimezoneChange = (selectedOption) => {
    setTimezone(selectedOption.value);
  };

  const loadPreviousWeek = () => {
    setSelectedDate(selectedDate.clone().subtract(1, 'week'));
  };

  const loadNextWeek = () => {
    setSelectedDate(selectedDate.clone().add(1, 'week'));
  };

  
  
  
 
  const getWorkingDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = startDate.clone().add(i, 'days');
      if (currentDay.day() >= 1 && currentDay.day() <= 5) {
        days.push(currentDay);
      }
    }
    return days;
  };


  
  const handleCheckboxChange = (date, time) => {
    // we  Handle checkbox change logic here
    console.log(`Checkbox for ${date} - ${time} changed`);
  };
  return (
    <div className="weekly-schedule-container">
    
      <div className="date-navigation">
        <button onClick={loadPreviousWeek}>Previous Week</button>
        <label>Current Date: {moment().format('YYYY-MM-DD')}</label>
        <button onClick={loadNextWeek}>Next Week</button>
      </div>

      <div className="timezone-selector">
        <label>Timezone:</label>
        <Select
          options={[
            { value: 'UTC', label: 'UTC' },
            { value: 'America/New_York', label: 'America/New_York' },
           
          ]}
          value={{ value: timezone, label: timezone }}
          onChange={handleTimezoneChange}
        />
      </div>

      
      <div className="schedule-table">
        <table>
          <tbody>
            {getWorkingDays(selectedDate).map((day) => (
              <tr key={day.format('YYYY-MM-DD')}>
                <td>
                  {day.format('dddd')}<br />
                  {day.format('YYYY-MM-DD')}
                </td>
                {weeklySchedule
                  .filter((item) => moment(item.Date).isSame(day, 'day'))
                  .map((item) => (
                    <td key={`${item.Date}-${item.Time}`}className="time-slot">
                     
                      {moment(day).isBefore(moment(), 'day') ? (
                        'Past'
                      ) : (
                        <div>
                          <div>
                          {(item.Time === '13:00' || item.Time === '18:00') && <br/>}
                          </div>
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(item.Date, item.Time)}
                          />
                          {item.Time}
                        </div>
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySchedule; 
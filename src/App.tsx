import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './App.css';
import { useQueryParam } from './hooks/useQueryParam';

const useCountdownCount = () => {
  const [urlHour] = useQueryParam('hour');
  const [urlMinute] = useQueryParam('minute');
  const startTime = new Date();

  startTime.setHours(parseInt(urlHour));
  startTime.setMinutes(parseInt(urlMinute));
  startTime.setSeconds(0);

  return startTime;
};

const getHMS = (startTime: Date) => {
  const currentTime = new Date();
  const ms = startTime.getTime() - currentTime.getTime();

  if (ms < 0) {
    return '00:00';
  }
  return msToTime(ms);
};

function msToTime(s: number) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n: number, z: number = 2) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  const minuteSecond = pad(mins) + ':' + pad(secs);

  if (hrs > 0) {
    return pad(hrs) + ':' + minuteSecond;
  }

  return minuteSecond;
}

function App() {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const countdown = useCountdownCount();

  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    setTimeLeft(getHMS(countdown));
    return () => clearTimeout(timer);
  }, [count, setCount]);

  return <div className="App">{timeLeft}</div>;
}

export default App;

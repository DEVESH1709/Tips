import React, { useState, useEffect } from 'react';

function TipForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(() => new Date().toLocaleString());
  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tipFormData') || 'null');
    if (saved) {
      setName(saved.name || '');
      setEmail(saved.email || '');
      setMessage(saved.message || '');
      setSubscribe(saved.subscribe || false);
      setCaptchaAnswer(saved.captchaAnswer || '');
      if (saved.captchaNum1 && saved.captchaNum2) {
        setCaptchaNum1(saved.captchaNum1);
        setCaptchaNum2(saved.captchaNum2);
      }
    }
  }, []);

 
  useEffect(() => {
    const data = {
      name, email, message, subscribe,
      captchaNum1, captchaNum2, captchaAnswer
    };
    localStorage.setItem('tipFormData', JSON.stringify(data));
  }, [name, email, message, subscribe, captchaNum1, captchaNum2, captchaAnswer]);

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Invalid email address';
      }
    }
    if (message.trim().length < 50) {
      newErrors.message = 'Message must be at least 50 characters';
    }
    const expectedSum = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer, 10) !== expectedSum) {
      newErrors.captcha = 'Incorrect CAPTCHA answer';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    const tipData = {
      name: name.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
      subscribe,
      date: new Date().toISOString()
    };

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/tips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tipData),
      });
      if (!response.ok) throw new Error('Submission failed');
     
      setSuccessMessage('Thank you! Your tip has been submitted.');
      setName('');
      setEmail('');
      setMessage('');
      setSubscribe(false);
      setCaptchaAnswer('');
  
      localStorage.removeItem('tipFormData');
   
      setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
      setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
     
      setDateDisplay(new Date().toLocaleString());
      setErrors({});
    } catch (error) {
      setSuccessMessage('Error submitting tip. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Submit a Tip</h2>
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Full Name (optional):
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        <label>Email Address (optional):
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        {errors.email && <div className="error">{errors.email}</div>}

        <label>Message (min 50 chars):*
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </label>
        {errors.message && <div className="error">{errors.message}</div>}

        <label>
          <input
            type="checkbox"
            checked={subscribe}
            onChange={e => setSubscribe(e.target.checked)}
          />
          Subscribe to bataSutra newsletter
        </label>

        <label>Submission Date:
          <input
            type="text"
            value={dateDisplay}
            readOnly
          />
        </label>

        <label>Solve: {captchaNum1} + {captchaNum2} = ?
          <input
            type="number"
            value={captchaAnswer}
            onChange={e => setCaptchaAnswer(e.target.value)}
          />
        </label>
        {errors.captcha && <div className="error">{errors.captcha}</div>}

        <button type="submit">Submit Tip</button>
      </form>
    </div>
  );
}

export default TipForm;

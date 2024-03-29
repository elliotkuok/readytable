import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "./LoginForm.css";
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { SignUpForm } from './SignUpForm';
import { receiveCreateUserErrors } from '../../store/errorsReducer';

function LoginForm({onClose}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailInDatabase, setEmailInDatabase] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const errors = useSelector(state => state.errors.createUser)

  useEffect(() => {
    if (email) {
      (async () => {
        try {
          const response = await fetch(`/api/users/check_email?email=${email}`);
          const data = await response.json();
          setEmailInDatabase(data.isValid);
        } catch (error) {
          console.error("Error checking email validity:", error);
        }
      })();
    }

    if (emailInDatabase && !showPasswordInput) {
      setContinueButtonDisabled(false);
    }

  }, [email, emailInDatabase, password, showPasswordInput, firstName, lastName, phoneNumber]);

  useEffect(() => {
    if (emailInDatabase && continueButtonDisabled && !showPasswordInput) {
      setContinueButtonDisabled(false);
    }
  }, [emailInDatabase, continueButtonDisabled]);

  useEffect(() => {
    setContinueButtonDisabled(areErrorsPresent());
  }, [errors]);
  

  useEffect(() => {
    return () => {
      dispatch(receiveCreateUserErrors([])); 
    };
  }, [onClose]);

  const areErrorsPresent = () => {
    return Object.values(errors).some(error => error !== undefined);
  };

  const clearError = (field) => {
    dispatch(receiveCreateUserErrors({ ...errors, [field]: undefined }));
  };

  useEffect(() => {
      if (errors.password) clearError('password');
      if (!areErrorsPresent()) setContinueButtonDisabled(false);
  }, [password]);

  useEffect(() => {
      if (errors.first_name) clearError('first_name');
  }, [firstName]);

  useEffect(() => {
      if (errors.last_name) clearError('last_name');
  }, [lastName]);

  useEffect(() => {
      if (errors.phone_number) clearError('phone_number');
  }, [phoneNumber]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const isValid = isEmailValid(e.target.value);
    setEmailInDatabase(isValid);
    document.getElementById("invalid-email").innerHTML = "";
  };

  const handleContinue = (e) => {
    if (!showPasswordInput) {
      e.preventDefault();
      if (isEmailValid(email)) {
        setSubmittedEmail(email);
        setContinueButtonDisabled(false);
        setShowPasswordInput(true);
        if (emailInDatabase) {
        } else {
          setPassword("");
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
          setShowPasswordInput(true);
          setShowAdditionalInputs(true);
        }
      } else {
        setContinueButtonDisabled(true);
        document.getElementById("invalid-email").innerHTML = "Please use valid email format";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (showPasswordInput && emailInDatabase) {
      try {
        await dispatch(sessionActions.login({ email, password }));
        onClose();
      } catch (error) {
        // Handle login errors
        console.error('Error logging in:', error);
      }
    } else {
      const newUser = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      };
  
      try {
        await dispatch(sessionActions.signup(newUser));
        // You can add a login action here for the new user if needed
        // onClose();
      } catch (error) {
        // Handle signup errors
        console.error('Error signing up:', error);
      }
    }

      return dispatch(sessionActions.login({ email, password }))
      .then(() => {
        // onClose();
      })
      .catch(async (res) => {
        let data;
        try {
          data = await res.clone().json();
        } catch {
          data = await res.text();
        }
        setContinueButtonDisabled(true); 
      });
  };

  const handleDemoLogin = async () => {
    const demoUserCredentials = {
      email: 'demo@user.io', 
      password: 'password', 
    };

    try {
      await dispatch(sessionActions.login(demoUserCredentials));
      onClose(); // Close the modal after successful demo login
    } catch (error) {
      console.error('Error logging in with demo account:', error);
    }
  };

  const handleBack = () => {
    setShowPasswordInput(false);
    setShowAdditionalInputs(false);
    setContinueButtonDisabled(false);
    setEmail(submittedEmail);
    dispatch(receiveCreateUserErrors([]));
  };
  
  const handleClose = () => {
    dispatch(receiveCreateUserErrors([]));
    onClose();
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  }

  return (
    <>
    <div className="login-form" onClick={stopPropagation}>
      {showPasswordInput && (
        <i className="back-icon" onClick={handleBack}>
          &lt; {/* Use HTML entity for "<" */}
        </i> 
    )}
        <div className="x-icon" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>


      <form onSubmit={handleSubmit}>
        {showPasswordInput ? (
          showAdditionalInputs ? (
            <SignUpForm
              email={email}
              password={password}
              setPassword={setPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              continueButtonDisabled={continueButtonDisabled}
              errors={errors}
            />
          ) : (
            <PasswordInput password={password} setPassword={setPassword} continueButtonDisabled={continueButtonDisabled} />
          )
        ) : (
          <EmailInput email={email} handleEmailChange={handleEmailChange} continueButtonDisabled={continueButtonDisabled} handleContinue={handleContinue} />
        )}
      </form>
      <Link to="#" className="demo-user" onClick={handleDemoLogin}>
        Use demo user instead
      </Link>
    </div>
    </>
  );
}

export default LoginForm;
import { useState } from "react";
import "./register.css";

const sendRegistration = async (data) => {
  try {
    console.log("🚀 Sending registration data:", data);
    
    const response = await fetch("https://backend-esc.onrender.com/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    console.log("📡 Response status:", response.status);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    const result = await response.json();
    console.log("📦 Response data:", result);

    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || "Failed to register user",
        status: response.status,
      };
    }

    console.log("✅ User registered successfully:", result);
    return {
      success: true,
      data: result,
      message: "Registration successful",
    };
  } catch (error) {
    console.error("❌ Network error:", error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        error: "Unable to connect to server. Please check if the server is running.",
        networkError: true,
      };
    }
    
    return {
      success: false,
      error: error.message || "Network error. Please check your connection.",
      networkError: true,
    };
  }
};

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [level, setLevel] = useState("");
  const [date, setDate] = useState("");
  const [experience, setExperience] = useState("");
  const [customLevel, setCustomLevel] = useState("");
  const [discord, setDiscord] = useState("");
  const [institution, setInstitution] = useState("");
  const [priorities, setPriorities] = useState([
    { department: "", answer: "" },
    { department: "", answer: "" },
    { department: "", answer: "" },
  ]);

  // Error handling states
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showError, setShowError] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const validatePhone = (phone) => {
  const phoneRegex = /^0[5-7]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

  const validateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 13 && age <= 100; // Reasonable age range
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal information validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!date) {
      newErrors.date = "Date of birth is required";
    } else if (!validateAge(date)) {
      newErrors.date = "Please enter a valid date of birth (age 13-100)";
    }

    if (!discord.trim()) {
      newErrors.discord = "Discord ID is required";
    } else if (discord.trim().length < 3) {
      newErrors.discord = "Discord ID must be at least 3 characters";
    }

    
    if (!level && !customLevel) {
      newErrors.level = "Study level is required";
    }

    if (level === "other" && !customLevel.trim()) {
      newErrors.customLevel = "Please specify your level of study";
    }

    if (!institution.trim()) {
      newErrors.institution = "Institution is required";
    } else if (institution.trim().length < 2) {
      newErrors.institution = "Institution name must be at least 2 characters";
    }

    if (!experience.trim()) {
      newErrors.experience = "Experience information is required";
    } else if (experience.trim().length < 10) {
      newErrors.experience = "Please provide more details about your experience (at least 10 characters)";
    }

    if (!message.trim()) {
      newErrors.motivation = "Motivation is required";
    } else if (message.trim().length < 20) {
      newErrors.motivation = "Please provide more details about your motivation (at least 20 characters)";
    }

    // Priorities validation
    const selectedDepartments = new Set();
    priorities.forEach((priority, index) => {
      if (!priority.department) {
        newErrors[`priority${index + 1}Dept`] = `Priority ${index + 1} department is required`;
      } else if (selectedDepartments.has(priority.department)) {
        newErrors[`priority${index + 1}Dept`] = "Each department can only be selected once";
      } else {
        selectedDepartments.add(priority.department);
      }

      if (!priority.answer.trim()) {
        newErrors[`priority${index + 1}Answer`] = `Priority ${index + 1} reason is required`;
      } else if (priority.answer.trim().length < 10) {
        newErrors[`priority${index + 1}Answer`] = "Please provide more details (at least 10 characters)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const clearGeneralError = () => {
    setGeneralError("");
    setShowError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Clear previous errors
    setErrors({});
    setGeneralError("");
    setShowError(false);

    // Validate form
    if (!validateForm()) {
      setGeneralError("Please fix the errors below before submitting.");
      setShowError(true);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await sendRegistration({
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        dateOfBirth: date,
        study_level: level === "other" ? customLevel.trim() : level,
        experience: experience.trim(),
        motivation: message.trim(),
        discordId: discord.trim(),
        institution: institution.trim(),
        Department: priorities,
      });

      if (result.success) {
        setShowSuccess(true);
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setLevel("");
        setDate("");
        setExperience("");
        setCustomLevel("");
        setDiscord("");
        setInstitution("");
        setPriorities([
          { department: "", answer: "" },
          { department: "", answer: "" },
          { department: "", answer: "" },
        ]);
        setErrors({});
        setGeneralError("");
        setShowError(false);
      } else {
        // Handle specific server errors
        if (result.status === 400) {
          setGeneralError("Invalid data submitted. Please check your information and try again.");
        } else if (result.status === 409) {
          setGeneralError("This email is already registered. Please use a different email address.");
        } else if (result.status === 429) {
          setGeneralError("Too many registration attempts. Please try again later.");
        } else if (result.networkError) {
          setGeneralError("Network error: Unable to connect to the server. Please check your internet connection and try again.");
        } else {
          setGeneralError(result.error || "Registration failed. Please try again.");
        }
        setShowError(true);
        console.error("Registration failed:", result);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePriority = (index, field, value) => {
    setPriorities((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
    
    // Clear related errors when user makes changes
    if (field === "department") {
      clearError(`priority${index + 1}Dept`);
    } else if (field === "answer") {
      clearError(`priority${index + 1}Answer`);
    }
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <div className="error-message" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</div>;
  };

  const GeneralErrorAlert = ({ show, message, onClose }) => {
    if (!show) return null;
    
    return (
      <div className="alert alert-error" style={{ 
        backgroundColor: '#f8d7da', 
        color: '#721c24', 
        padding: '1rem', 
        borderRadius: '0.375rem', 
        marginBottom: '1rem',
        border: '1px solid #f5c2c7',
        position: 'relative'
      }}>
        <strong>Error:</strong> {message}
        <button 
          type="button" 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '0.5rem', 
            right: '0.5rem', 
            background: 'none', 
            border: 'none', 
            fontSize: '1.25rem', 
            cursor: 'pointer',
            color: '#721c24'
          }}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div id='register' className="register">
      <div className="texts">
        <h2 className='lider'>JOIN ESC</h2>
        <p className='amine'>Where Curiosity Meets Community</p>
      </div>
      
      {showSuccess ? (
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
          <h3 className="success-title">Registration Successful!</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <GeneralErrorAlert 
            show={showError} 
            message={generalError} 
            onClose={clearGeneralError} 
          />
          
          <div className="personal">
            <h3 className="pers">Personal Informations : </h3>
            <div className="perso">
              <div className='f_input'>
                <div>
                  <input 
                    required 
                    type='text' 
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearError('firstName');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.firstName ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.firstName} />
                </div>
                <div>
                  <input 
                    required 
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearError('lastName');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.lastName ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.lastName} />
                </div>
              </div>
              
              <div className='f_input'>
                <div>
                  <input 
                    required 
                    type='email' 
                    placeholder="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError('email');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.email ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.email} />
                </div>
                <div>
                  <input 
                    required 
                    type='tel' 
                    placeholder="phone number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearError('phone');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.phone ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.phone} />
                </div>
              </div>

              <div className='f_input'>
                <div>
                  <input 
                    required 
                    type='date' 
                    placeholder="date de naissance"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      clearError('date');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.date ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.date} />
                </div>
                <div>
                  <input 
                    required 
                    type='text' 
                    placeholder="Discord Id"
                    value={discord}
                    onChange={(e) => {
                      setDiscord(e.target.value);
                      clearError('discord');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.discord ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.discord} />
                </div>
              </div>
            </div>
          </div>

          <div className="more">
            <h3 className="pers">More About you : </h3>
            <div className="rigli">
              <div className="f_input">
                <div>
                  {level !== "other" ? (
                    <select
                      className="select2"
                      required
                      value={level}
                      onChange={(e) => {
                        setLevel(e.target.value);
                        clearError('level');
                      }}
                      style={{ borderColor: errors.level ? '#dc3545' : '' }}
                    >
                      <option value="" disabled hidden>
                        What is your level of study?
                      </option>
                      <option value="1st">1st year High School</option>
                      <option value="2nd">2nd year High School</option>
                      <option value="3rd">3rd year High School</option>
                      <option value="bachelor1">1st year Bachelor's degree</option>
                      <option value="bachelor2">2nd year Bachelor's degree</option>
                      <option value="bachelor3">3rd year Bachelor's degree</option>
                      <option value="master1">1st year Master's degree</option>
                      <option value="master2">2nd year Master's degree</option>
                      <option value="doctorate">Doctorate</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="input-flex">
                      <button
                        type="button"
                        className="arrow-btn"
                        onClick={() => {
                          setLevel("");
                          setCustomLevel("");
                          clearError('customLevel');
                        }}
                      >
                        ←
                      </button>
                      <input
                        type="text"
                        className="select2"
                        placeholder="Enter your level of study"
                        value={customLevel}
                        onChange={(e) => {
                          setCustomLevel(e.target.value);
                          clearError('customLevel');
                        }}
                        required
                        style={{ borderColor: errors.customLevel ? '#dc3545' : '' }}
                      />
                    </div>
                  )}
                  <ErrorMessage error={errors.level || errors.customLevel} />
                </div>

                <div>
                  <input 
                    required 
                    type='text' 
                    placeholder="Institution"
                    value={institution}
                    onChange={(e) => {
                      setInstitution(e.target.value);
                      clearError('institution');
                    }}
                    disabled={isSubmitting}
                    style={{ borderColor: errors.institution ? '#dc3545' : '' }}
                  />
                  <ErrorMessage error={errors.institution} />
                </div>
              </div>

              <div>
                <textarea 
                  className="role2"
                  required 
                  type='role' 
                  placeholder="Have you ever joined a club? if yes Specify name and role."
                  value={experience}
                  onChange={(e) => {
                    setExperience(e.target.value);
                    clearError('experience');
                  }}
                  disabled={isSubmitting}
                  style={{ borderColor: errors.experience ? '#dc3545' : '' }}
                />
                <ErrorMessage error={errors.experience} />
              </div>

              <div>
                <textarea 
                  required 
                  placeholder="What motivate you to join us"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearError('motivation');
                  }}
                  disabled={isSubmitting}
                  style={{ borderColor: errors.motivation ? '#dc3545' : '' }}
                />
                <ErrorMessage error={errors.motivation} />
              </div>
            </div>
          </div>

          <div className="priorities">
            <h2 className="pers">Choose your Department : </h2>
            
            {[1, 2, 3].map((priorityNum) => (
              <div key={priorityNum} className="prio">
                <h4 className="tit">priority{priorityNum} : </h4>
                <div className="prio2">
                  <div>
                    <select 
                      className="select1"
                      required
                      value={priorities[priorityNum - 1].department}
                      onChange={(e) => updatePriority(priorityNum - 1, "department", e.target.value)}
                      disabled={isSubmitting}
                      style={{ borderColor: errors[`priority${priorityNum}Dept`] ? '#dc3545' : '' }}
                    >
                      <option value="" disabled hidden>Department</option>
                      <option value="dev">Dev</option>
                      <option value="design">Design</option>
                      <option value="hr">Human Resources</option>
                      <option value="marketing">Marketing</option>
                      <option value="planing">Planning</option>
                      <option value="finance">Finance</option>
                      <option value="external">External Relations</option>
                      <option value="edit">Video Editing</option>
                      <option value="Multi">Media Management</option>
                    </select>
                    <ErrorMessage error={errors[`priority${priorityNum}Dept`]} />
                  </div>
                  
                  <div>
                    <textarea 
                      className="role2"
                      required 
                      type='role' 
                      placeholder="Why?"
                      value={priorities[priorityNum - 1].answer}
                      onChange={(e) => updatePriority(priorityNum - 1, "answer", e.target.value)}
                      disabled={isSubmitting}
                      style={{ borderColor: errors[`priority${priorityNum}Answer`] ? '#dc3545' : '' }}
                    />
                    <ErrorMessage error={errors[`priority${priorityNum}Answer`]} />
                  </div>
                </div>
              </div>
            ))}
          </div> 
          
          <button 
            className='join1' 
            type="submit"
            disabled={isSubmitting}
          >
            <p>{isSubmitting ? "REGISTERING..." : "REGISTER"}</p>
          </button>
        </form>
      )}
    </div>
  );
}
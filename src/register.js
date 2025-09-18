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
  const[level , setLevel] = useState("");
  const[date , setDate] = useState("");
  const[role , setRole] = useState("");
  const [customLevel,setCustomLevel] =useState("");
  const [discord , setDiscord] = useState("");
  const [institution , setInstitution] = useState("");
  const [priorities, setPriorities] = useState([
  { department: "", reason: "" },
  { department: "", reason: "" },
  { department: "", reason: "" },
]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const result = await sendRegistration({
        FirstName: firstName,
        LastName: lastName,
        email: email,
        phoneNumber: phone,
        motivation: message,
        Level : level,
        Date : date,
        Role : role,
        CustomLevel : customLevel,
        Discord : discord,
        Institution : institution ,
        Priority: priorities ,
        
      });

      if (result.success) {
        setShowSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setLevel("");
        setDate("");
        setRole("");
        setCustomLevel("");
        setDiscord("");
        setInstitution("");
        setPriorities([
      { department: "", reason: "" },
      { department: "", reason: "" },
      { department: "", reason: "" },
  ]);
      } else {
        alert("❌ " + result.error);
        console.error("Registration failed:", result);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ An unexpected error occurred");
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
};

  return (
    <div id ='register' className="register">
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
          <div className="personal">
          <h3 className="pers">Personnal Informations : </h3>
          <div className="perso">
          <div className='f_input'>
            <input 
              required 
              type='text' 
              pattern="[A-Za-z]+"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
            />
            <input 
              required 
              type="text"
              pattern="[A-Za-z]+"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className='f_input'>
            <input 
              required 
              type='email' 
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <input 
              required 
              type='tel' 
              placeholder="phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className='f_input'>
            <input 
              required 
              type='date' 
              placeholder="date de naissance"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
            />
            <input 
              required 
              type='text' 
              placeholder="Discord Id"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              disabled={isSubmitting}
            />
          </div>


        </div>
        </div>
      <div className="more">
      <h3 className="pers">More About you : </h3>
      <div className="rigli">
      <div className="f_input">
    {level !== "other" ? (
  <select
    className="select2"
    required
    value={level}
    onChange={(e) => setLevel(e.target.value)}
  >
    <option value="" disabled hidden>
      What is your level of study?
    </option>
    <option value="1st">1st year High School</option>
    <option value="2nd">2nd year High School</option>
    <option value="3rd">3rd year High School</option>
    <option value="bachelor1">1st year Bachelor’s degree</option>
    <option value="bachelor2">2nd year Bachelor’s degree</option>
    <option value="bachelor3">3rd year Bachelor’s degree</option>
    <option value="master1">1st year Master’s degree</option>
    <option value="master2">2nd year Master’s degree</option>
    <option value="doctorate">Doctorate</option>
    <option value="other">Other</option>
  </select>
) : (
  <div className="input-flex">
    <button
      type="button"
      className="arrow-btn"
      onClick={() => setLevel("")}
    >
      ←
    </button>
    <input
      type="text"
      className="select2"
      placeholder="Enter your level of study"
      value={customLevel}
      onChange={(e) => setCustomLevel(e.target.value)}
      required
    />
  </div>
)}


      <input 
              required 
              type='text' 
              placeholder="Institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              disabled={isSubmitting}
            />
            
          
    

    </div>
    <textarea  className="role2"
              required 
              type='role' 
              placeholder="Have you ever joined a club? if yes Specify name and role."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
            />

            <textarea 
            required 
            placeholder="What motivate you to join us"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          />

    </div>
    </div>

        <div className="priorities">
        <h2 className="pers">Choose your Departement : </h2>
        <div className="prio">
          <h4 className="tit">priority1 : </h4>
          <div className="prio2">
          <select className="select1"
            required
            value={priorities[0].department}
            onChange={(e) => updatePriority(0, "department", e.target.value)}
            disabled={isSubmitting}
          >
            <option value="" disabled hidden>Departement</option>
            <option value="dev">Dev</option>
            <option value="design">Design</option>
            <option value="hr">Human Resources</option>
            <option value="marketing">Marketing</option>
            <option value="planing">Planing</option>
            <option value="finance">Finance</option>
            <option value="external">External Relations</option>
            <option value="edit">Video Editing</option>
            <option value="Multi">Multimidia</option>
          </select>
          <textarea  className="role2"
              required 
              type='role' 
              placeholder="Why?"
              value={priorities[0].reason}
              onChange={(e) => updatePriority(0, "reason", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="prio">
          <h4 className="tit">priority2 : </h4>
          <div className="prio2">

          <select className="select1"
            required
            value={priorities[1].department}
            onChange={(e) => updatePriority(1, "department", e.target.value)}
            disabled={isSubmitting}
          >
            <option value="" disabled hidden>Departement</option>
            <option value="dev">Dev</option>
            <option value="design">Design</option>
            <option value="hr">Human Resources</option>
            <option value="marketing">Marketing</option>
            <option value="planing">Planing</option>
            <option value="finance">Finance</option>
            <option value="external">External Relations</option>
            <option value="edit">Video Editing</option>
            <option value="Multi">Multimidia</option>
          </select>
          <textarea  className="role2"
              required 
              type='role' 
              placeholder="Why?"
              value={priorities[1].reason}
              onChange={(e) => updatePriority(1, "reason", e.target.value)}
              disabled={isSubmitting}
            />
            </div>
        </div>

        <div className="prio">
          <h4 className="tit">priority3 : </h4>

          <div className="prio2">
          <select className="select1"
            required
            value={priorities[2].department}
            onChange={(e) => updatePriority(2, "department", e.target.value)}
            disabled={isSubmitting}
          >
            <option value="" disabled hidden>Departement</option>
            <option value="dev">Dev</option>
            <option value="design">Design</option>
            <option value="hr">Human Resources</option>
            <option value="marketing">Marketing</option>
            <option value="planing">Planing</option>
            <option value="finance">Finance</option>
            <option value="external">External Relations</option>
            <option value="Editing">Video Editing</option>
            <option value="Multi">Multimidia</option>
          </select>
          <textarea  className="role2"
              required 
              type='role' 
              placeholder="Why?"
              value={priorities[2].reason}
              onChange={(e) => updatePriority(2, "reason", e.target.value)}
              disabled={isSubmitting}
            />
            </div>
        </div>
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
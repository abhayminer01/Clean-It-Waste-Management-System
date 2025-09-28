import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localbodyData from "../services/localbody.json";
import { userRegistration } from '../services/auth-api';
import { User, Mail, Lock, FileText, Phone, Home, MapPin, Building2, Users, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const [district, setDistrict] = useState("");
    const [localbodyType, setLocalbodyType] = useState("");
    const [localbodyOptions, setLocalbodyOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const districts = Object.keys(localbodyData);
    
    const navigate = useNavigate();

    useEffect(() => {
      if (district && localbodyType) {
        const options = localbodyData[district]?.[localbodyType] || [];
        setLocalbodyOptions(options);
      } else {
        setLocalbodyOptions([]);
      }
    }, [district, localbodyType]);

    const handleForm = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      const name = e.target.name.value.trim();
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      const confirmPassword = e.target.confirm.value;
      const adhaar = e.target.adhaar.value.trim();
      const mobile = e.target.mobile.value.trim();
      const house = e.target.house.value.trim();
      const street = e.target.street.value.trim();
      const town = e.target.town.value.trim();
      const pin = e.target.pin.value.trim();
      const districtVal = e.target.district.value;
      const localbodyTypeVal = e.target.localbodytype.value;
      const localbodyName = e.target.localbodyname.value;

      const address = `${house}, ${street}, ${town} PIN:${pin}`;

      // Regex patterns
      const nameRegex = /^[A-Za-z\s]{2,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      const mobileRegex = /^[6-9]\d{9}$/;
      const adhaarRegex = /^\d{12}$/;
      const pinRegex = /^\d{6}$/;
      const addressRegex = /^[A-Za-z0-9\s,.-]{2,}$/;

      // Mandatory fields check
      if (!name || !email || !password || !confirmPassword || !adhaar || !mobile || !house || !street || !town || !pin || !districtVal || !localbodyTypeVal || !localbodyName) {
          setIsLoading(false);
          return setError("All fields are required.");
      }

      // Field validations
      if (!nameRegex.test(name)) {
          setIsLoading(false);
          return setError("Full name must be at least 2 letters and only contain letters and spaces.");
      }
      if (!emailRegex.test(email)) {
          setIsLoading(false);
          return setError("Invalid email address.");
      }
      if (!passwordRegex.test(password)) {
          setIsLoading(false);
          return setError("Password must be at least 6 characters, include uppercase, lowercase, and a number.");
      }
      if (password !== confirmPassword) {
          setIsLoading(false);
          return setError("Passwords do not match.");
      }
      if (!mobileRegex.test(mobile)) {
          setIsLoading(false);
          return setError("Mobile number must be 10 digits starting with 6-9.");
      }
      if (!adhaarRegex.test(adhaar)) {
          setIsLoading(false);
          return setError("Aadhaar number must be exactly 12 digits.");
      }
      if (!pinRegex.test(pin)) {
          setIsLoading(false);
          return setError("PIN code must be exactly 6 digits.");
      }
      if (!addressRegex.test(house) || !addressRegex.test(street) || !addressRegex.test(town)) {
          setIsLoading(false);
          return setError("Address fields can contain letters, numbers, spaces, commas, periods, or hyphens.");
      }

      const payload = {
          full_name: name,
          email,
          password,
          adhaar,
          mobile_number: mobile,
          address,
          district: districtVal,
          localbody_type: localbodyTypeVal,
          localbody_name: localbodyName
      };

      try {
          const res = await userRegistration(payload);
          setIsLoading(false);

          if (res?.success) {
              navigate("/home");
          } else {
              setError(res?.message || "Failed to Register!");
          }
      } catch (err) {
          setIsLoading(false);
          setError("An unexpected error occurred. Please try again.");
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join CleanIt and start your eco-friendly waste management journey</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleForm} className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="adhaar" className="block text-sm font-medium text-gray-700 mb-2">
                  Adhaar Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="adhaar"
                    name="adhaar"
                    type="number"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter 12-digit Aadhaar number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="mobile"
                    name="mobile"
                    type="number"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="house" className="block text-sm font-medium text-gray-700 mb-2">
                    House Name/Number
                  </label>
                  <input
                    id="house"
                    name="house"
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter house name or number"
                  />
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                    Street
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter street name"
                  />
                </div>

                <div>
                  <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-2">
                    Town/City
                  </label>
                  <input
                    id="town"
                    name="town"
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter town or city"
                  />
                </div>

                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    id="pin"
                    name="pin"
                    type="number"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter 6-digit PIN code"
                  />
                </div>
              </div>
            </div>

            {/* Location Selection Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setLocalbodyType("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    required
                    disabled={isLoading}
                  >
                    <option value="">-- Select District --</option>
                    {districts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="localbodytype" className="block text-sm font-medium text-gray-700 mb-2">
                    Localbody Type
                  </label>
                  <select
                    id="localbodytype"
                    name="localbodytype"
                    value={localbodyType}
                    onChange={(e) => setLocalbodyType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    required
                    disabled={!district || isLoading}
                  >
                    <option value="">-- Select Type --</option>
                    {district && (
                      <>
                        {localbodyData[district]?.corporation?.length > 0 && (
                          <option value="corporation">Corporation</option>
                        )}
                        {localbodyData[district]?.municipality?.length > 0 && (
                          <option value="municipality">Municipality</option>
                        )}
                        {localbodyData[district]?.panchayath?.length > 0 && (
                          <option value="panchayath">Panchayath</option>
                        )}
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="localbodyname" className="block text-sm font-medium text-gray-700 mb-2">
                    Localbody Name
                  </label>
                  <select
                    id="localbodyname"
                    name="localbodyname"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                    required
                    disabled={!localbodyType || isLoading}
                  >
                    <option value="">-- Select Localbody --</option>
                    {localbodyOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Alternative Options */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate('/industry/register')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Building2 className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
              <span className="text-gray-700 group-hover:text-emerald-600 font-medium">
                Register as Industrial User
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import localbodyData from "../../services/localbody.json";
import { registerIndustry } from '../../services/industry-api';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, FileText, MapPin, Home, Loader2, AlertCircle, CheckCircle, Users } from 'lucide-react';

export default function Register() {
    const [district, setDistrict] = useState("");
    const [localbodyType, setLocalbodyType] = useState("");
    const [localbodyOptions, setLocalbodyOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");

        const form = e.target;
        const name = form.name.value.trim();
        const licence = form.licence.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const contact = form.contact.value.trim();
        const building = form.building.value.trim();
        const street = form.street.value.trim();
        const town = form.town.value.trim();
        const pin = form.pin.value.trim();
        const districtVal = form.district.value;
        const localbodyTypeVal = form.localbodytype.value;
        const localbodyName = form.localbodyname.value;
        const address = `${building}, ${street}, ${town} PIN:${pin}`;

        // Regex patterns
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const licenceRegex = /^[A-Za-z0-9-]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactRegex = /^[6-9]\d{9}$/;
        const pinRegex = /^\d{6}$/;
        const addressRegex = /^[A-Za-z0-9\s,.-]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        // Mandatory fields
        if (!name || !licence || !email || !password || !confirmPassword || !contact || !building || !street || !town || !pin || !districtVal || !localbodyTypeVal || !localbodyName) {
            return setError("All fields are required.");
        }

        // Field validations
        if (!nameRegex.test(name)) return setError("Industry name must be at least 2 letters and only contain letters and spaces.");
        if (!licenceRegex.test(licence)) return setError("Licence number can only contain letters, numbers, and hyphens.");
        if (!emailRegex.test(email)) return setError("Invalid email address.");
        if (!contactRegex.test(contact)) return setError("Contact number must be 10 digits starting with 6-9.");
        if (!passwordRegex.test(password)) return setError("Password must be at least 6 characters, include uppercase, lowercase, and a number.");
        if (password !== confirmPassword) return setError("Passwords do not match.");
        if (!pinRegex.test(pin)) return setError("PIN code must be exactly 6 digits.");
        if (!addressRegex.test(building) || !addressRegex.test(street) || !addressRegex.test(town)) return setError("Address fields can contain letters, numbers, spaces, commas, periods, or hyphens.");
        
        const payload = { email, password, licence, name, contact, address, district: districtVal, localbody_type: localbodyTypeVal, localbody_name: localbodyName };

        try {
            setIsLoading(true);
            const res = await registerIndustry(payload);
            setIsLoading(false);

            if (res?.success) {
                setSuccess("Industry registered successfully! Redirecting to dashboard...");
                setTimeout(() => navigate("/industry/home"), 2000);
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
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Industry</h1>
                    <p className="text-gray-600">Join CleanIt's industrial waste management network</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleForm} className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
                    <div className="space-y-6">
                        {/* Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {success}
                            </div>
                        )}

                        {/* Business Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                                Business Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Industry Name</label>
                                    <input type="text" name="name" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Enter industry name" />
                                </div>

                                <div>
                                    <label htmlFor="licence" className="block text-sm font-medium text-gray-700 mb-2">Licence Number</label>
                                    <input type="text" name="licence" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Enter licence number" />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" name="email" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Enter email" />
                                </div>

                                <div>
                                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                    <input type="tel" name="contact" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="10-digit contact number" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" name="password" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Enter password" />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                    <input type="password" name="confirmPassword" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Re-enter password" />
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                                Business Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" name="building" placeholder="Building/Factory" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                                <input type="text" name="street" placeholder="Street/Area" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                                <input type="text" name="town" placeholder="Town/City" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                                <input type="number" name="pin" placeholder="PIN Code" required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                            </div>
                        </div>

                        {/* Location Selection Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                                Location Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <select name="district" value={district} onChange={(e)=>{setDistrict(e.target.value); setLocalbodyType("");}} required disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                                    <option value="">-- Select District --</option>
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select name="localbodytype" value={localbodyType} onChange={(e)=>setLocalbodyType(e.target.value)} required disabled={!district || isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                                    <option value="">-- Select Type --</option>
                                    {district && <>
                                        {localbodyData[district]?.corporation?.length >0 && <option value="corporation">Corporation</option>}
                                        {localbodyData[district]?.municipality?.length >0 && <option value="municipality">Municipality</option>}
                                        {localbodyData[district]?.panchayath?.length >0 && <option value="panchayath">Panchayath</option>}
                                    </>}
                                </select>
                                <select name="localbodyname" required disabled={!localbodyType || isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                                    <option value="">-- Select Localbody --</option>
                                    {localbodyOptions.map(name => <option key={name} value={name}>{name}</option>)}
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70">
                            {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Registering...</> : "Register Industry"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">Already registered? <button onClick={()=>navigate('/industry/login')} className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline" disabled={isLoading}>Sign In</button></p>
                </div>
            </div>
        </div>
    );
}

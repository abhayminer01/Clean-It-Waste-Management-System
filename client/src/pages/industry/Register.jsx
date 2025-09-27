import React, { useEffect, useState } from 'react';
import localbodyData from "../../services/localbody.json";
import { registerIndustry } from '../../services/industry-api';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, FileText, MapPin, Home, Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

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
        setIsLoading(true);
        setError("");
        setSuccess("");

        const building = e.target.building.value;
        const street = e.target.street.value;
        const town = e.target.town.value;
        const pin = e.target.pin.value;
        const address = `${building},${street},${town} PIN:${pin}`;

        const payload = {
            email: e.target.email.value,
            password: e.target.password.value,
            licence: e.target.licence.value,
            name: e.target.name.value,
            address,
            district: e.target.district.value,
            localbody_type: e.target.localbodytype.value,
            localbody_name: e.target.localbodyname.value,
        };

        try {
            const res = await registerIndustry(payload);
            setIsLoading(false);
                  
            if (res?.success) {
                setSuccess("Industry registered successfully! Redirecting to dashboard...");
                setTimeout(() => {
                    navigate("/industry/home");
                }, 2000);
            } else {
                setError(res?.message || "Failed to Register!");
            }
        } catch (err) {
            setIsLoading(false);
            setError("An unexpected error occurred. Please try again.");
        }
    }

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

                        {/* Business Information Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                                Business Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Industry Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                                            placeholder="Enter your industry name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="licence" className="block text-sm font-medium text-gray-700 mb-2">
                                        Industry Licence Number
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="licence"
                                            name="licence"
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                                            placeholder="Enter licence number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Email
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
                                            placeholder="Enter business email"
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
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                                Business Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-2">
                                        Building/Factory Name
                                    </label>
                                    <input
                                        id="building"
                                        name="building"
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                                        placeholder="Enter building or factory name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                                        Street/Area
                                    </label>
                                    <input
                                        id="street"
                                        name="street"
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50"
                                        placeholder="Enter street or area"
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
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                                Location Details
                            </h2>
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
                                    Registering Industry...
                                </>
                            ) : (
                                "Register Industry"
                            )}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already registered your industry?{" "}
                        <button
                            onClick={() => navigate('/industry/login')}
                            className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                            disabled={isLoading}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
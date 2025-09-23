import React, { useEffect, useState } from 'react'
import localbodyData from "../services/localbody.json";

export default function RegisterPage() {
    const [district, setDistrict] = useState("");
    const [localbodyType, setLocalbodyType] = useState("");
    const [localbodyOptions, setLocalbodyOptions] = useState([]);
    const districts = Object.keys(localbodyData);

    useEffect(() => {
    if (district && localbodyType) {
      const options = localbodyData[district]?.[localbodyType] || [];
      setLocalbodyOptions(options);
    } else {
      setLocalbodyOptions([]);
    }
  }, [district, localbodyType]);

  return (
    <div>
        <form>
            <h1>Register User</h1>
            <div>
                <label>Full Name : </label>
                <input name='name' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Email : </label>
                <input name='email' className='border rounded-lg w-60' type="email" />
            </div>
            <div>
                <label>Password : </label>
                <input name='password' className='border rounded-lg w-60' type="password" />
            </div>
            <div>
                <label>Confirm Password : </label>
                <input name='confirm' className='border rounded-lg w-60' type="password" />
            </div>
            <div>
                <label>Full Name : </label>
                <input name='name' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Adhaar Number : </label>
                <input name='adhaar' className='border rounded-lg w-60' type="number" />
            </div>
            <div>
                <label>Mobile Number : </label>
                <input name='mobile' className='border rounded-lg w-60' type="number" />
            </div>
            <div>
                <label>House name : </label>
                <input name='house' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Street : </label>
                <input name='street' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Pin Number : </label>
                <input name='pin' className='border rounded-lg w-60' type="number" />
            </div>
            <div>
                <label>
                    District
                </label>
                <select
                    name="district"
                    value={district}
                    onChange={(e) => {
                        setDistrict(e.target.value);
                        setLocalbodyType("");
                    }}
                    className="w-full px-4 py-2 mt-1 border rounded-lg"
                    required
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
            <label>
              Localbody Type
            </label>
            <select
              name="localbodyType"
              value={localbodyType}
              onChange={(e) => setLocalbodyType(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg"
              required
              disabled={!district}
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
            <label className="block text-sm font-medium text-gray-600">
              Localbody Name
            </label>
            <select
              name="localbodyName"
              className="w-full px-4 py-2 mt-1 border rounded-lg"
              required
              disabled={!localbodyType}
            >
              <option value="">-- Select Localbody --</option>
              {localbodyOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <input type="submit"/>
        </form>
    </div>
  )
}
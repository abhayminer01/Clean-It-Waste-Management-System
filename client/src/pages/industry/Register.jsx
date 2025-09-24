import React, { useEffect, useState } from 'react';
import localbodyData from "../../services/localbody.json";
import { registerIndustry } from '../../services/industry-api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [district, setDistrict] = useState("");
    const [localbodyType, setLocalbodyType] = useState("");
    const [localbodyOptions, setLocalbodyOptions] = useState([]);
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

        const building = e.target.building.value;
        const street = e.target.street.value;
        const town = e.target.town.value;
        const pin = e.target.pin.value;
        const address = `${building},${street},${town} PIN:${pin}`;

        const payload = {
            email : e.target.email.value,
            password : e.target.password.value,
            licence : e.target.licence.value,
            name : e.target.name.value,
            address,
            district : e.target.district.value,
            localbody_type : e.target.localbodytype.value,
            localbody_name : e.target.localbodyname.value,
        };

        const res = await registerIndustry(payload);
              
        if (res?.success) {
            navigate("/industry/home");
        } else {
            alert(res?.message || "Failed to Register!");
        }
    }
  return (
    <div>
        <form onSubmit={handleForm} className='flex flex-col gap-10 items-center bg-green-100'>
            <h1>Register Industrial User</h1>
            <div>
                <label>Email : </label>
                <input name='email' className='border rounded-lg w-60' type="email" />
            </div>
            <div>
                <label>password : </label>
                <input name='password' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Confirm Password : </label>
                <input name='confirm' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Industry Licence Number : </label>
                <input name='licence' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Industry Name : </label>
                <input name='name' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Building name : </label>
                <input name='building' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Street : </label>
                <input name='street' className='border rounded-lg w-60' type="text" />
            </div>
            <div>
                <label>Town : </label>
                <input name='town' className='border rounded-lg w-60' type="text" />
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
              name="localbodytype"
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
              name="localbodyname"
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

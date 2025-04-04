// src/components/FuelCalculator.jsx
import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const FuelCalculator = () => {
    const [fuelData, setFuelData] = useState({
        petrolRate: '',
        petrolNew: '',
        petrolOld: '',
        dieselRate: '',
        dieselNew: '',
        dieselOld: '',
        cash: '',
        phonepe: '',
        paytm: '',
        cms: '',
        pine: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuelData({ ...fuelData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const petrolUsed = fuelData.petrolNew - fuelData.petrolOld;
        const dieselUsed = fuelData.dieselNew - fuelData.dieselOld;

        const petrolAmount = petrolUsed * fuelData.petrolRate;
        const dieselAmount = dieselUsed * fuelData.dieselRate;
        const totalAmount = petrolAmount + dieselAmount;

        const paidAmount =
            Number(fuelData.cash) +
            Number(fuelData.phonepe) +
            Number(fuelData.paytm) +
            Number(fuelData.cms) +
            Number(fuelData.pine);

        const remaining = totalAmount - paidAmount;

        const calculatedData = {
            petrol: {
                used: petrolUsed,
                rate: fuelData.petrolRate,
                amount: petrolAmount,
            },
            diesel: {
                used: dieselUsed,
                rate: fuelData.dieselRate,
                amount: dieselAmount,
            },
            totalAmount,
            payments: {
                cash: Number(fuelData.cash),
                phonepe: Number(fuelData.phonepe),
                paytm: Number(fuelData.paytm),
                cms: Number(fuelData.cms),
                pine: Number(fuelData.pine),
            },
            totalPaid: paidAmount,
            remaining,
            date: new Date().toLocaleString(),
        };

        try {
            await addDoc(collection(db, 'fuelRecords'), calculatedData);
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data: ', error);
            alert('Failed to save data!');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Fuel Calculator</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label>Petrol Rate: </label>
                    <input name="petrolRate" type="number" onChange={handleChange} required />
                    <label>Petrol New Reading: </label>
                    <input name="petrolNew" type="number" onChange={handleChange} required />
                    <label>Petrol Old Reading: </label>
                    <input name="petrolOld" type="number" onChange={handleChange} required />
                </div>

                <div>
                    <label>Diesel Rate: </label>
                    <input name="dieselRate" type="number" onChange={handleChange} required />
                    <label>Diesel New Reading: </label>
                    <input name="dieselNew" type="number" onChange={handleChange} required />
                    <label>Diesel Old Reading: </label>
                    <input name="dieselOld" type="number" onChange={handleChange} required />
                </div>

                <div className="col-span-2">
                    <h3 className="font-semibold mt-4">Payments</h3>
                    <label>Cash: </label>
                    <input name="cash" type="number" onChange={handleChange} />
                    <label>PhonePe: </label>
                    <input name="phonepe" type="number" onChange={handleChange} />
                    <label>Paytm: </label>
                    <input name="paytm" type="number" onChange={handleChange} />
                    <label>CMS OTP: </label>
                    <input name="cms" type="number" onChange={handleChange} />
                    <label>Pine: </label>
                    <input name="pine" type="number" onChange={handleChange} />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default FuelCalculator;

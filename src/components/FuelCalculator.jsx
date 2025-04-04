// src/components/FuelCalculator.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const FuelCalculator = () => {
    const [fuelData, setFuelData] = useState({
        petrolRate: '', petrolNew: '', petrolOld: '',
        dieselRate: '', dieselNew: '', dieselOld: '',
        cash: '', phonepe: '', paytm: '', cms: '', pine: '', sillakJama: ''
    });

    const [petrolUsed, setPetrolUsed] = useState(0);
    const [dieselUsed, setDieselUsed] = useState(0);
    const [petrolAmount, setPetrolAmount] = useState(0);
    const [dieselAmount, setDieselAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const petrolUsedCalc = (parseFloat(fuelData.petrolNew) || 0) - (parseFloat(fuelData.petrolOld) || 0);
        const dieselUsedCalc = (parseFloat(fuelData.dieselNew) || 0) - (parseFloat(fuelData.dieselOld) || 0);
        const petrolAmountCalc = petrolUsedCalc * (parseFloat(fuelData.petrolRate) || 0);
        const dieselAmountCalc = dieselUsedCalc * (parseFloat(fuelData.dieselRate) || 0);
        const totalAmountCalc = petrolAmountCalc + dieselAmountCalc;
        const paidAmountCalc =
            (parseFloat(fuelData.cash) || 0) +
            (parseFloat(fuelData.phonepe) || 0) +
            (parseFloat(fuelData.paytm) || 0) +
            (parseFloat(fuelData.cms) || 0) +
            (parseFloat(fuelData.pine) || 0) +
            (parseFloat(fuelData.sillakJama) || 0);

        setPetrolUsed(petrolUsedCalc);
        setDieselUsed(dieselUsedCalc);
        setPetrolAmount(petrolAmountCalc);
        setDieselAmount(dieselAmountCalc);
        setTotalAmount(totalAmountCalc);
        setPaidAmount(paidAmountCalc);
        setRemaining(totalAmountCalc - paidAmountCalc);
    }, [fuelData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuelData({ ...fuelData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const calculatedData = {
            petrol: {
                used: petrolUsed,
                rate: parseFloat(fuelData.petrolRate) || 0,
                amount: petrolAmount,
            },
            diesel: {
                used: dieselUsed,
                rate: parseFloat(fuelData.dieselRate) || 0,
                amount: dieselAmount,
            },
            totalAmount,
            payments: {
                cash: parseFloat(fuelData.cash) || 0,
                phonepe: parseFloat(fuelData.phonepe) || 0,
                paytm: parseFloat(fuelData.paytm) || 0,
                cms: parseFloat(fuelData.cms) || 0,
                pine: parseFloat(fuelData.pine) || 0,
                sillakJama: parseFloat(fuelData.sillakJama) || 0,
            },
            totalPaid: paidAmount,
            remaining,
            date: new Date().toLocaleString(),
        };

        try {
            await addDoc(collection(db, 'fuelcalculation'), calculatedData);
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data: ', error);
            alert('Failed to save data!');
        }
    };

    const inputField = (label, name, type = 'number', readOnly = false, value = '', required = false) => (
        <div className="flex flex-col">
            <label className="font-medium mb-1">{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                readOnly={readOnly}
                required={required}
                step="0.01"
                className={`p-2 rounded border ${readOnly ? 'bg-gray-200' : 'bg-white'}`}
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">⛽ Fuel Calculator</h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* FUEL INPUTS */}
                <section className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fuel Meter Readings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {inputField('⛽ Petrol Rate (₹)', 'petrolRate', 'number', false, fuelData.petrolRate, true)}
                        {inputField('🚛 Diesel Rate (₹)', 'dieselRate', 'number', false, fuelData.dieselRate, true)}
                        {inputField('🔁 Petrol New', 'petrolNew', 'number', false, fuelData.petrolNew, true)}
                        {inputField('🔁 Diesel New', 'dieselNew', 'number', false, fuelData.dieselNew, true)}
                        {inputField('📉 Petrol Old', 'petrolOld', 'number', false, fuelData.petrolOld, true)}
                        {inputField('📉 Diesel Old', 'dieselOld', 'number', false, fuelData.dieselOld, true)}
                        {inputField('🧮 Petrol Used', '', 'text', true, petrolUsed)}
                        {inputField('🧮 Diesel Used', '', 'text', true, dieselUsed)}
                    </div>
                </section>

                {/* PAYMENTS */}
                <section className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">💳 Payments</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {inputField('💼 Sillak Jama', 'sillakJama', 'number', false, fuelData.sillakJama)}
                        {inputField('💰 Cash', 'cash', 'number', false, fuelData.cash)}
                        {inputField('📱 PhonePe', 'phonepe', 'number', false, fuelData.phonepe)}
                        {inputField('📱 Paytm', 'paytm', 'number', false, fuelData.paytm)}
                        {inputField('🔐 CMS OTP', 'cms', 'number', false, fuelData.cms)}
                        {inputField('🏧 Pine', 'pine', 'number', false, fuelData.pine)}
                    </div>
                </section>

                {/* SUMMARY */}
                <section className="bg-gray-50 p-6 rounded-2xl shadow-inner border">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                        <p className="font-medium">Total Fuel Amount: <span className="text-green-700 font-bold">₹{totalAmount.toFixed(2)}</span></p>
                        <p className="font-medium">Paid Amount: <span className="text-blue-700 font-bold">₹{paidAmount.toFixed(2)}</span></p>
                        <p className="font-medium">Remaining: <span className="text-red-600 font-bold">₹{remaining.toFixed(2)}</span></p>
                    </div>
                </section>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 transition px-10 py-3 text-white text-lg font-semibold rounded-full shadow-md"
                    >
                        ✅ Save & Submit
                    </button>
                </div>
            </form>
        </div>
    );

};

export default FuelCalculator;

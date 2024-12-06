"use client";

import { useState } from "react";
import TextInput from "./TextInput";

export default function RoundInputForm({ register, errors }) {
  const [rounds, setRounds] = useState(0);
  const [fieldNames, setFieldNames] = useState([]);

  const handleRoundsChange = (e) => {
    const numberOfRounds = parseInt(e.target.value, 10);
    if (!isNaN(numberOfRounds) && numberOfRounds > 0) {
      setRounds(numberOfRounds);
      setFieldNames(Array.from({ length: numberOfRounds }, (_, i) => `round${i + 1}`));
    } else {
      setRounds(0);
      setFieldNames([]);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4">
        <label
          htmlFor="numRounds"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Number of Rounds:
        </label>
        <input
          type="number"
          id="numRounds"
          placeholder="Enter number of rounds"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          onChange={handleRoundsChange}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fieldNames.map((fieldName, index) => (
          <TextInput
            key={fieldName}
            label={`Round ${index + 1}`}
            name={fieldName}
            register={register}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}

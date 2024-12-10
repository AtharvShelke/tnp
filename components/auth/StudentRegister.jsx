import React from 'react';
import TextInput from '../FormInput/TextInput';

export default function StudentRegisterForm({ register, errors }) {
  return (
    <>
      <TextInput
        label="PRN"
        name="PRN"
        register={register}
        errors={errors}
        required
      />
      <TextInput
        label="First Name"
        name="fname"
        register={register}
        errors={errors}
        required
      />
      {/* Add more student-specific fields */}
    </>
  );
}

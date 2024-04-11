import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';



const EditUser: React.FC = () => {
  const { register, handleSubmit, control } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        {...register("name")} // регистрируем инпут в React Hook Form
        control={control}  // передаем control для Material UI
        defaultValue="John"  // устанавливаем значение по умолчанию
      />
      <TextField
        label="Email"
        type="email"
        {...register("email")}
        control={control}
        defaultValue="john@example.com"
      />
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default EditUser;
"use clinet";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  errors,
  placeholder,
  id,
  type,
  register,
  required,
}) => {
  return (
    <input
      id={id}
      type={type}
      autoComplete={id}
      {...register(id, { required })}
      placeholder={placeholder}
      className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
    />
  );
};

export default MessageInput;

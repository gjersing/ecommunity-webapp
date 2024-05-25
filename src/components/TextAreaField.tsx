import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Avatar,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type TextAreaFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  username?: string;
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  username,
  label,
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputGroup>
        {username ? (
          <InputLeftElement pointerEvents="none">
            <Avatar name={username} size="xs" />
          </InputLeftElement>
        ) : null}
        <Input
          {...field}
          name={props.name}
          placeholder={props.placeholder}
          id={field.name}
          resize="none"
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextAreaField;

import { User } from "lucide-react-native";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  Icon?: () => React.ReactElement;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  className?: string;
}

const InputField = ({
  label,
  labelStyle,
  className,
  Icon,
  value,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${className}`}>
          {label && (
            <Text className={`text-lg font-InterSemiBold mb-3 ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`flex flex-row justify-start items-center relative bg-background rounded-full border border-background focus:border-primary-500`}
          >
            {Icon && <Icon />}
            <TextInput
              className={`rounded-full p-4 font-InterSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;

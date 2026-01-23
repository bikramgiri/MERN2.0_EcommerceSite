export interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: {
    username?: string;
    email: string;
    password: string;
  };
  errors: {
    username?: string;
    email: string;
    password: string;
    general: string;
  };
  message: string;
  passwordStrength: {
    score: number;
    label: string;
    color: string;
  };
};

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}


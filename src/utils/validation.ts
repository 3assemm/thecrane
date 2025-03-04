export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateProjectName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100;
};

export const validateNumericInput = (value: number, min: number, max: number): boolean => {
  return !isNaN(value) && value >= min && value <= max;
};

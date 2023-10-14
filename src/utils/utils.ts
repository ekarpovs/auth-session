import bcrypt from "bcrypt";

export const cryptUtils = () => {
  const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR) || 10;
  
  const hash = async (password: string) => {
    return await bcrypt.hash(password, SALT_WORK_FACTOR);
  };

  const compare = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  };
  return { hash, compare };
};


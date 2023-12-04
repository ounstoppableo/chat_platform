export default () => {
  const token = localStorage.getItem('token') || null;
  return token;
};

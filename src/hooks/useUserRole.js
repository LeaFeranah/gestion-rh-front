const useUserRole = () => {
  return {
    role: localStorage.getItem("role") || "ADMIN",
    sections: JSON.parse(localStorage.getItem("sections") || "[]"),
  };
};

export default useUserRole;
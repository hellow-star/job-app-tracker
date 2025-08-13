export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded font-medium focus:outline-none focus:ring";
  const variants = {
    primary: `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300`,
    secondary: `${base} bg-gray-200 hover:bg-gray-300 focus:ring-gray-300`,
    danger: `${base} bg-red-600 text-white hover:bg-red-700 focus:ring-red-300`
  };
  return <button className={variants[variant]} {...props}>{children}</button>;
}
export const RecklessBearLogo = ({ size = 80 }: { size?: number }) => {
  return (
    <div className="flex justify-center items-center" style={{ height: size, width: size }}>
      <img
        src="/reckless-bear-logo.png"
        alt="Reckless Bear Logo"
        width={size}
        height={size}
        style={{ filter: 'drop-shadow(0 0 10px hsl(var(--secondary))) drop-shadow(0 0 20px hsl(var(--secondary) / 0.6))' }}
      />
    </div>
  );
};
// src/components/ProgressBar.jsx
function ProgressBar({ value,color }) {
  // value is a number from 0 to 100
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-20 bg-neutral-800 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${color || 'bg-emerald-500'} transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;

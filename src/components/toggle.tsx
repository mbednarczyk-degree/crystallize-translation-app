type ToggleProps = {
  state: "selected" | "unselected";
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Toggle: React.FC<ToggleProps> = ({ state, handleChange }: ToggleProps) => {
  return (
    <div className="inline-block">
      <label className="flex items-center cursor-pointer select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={state === "selected" ? true : false}
            onChange={handleChange}
            className="sr-only"
          />
          <div
            className={`box block h-6 w-12 rounded-full ${state === "selected" ? "bg-s-green-600" : "bg-gray-200"}`}
          ></div>
          <div
            className={`absolute left-2 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-50 transition ${
              state === "selected" ? "translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

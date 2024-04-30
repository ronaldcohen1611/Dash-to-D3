import { debounce } from 'lodash';

const ColorPicker = ({
  setGraphColor,
  defaultColor,
}: {
  setGraphColor: (color: string) => void;
  defaultColor?: string;
}) => {
  const debouncedSetGraphColor = debounce((color: string) => {
    setGraphColor(color);
  }, 10);
  return (
    <div className="relative">
      <input
        type="color"
        className="w-6 h-6 rounded-md bg-black text-white"
        onChange={(e) => {
          debouncedSetGraphColor(e.target.value);
        }}
        defaultValue={defaultColor ?? '#232423'}
      />
    </div>
  );
};

export { ColorPicker };

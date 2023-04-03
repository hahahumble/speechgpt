interface SettingSelectorProps {
  selected: string | null;
  onSelect: (item: string) => void;
  catalogItems: string[];
  catalogIcons: JSX.Element[];
}

function SettingSelector({ selected, onSelect, catalogItems, catalogIcons }: SettingSelectorProps) {
  return (
    <div className="w-52 px-2">
      {catalogItems.map((item, key) => (
        <div
          key={item}
          className={`py-1 rounded-lg hover:bg-gray-200 text-gray-700 hover:text-black cursor-pointer text-left pl-4 flex flex-row space-x-2 items-center ${
            item === selected ? 'selected bg-gray-300 font-medium' : ''
          }`}
          onClick={() => onSelect(item)}
        >
          <div>{catalogIcons[key]}</div>
          <div>{item}</div>
        </div>
      ))}
    </div>
  );
}

export default SettingSelector;

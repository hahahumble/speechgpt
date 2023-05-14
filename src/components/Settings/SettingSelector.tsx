interface SettingSelectorProps {
  selected: string | null;
  onSelect: (item: string) => void;
  catalogItems: string[];
  catalogIcons: JSX.Element[];
}

function SettingSelector({ selected, onSelect, catalogItems, catalogIcons }: SettingSelectorProps) {
  return (
    <div className="w-auto px-2">
      {catalogItems.map((item, key) => (
        <div
          key={item}
          className={`font-medium py-1 rounded-lg hover:bg-slate-200 text-gray-600 hover:text-black cursor-pointer text-left pl-4 pr-6 flex flex-row space-x-2 items-center ${
            item === selected ? 'text-gray-800 selected bg-slate-200 hover:bg-slate-200' : ''
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

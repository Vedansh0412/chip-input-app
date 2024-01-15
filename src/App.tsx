// App.tsx
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import './App.css'; // Import your CSS file for styling

interface Chip {
  id: number;
  label: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: string[] = ['Nick Giannopoulos', 'John Doe', 'Jane Doe', 'Alice', 'Bob'];

  const filterItems = (query: string): string[] => {
    const selectedLabels = chips.map((chip) => chip.label);
    return items
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => !selectedLabels.includes(item)); // Exclude selected items
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query);
    setFilteredItems(filterItems(query));
  };

  const handleItemClick = (item: string) => {
    const newChips = [...chips, { id: Date.now(), label: item }];
    setChips(newChips);
    setFilteredItems(filteredItems.filter((i) => i !== item));
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleChipRemove = (chipId: number) => {
    const removedChip = chips.find((chip) => chip.id === chipId);
    if (removedChip) {
      setChips(chips.filter((chip) => chip.id !== chipId));
      setFilteredItems([...filteredItems, removedChip.label]);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && inputValue === '') {
        const lastChip = chips[chips.length - 1];
        if (lastChip) {
          handleChipRemove(lastChip.id);
        }
      }
    };

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown as any);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown as any);
      }
    };
  }, [inputValue, chips]);

  return (
    <div className="app">
      <div className="chips-container">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type to filter..."
        />
        {chips.map((chip) => (
          <div key={chip.id} className="chip">
            {/* Add an avatar image */}
            <img
              src={`https://avatars.dicebear.com/api/human/${chip.label}.svg`}
              alt="avatar"
              style={{ marginRight: '8px', borderRadius: '50%', width: '24px', height: '24px' }}
            />
            {/* Add a small space */}
            {chip.label}
            <span onClick={() => handleChipRemove(chip.id)}>X</span>
          </div>
        ))}
      </div>
      {filteredItems.length > 0 && (
        <ul className="item-list">
          {filteredItems.map((item) => (
            <li key={item} onClick={() => handleItemClick(item)}>
              {/* Add an avatar image to the filtered items list */}
              <img
                src={`https://avatars.dicebear.com/api/human/${item}.svg`}
                alt="avatar"
                style={{ marginRight: '8px', borderRadius: '50%', width: '24px', height: '24px' }}
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import "./search.css";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="searchable-select" ref={wrapperRef}>
      {/* Trigger */}
      <button
        type="button"
        className={`searchable-select-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={!selectedOption ? "placeholder" : ""}>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`select-chevron ${open ? "rotate" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="searchable-select-dropdown">
          {/* Search */}
          <div className="select-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Options */}
          <div className="select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const selected = option.value === value;

                return (
                  <button
                    type="button"
                    key={option.value}
                    className={`select-option ${selected ? "selected" : ""}`}
                    onClick={() => handleSelect(option)}
                  >
                    <span>{option.label}</span>

                    {selected && <Check size={17} className="option-check" />}
                  </button>
                );
              })
            ) : (
              <div className="no-options">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

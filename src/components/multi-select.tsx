import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Option = {
  key: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  onChange: (selectedKeys: string[]) => void;
  label?: string;
  selectedOptions?: string[];
}

const MultiSelect = ({
  options,
  onChange,
  label = "Select Options",
  selectedOptions,
}: MultiSelectProps) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    selectedOptions || []
  );

  const toggleOption = (key: string) => {
    const newSelection = selectedKeys.includes(key)
      ? selectedKeys.filter((k) => k !== key)
      : [...selectedKeys, key];

    setSelectedKeys(newSelection);
    onChange(newSelection);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 text-foreground">
          <span>{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(({ key, value }) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={selectedKeys.includes(key)}
            onCheckedChange={() => toggleOption(key)}
            onSelect={(e) => e.preventDefault()}
          >
            {value}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;

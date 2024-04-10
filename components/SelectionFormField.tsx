"use client";
import { useState } from "react";
import { Popover, PopoverContent } from "./ui/popover"
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

const SelectionFormField = ({ label, selectedValue, optionsArray, placeholder,onSelect, getItem }: {
    selectedValue: number | null,
    optionsArray: any;
    placeholder: string;
    label: string;
    onSelect: (value: number, name: string) => void
    getItem?: (item: any) => void
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <FormItem className="flex flex-col">
            <FormLabel className="mt-2">{label}</FormLabel>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={'outline'}
                            role="combobox"
                            aria-expanded={isOpen}
                            className="w-[500px] justify-start"
                            disabled={optionsArray.length === 0}
                            name={label}
                        >
                            {
                                selectedValue ? optionsArray.find((item: any) => item.id == selectedValue)?.name : `Select ${placeholder}`
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0">
                    <Command>
                        <CommandInput placeholder={`search ${placeholder} ...`} />
                        <CommandEmpty>No result Found.</CommandEmpty>
                        <CommandGroup>
                            {optionsArray.map((item: any) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={() => {
                                        onSelect(item.id, item.name);
                                        setIsOpen(false);
                                        if (getItem) {
                                            getItem(item);
                                        }
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", selectedValue === item.id ? "opacity-100" : "opacity-0")} />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </FormItem>
    )
}

export default SelectionFormField
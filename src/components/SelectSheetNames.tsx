import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function SelectSheetNames({
	sheetNames,
	value,
	onChange,
}: {
	sheetNames: string[]
	value: string
	onChange: (value: string) => void
}) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value
						? sheetNames.find((name) => name === value)
						: 'Select sheet name...'}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className=" p-0">
				<Command>
					<CommandInput placeholder="Search sheet name..." />
					<CommandList>
						<CommandEmpty>No sheet name found.</CommandEmpty>
						<CommandGroup>
							{sheetNames.map((name) => (
								<CommandItem
									key={name}
									value={name}
									onSelect={(currentValue) => {
										onChange(currentValue === value ? '' : currentValue)
										setOpen(false)
									}}
								>
									<CheckIcon
										className={cn(
											'mr-2 h-4 w-4',
											value === name ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function InputFile({
	className,
	onChange,
}: {
	onChange: (file: File | null) => void
	className?: string
}) {
	return (
		<div className={cn('grid w-full items-center gap-3', className)}>
			<Label htmlFor="file">Excel File</Label>
			<Input
				id="file"
				type="file"
				accept=".xlsx,.xls"
				onChange={(e) => {
					onChange(e.target.files?.[0] ?? null)
				}}
			/>
		</div>
	)
}

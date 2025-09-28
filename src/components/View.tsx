import { CopyIcon } from 'lucide-react'
import { Fragment, forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'
import { copyToClipboard } from '@/lib/clipboard'
import type { LangMap } from '@/lib/download'
import { Button } from './ui/button'

export interface ViewRef {
	selectKeys: string[]
}

const View = forwardRef<ViewRef, { langMap: LangMap }>(({ langMap }, ref) => {
	const langKeys = Object.keys(langMap)
	const [selectKeys, setSelectKeys] = useState<string[]>(langKeys)

	const handleCopy = async (langKey: string) => {
		const content = JSON.stringify(langMap[langKey], null, 2)
		await copyToClipboard(content)
		toast.success('Copied to clipboard')
	}

	const handleSelectAll = () => {
		if (selectKeys.length === langKeys.length) {
			setSelectKeys([])
			return
		}
		setSelectKeys(langKeys)
	}

	const handleSelect = (langKey: string) => {
		setSelectKeys((prev) => {
			if (prev.includes(langKey)) {
				return prev.filter((key) => key !== langKey)
			}
			return [...prev, langKey]
		})
	}

	useImperativeHandle(ref, () => ({
		selectKeys,
	}))

	return (
		<div className="w-full mt-4">
			<div className="flex items-center gap-2 mb-2">
				<Checkbox
					id="select-all"
					checked={selectKeys.length === langKeys.length}
					onCheckedChange={handleSelectAll}
				/>
				<Label htmlFor="select-all">
					Select all ({selectKeys.length}/{langKeys.length})
				</Label>
			</div>
			<ResizablePanelGroup
				direction="horizontal"
				className="min-h-[200px] rounded-lg border"
			>
				{langKeys.map((langKey, index) => {
					const num = Object.keys(langMap[langKey]).length
					return (
						<Fragment key={langKey}>
							<ResizablePanel defaultSize={100 / langKeys.length}>
								<div className="">
									<h3 className="font-semibold mb-4 p-2 bg-gray-100 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Checkbox
												id={langKey}
												checked={selectKeys.includes(langKey)}
												onCheckedChange={() => handleSelect(langKey)}
											/>
											<Label htmlFor={langKey}>
												<span className="line-clamp-1	break-all">
													{langKey}
												</span>
												({num})
											</Label>
										</div>

										<Button
											variant="outline"
											size="icon"
											onClick={() => handleCopy(langKey)}
										>
											<CopyIcon className="size-4" />
										</Button>
									</h3>
									<pre className="whitespace-pre-wrap px-2">
										{JSON.stringify(langMap[langKey], null, 2)}
									</pre>
								</div>
							</ResizablePanel>
							{index !== langKeys.length - 1 && <ResizableHandle withHandle />}
						</Fragment>
					)
				})}
			</ResizablePanelGroup>
		</div>
	)
})
View.displayName = 'View'

export default View

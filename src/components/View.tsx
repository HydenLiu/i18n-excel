import { CopyIcon } from 'lucide-react'
import { Fragment } from 'react'
import { toast } from 'sonner'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'
import { copyToClipboard } from '@/lib/clipboard'
import type { LangMap } from '@/lib/download'
import { Button } from './ui/button'

const View = ({ langMap }: { langMap: LangMap }) => {
	const langKeys = Object.keys(langMap)

	const handleCopy = async (langKey: string) => {
		const content = JSON.stringify(langMap[langKey], null, 2)
		await copyToClipboard(content)
		toast.success('Copied to clipboard')
	}

	return (
		<div className="w-full mt-4">
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
										<div>
											{langKey}({num}):
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
}

export default View

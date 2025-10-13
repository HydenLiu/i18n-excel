import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import XLSX, { type WorkBook } from 'xlsx'
import { InputFile } from '@/components/InputFile'
import { SelectSheetNames } from './components/SelectSheetNames'
import { Button } from './components/ui/button'
import {
	downloadFilesToZip,
	type LangMap,
	type SheetData,
} from './lib/download'
import './App.css'
import { Toaster, toast } from 'sonner'
import View, { type ViewRef } from './components/View'

const App = () => {
	const [workbook, setWorkbook] = useState<WorkBook | null>(null)
	const [selectedSheetName, setSelectedSheetName] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [langMapData, setLangMapData] = useState<LangMap>({})
	const { SheetNames, Sheets = {} } = workbook || {}
	const viewRef = useRef<ViewRef>(null)

	async function handleFileChange(file: File | null) {
		if (!file) return
		setLoading(true)
		const data = await file.arrayBuffer()
		const workbook = XLSX.read(data)
		setWorkbook(workbook)
		setLoading(false)
	}

	const onSheetNameChange = (value: string) => {
		if (!Sheets) return
		setSelectedSheetName(value)
		const sheetData: SheetData[] = XLSX.utils.sheet_to_json(Sheets?.[value])

		const langMap: LangMap = {}
		const keys: string[] = []
		for (let i = 0; i < sheetData.length; i++) {
			const row = sheetData[i]
			let rowKey = ''
			if (row.key || row.Key || row.KEY) {
				rowKey = row.key || row.Key || row.KEY
			} else {
				rowKey = row['英'] || row['英语'] || row.en || `${i + 1}`

				rowKey = (rowKey || '')
					.split(' ')
					.slice(0, 5)
					.join('_')
					.replace(/[\u4e00-\u9fa5,;，。、.!《》:/()[\]【】{}@#$%^&*"'-]/g, '_')
					.toLocaleLowerCase()
					.replace(/_+/g, '_') // 移除连续的下划线
					.replace(/^_|_$/g, '') // 移除首尾的下划线
			}

			if (keys.includes(rowKey)) {
				rowKey = `${rowKey}_${i + 1}`
			}
			keys.push(rowKey)
			for (const key in row) {
				if (key?.toLowerCase() === 'key') continue
				langMap[key] = langMap[key] || {}
				langMap[key][rowKey] = row[key]
			}
		}

		setLangMapData(langMap)
	}

	const btnDisabled = Object.keys(langMapData).length === 0

	const handleDownload = () => {
		const selectKeys = viewRef.current?.selectKeys || []
		if (selectKeys.length === 0) {
			toast.error('Please select at least one language')
			return
		}
		const langMap = selectKeys.reduce((acc: LangMap, key: string) => {
			acc[key] = langMapData[key]
			return acc
		}, {})
		downloadFilesToZip(langMap)
	}

	return (
		<div className="py-10 px-4">
			<div className="max-w-md mx-auto">
				<div className="mb-4 flex items-end gap-2">
					<InputFile onChange={handleFileChange} />
					<Button onClick={handleDownload} disabled={btnDisabled}>
						Download
					</Button>
				</div>
				{loading && <Loader2 className="animate-spin w-4 h-4" />}

				{SheetNames && SheetNames?.length > 0 && (
					<SelectSheetNames
						value={selectedSheetName}
						onChange={onSheetNameChange}
						sheetNames={SheetNames}
					/>
				)}
			</div>
			{!btnDisabled && <View ref={viewRef} langMap={langMapData} />}

			<Toaster />
		</div>
	)
}

export default App

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
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

const App = () => {
	const [workbook, setWorkbook] = useState<WorkBook | null>(null)
	const [selectedSheetName, setSelectedSheetName] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [langMapData, setLangMapData] = useState<LangMap>({})
	const { SheetNames, Sheets = {} } = workbook || {}

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
			let rowKey = row.key || row['英'] || row['英语'] || row.en || `${i + 1}`
			// rowKey去掉空格/中文/中划线/冒号/斜杠/引号/括号/等特殊字符
			rowKey = rowKey
				?.split(' ')
				?.slice(0, 5)
				?.join('_')
				?.replace(/[\u4e00-\u9fa5,;，。、.!《》]/g, '')
				?.replace(/[-:/()[\]【】{}"']/g, '_')
				?.toLocaleLowerCase()
			if (keys.includes(rowKey)) {
				rowKey = `${rowKey}_${i + 1}`
			}
			keys.push(rowKey)
			for (const key in row) {
				langMap[key] = langMap[key] || {}
				langMap[key][rowKey] = row[key]
			}
		}
		setLangMapData(langMap)
	}

	const btnDisabled = Object.keys(langMapData).length === 0

	return (
		<div className="py-10 px-4">
			<div className="max-w-sm mx-auto">
				<div className="mb-4 flex items-end gap-2">
					<InputFile onChange={handleFileChange} />
					<Button
						onClick={() => downloadFilesToZip(langMapData)}
						disabled={btnDisabled}
					>
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
		</div>
	)
}

export default App

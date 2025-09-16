import { toast } from 'sonner'

export const copyToClipboard = async (content: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(content)
	} catch (e) {
		const message =
			'Unable to copy to clipboard. Please ensure clipboard permissions are granted.'
		console.error(e)
		toast.error(message)
		throw new Error(message)
	}
}

import * as vscode from "vscode"
import { SelectedResources, ShowOpenDialogueRequest } from "@/shared/proto/host/window"

export async function showOpenDialogue(request: ShowOpenDialogueRequest): Promise<SelectedResources> {
	const options: vscode.OpenDialogOptions = {}

	if (request.canSelectMany !== undefined) {
		options.canSelectMany = request.canSelectMany
	}

	if (request.openLabel !== undefined) {
		options.openLabel = request.openLabel
	}

	if (request.filters?.files) {
		const extensions = request.filters.files
		const hasImageExtensions = extensions.some((ext: string) =>
			["png", "jpg", "jpeg", "gif", "webp"].includes(ext.toLowerCase())
		)

		options.filters = {}
		options.filters[hasImageExtensions ? "Files & Images" : "Files"] = extensions
		options.filters["All Files"] = ["*"]
	}

	const selectedResources = await vscode.window.showOpenDialog(options)

	// Convert back to path format
	return SelectedResources.create({
		paths: selectedResources ? selectedResources.map((uri) => uri.fsPath) : [],
	})
}
